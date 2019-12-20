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

export const loadKiosk = ({kioskKey}) => {
  return async (dispatch, getState) => {
    if (getState().kiosk.isLoading) {
      return;
    }
    dispatch({
      type: KIOSK_RESPONSE,
      response: {isLoading: true, loaded: false}
    });

    if (kioskKey) {
      // kioskKey is provided as URL param, persist it in localstorage
      setItem('kioskkey', {kioskKey}, version, 'localstorage');
    } else {
      // kioskKey is not provided, fetch it from localstorage
      const kiosk = getItem('kioskkey', version, {}, 'localstorage');
      kioskKey = kiosk && kiosk.kioskKey;
    }
    let configuration;
    try {
      configuration = await fetchKioskConfiguration(kioskKey);
    } catch (e) {
      dispatch({
        type: KIOSK_RESPONSE,
        response: {
          kioskKey,
          error: 'Kiosk-nøglen kunne ikke valideres',
          isLoading: false,
          loaded: true
        }
      });
      return;
    }
    dispatch({
      type: KIOSK_RESPONSE,
      response: {
        ...configuration,
        kioskKey,
        isLoading: false,
        loaded: true
      }
    });
  };
};

const fetchKioskConfiguration = async kioskKey => {
  return (await request.post('/v1/kiosk').send({kioskKey})).body;
};
