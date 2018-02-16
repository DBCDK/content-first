import {fetchProfileRecommendations} from '../utils/requester';
import {
  LOAD_TASTES_RESPONSE,
  ADD_TASTE_ELEMENT,
  REMOVE_TASTE_ELEMENT,
  ADD_TASTE_ARCHETYPE,
  REMOVE_CURRENT_TASTE,
  CREATE_TASTE,
  LOAD_TASTES
} from './taste.reducer';

import {saveTastes, getTastes} from '../utils/tastes';

export const tasteMiddleware = store => next => action => {
  switch (action.type) {
    case ADD_TASTE_ELEMENT:
    case REMOVE_TASTE_ELEMENT:
    case REMOVE_CURRENT_TASTE:
    case CREATE_TASTE:
    case ADD_TASTE_ARCHETYPE: {
      const res = next(action);
      const {
        profiles,
        currentTaste
      } = store.getState().tasteReducer.profileTastes;
      saveTastes(profiles, currentTaste);
      fetchProfileRecommendations(profiles[currentTaste], store.dispatch);
      return res;
    }
    case LOAD_TASTES:
      getTastes(profileTastes => {
        store.dispatch({
          type: LOAD_TASTES_RESPONSE,
          profileTastes
        });
      });
      return next(action);
    default:
      return next(action);
  }
};
