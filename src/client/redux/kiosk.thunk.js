import request from 'superagent';
import {KIOSK_RESPONSE} from './kiosk.reducer';
import {setItem, getItem} from '../utils/localstorage';

const version = 1;

export const storeKiosk = kiosk => {
  return async dispatch => {
    setItem(
      'kiosk',
      {clientId: kiosk.clientId, clientSecret: kiosk.clientSecret},
      version,
      'localstorage'
    );

    if (!kiosk.clientId || !kiosk.clientSecret) {
      dispatch({
        type: KIOSK_RESPONSE,
        response: {...kiosk, error: 'Der mangler information'}
      });
      return;
    }
    let configuration;
    try {
      configuration = await fetchKioskConfiguration(
        kiosk.clientId,
        kiosk.clientSecret
      );
    } catch (e) {
      dispatch({
        type: KIOSK_RESPONSE,
        response: {
          ...kiosk,
          error: 'klient ID og hemmelighed kunne ikke genkendes',
          configuration: null
        }
      });
      return;
    }

    dispatch({
      type: KIOSK_RESPONSE,
      response: {...kiosk, ...configuration, error: null}
    });
  };
};

export const loadKiosk = () => {
  return async (dispatch, getState) => {
    if (getState().kiosk.isLoading) {
      return;
    }
    dispatch({
      type: KIOSK_RESPONSE,
      response: {isLoading: true, loaded: false}
    });
    const kiosk = getItem('kiosk', version, {}, 'localstorage');
    delete kiosk.enabled;
    delete kiosk.configured;
    let configuration;
    if (kiosk.clientId && kiosk.clientSecret) {
      try {
        configuration = await fetchKioskConfiguration(
          kiosk.clientId,
          kiosk.clientSecret
        );
      } catch (e) {
        dispatch({
          type: KIOSK_RESPONSE,
          response: {
            ...kiosk,
            error: 'Vi kan ikke genkende id og hemmelighed',
            isLoading: false,
            loaded: true
          }
        });
        return;
      }
    }
    dispatch({
      type: KIOSK_RESPONSE,
      response: {...kiosk, ...configuration, isLoading: false, loaded: true}
    });
  };
};

const fetchKioskConfiguration = async (clientId, clientSecret) => {
  return (await request.post('/v1/kiosk').send({clientId, clientSecret})).body;
};
