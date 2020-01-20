import {ON_INIT_REDUCER_RESPONSE} from '../redux/root.reducer';
import {OPEN_MODAL} from '../redux/modal.reducer';
import request from 'superagent';

export default async store => {
  let serverInitialState = {};
  try {
    serverInitialState = (await request.get('/v1/initial-state')).body.data;
    store.dispatch({
      type: ON_INIT_REDUCER_RESPONSE,
      state: serverInitialState
    });
  } catch (e) {
    store.dispatch({
      type: OPEN_MODAL,
      modal: 'confirm',
      context: {
        title: 'Der er sket en fejl',
        reason:
          'Der er sket en fejl ved indlæsning. Genindlæs venligst siden eller prøv igen senere.',
        confirmText: 'Genindlæs siden',
        hideCancel: true,
        onConfirm: () => {
          window.location.reload();
        }
      }
    });
    console.error('could not fetch initial state', e);
  }
};
