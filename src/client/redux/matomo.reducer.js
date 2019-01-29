export const MATOMO_RID = 'MATOMO_RID';

const defaultState = {
  rids: {}
};

const matomoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case MATOMO_RID:
      return {...state, rids: {...state.rids, [action.key]: action.rid}};
    default:
      return state;
  }
};

export default matomoReducer;
