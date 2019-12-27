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

export const loadKiosk = ({branchKey}) => {
  return async (dispatch, getState) => {
    if (getState().kiosk.isLoading) {
      return;
    }
    dispatch({
      type: KIOSK_RESPONSE,
      response: {isLoading: true, loaded: false}
    });

    if (branchKey) {
      // branchKey is provided as URL param, persist it in localstorage
      setItem('branchKey', {branchKey}, version, 'localstorage');
    } else {
      // branchKey is not provided, fetch it from localstorage
      const kiosk = getItem('branchKey', version, {}, 'localstorage');
      branchKey = kiosk && kiosk.branchKey;
    }
    let configuration;
    try {
      configuration = await fetchKioskConfiguration(branchKey);
    } catch (e) {
      dispatch({
        type: KIOSK_RESPONSE,
        response: {
          branchKey,
          error: 'Kiosk-nøglen kunne ikke valideres',
          isLoading: false,
          loaded: true,
          configuration: null
        }
      });
      return;
    }
    dispatch({
      type: KIOSK_RESPONSE,
      response: {
        ...configuration,
        branchKey,
        isLoading: false,
        loaded: true,
        error: null
      }
    });
  };
};

const fetchKioskConfiguration = async branchKey => {
  return (await request.post('/v1/kiosk').send({branchKey})).body;
};
