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

async function openplatformLogin(state) {
  if (!openplatform.connected()) {
    const token = state.profileReducer.user.openplatformToken;
    if (!token) {
      throw new Error('missing openplatformToken');
    }
    await openplatform.connect(token);
  }
}

export const orderMiddleware = store => next => action => {
  switch (action.type) {
    case ORDER: {
      const state = store.getState();

      if (!state.profileReducer.user.openplatformToken) {
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

      if (state.orderReducer.get('pickupBranches').size === 0) {
        (async () => {
          await openplatformLogin(state);

          let user;
          try {
            user = await openplatform.user();
          } catch (e) {
            // Dummy as we do not have proper logged in users yet
            user = {agency: '710100'};
          }
          const agency = user.agency;

          if (state.orderReducer.get('pickupBranches').size === 0) {
            store.dispatch({
              type: PICKUP_BRANCHES,
              branches: await openplatform.libraries({
                agencyIds: [agency],
                fields: ['branchId', 'branchName']
              })
            });
          }
        })();
      }

      if (
        !state.orderReducer.getIn(
          ['orders', action.book.pid, 'availability'],
          false
        )
      ) {
        (async () => {
          await openplatformLogin(state);
          const availability = await openplatform.availability({
            pid: action.book.pid
          });
          store.dispatch({
            type: AVAILABILITY,
            pid: action.book.pid,
            availability
          });
        })();
      }
      return next(action);
    }
    case ORDER_START: {
      (async () => {
        try {
          await openplatform.order({
            pids: [action.pid],
            library: action.branch
          });

          store.dispatch({
            type: ORDER_SUCCESS,
            pid: action.pid
          });
        } catch (e) {
          // eslint-disable-next-line
          console.log('Error on order:', e);
          store.dispatch({
            type: ORDER_FAILURE,
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
