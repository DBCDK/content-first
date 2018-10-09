import openplatform from 'openplatform';
import {OPEN_MODAL} from './modal.reducer';
import {
  ORDER,
  ORDER_START,
  ORDER_SUCCESS,
  ORDER_FAILURE,
  PICKUP_BRANCHES,
  AVAILABILITY
} from './order.reducer';
import {fetchAnonymousToken} from '../utils/requester';

async function openplatformLogin(state) {
  if (!openplatform.connected()) {
    const token = state.userReducer.openplatformToken;
    if (!token) {
      throw new Error('missing openplatformToken');
    }
    await openplatform.connect(token);
  }
}

async function getCollectionPids(pid) {
  const access_token = await fetchAnonymousToken();

  return (await openplatform.work({
    pids: [pid],
    access_token,
    fields: ['collectionDetails']
  }))[0].collectionDetails
    .filter(o => o.workType[0] === 'book')
    .map(o => o.pid[0]);
}

let librariesPromise;
function fetchPickupBranches({store}) {
  if (!librariesPromise) {
    const state = store.getState();
    librariesPromise = (async () => {
      await openplatformLogin(state);

      const user = await openplatform.user();

      if (state.orderReducer.get('pickupBranches').size === 0) {
        store.dispatch({
          type: PICKUP_BRANCHES,
          branches: await openplatform.libraries({
            agencyIds: [user.agency],
            fields: ['branchId', 'branchName']
          })
        });
      }
    })();
  }
}

function fetchAvailability({store, pid}) {
  const state = store.getState();
  if (!state.orderReducer.getIn(['orders', pid, 'availability'])) {
    (async () => {
      await openplatformLogin(state);
      let availability;
      for (let i = 1; i <= 20; ++i) {
        try {
          const pids = await getCollectionPids(pid);
          availability = await openplatform.availability({pids});
          availability =
            availability.filter(o => o && o.orderPossible)[0] ||
            availability[0];

          // ensure that orderPossible is set to either true or false
          availability.orderPossible = availability.orderPossible
            ? true
            : false;
          break;
        } catch (e) {
          store.dispatch({
            type: 'LOG_ERROR',
            msg: 'retry fetch availability',
            pid
          });
        }
      }
      store.dispatch({
        type: AVAILABILITY,
        pid: pid,
        availability
      });
    })();
  }
}

export const orderMiddleware = store => next => action => {
  switch (action.type) {
    case ORDER: {
      if (!store.getState().userReducer.openplatformToken) {
        store.dispatch({
          type: OPEN_MODAL,
          modal: 'login',
          context: {
            title: 'BESTIL',
            reason: 'Du skal logge ind for at bestille bøger.'
          }
        });
        return next(action);
      }

      store.dispatch({type: OPEN_MODAL, modal: 'order'});
      fetchPickupBranches({store});
      fetchAvailability({store, pid: action.book.pid});

      return next(action);
    }
    case ORDER_START: {
      (async () => {
        try {
          const pids = await getCollectionPids(action.pid);
          await openplatform.order({
            pids,
            pickUpBranch: action.branch
          });
          store.dispatch({
            type: ORDER_SUCCESS,
            pid: action.pid
          });
        } catch (e) {
          store.dispatch({
            type: ORDER_FAILURE,
            error: String(e),
            pid: action.pid
          });
        }
      })();
      return next(action);
    }
    default:
      return next(action);
  }
};
