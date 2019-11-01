const defaultState = {
  enabled: false,
  loaded: false
};

export const KIOSK_RESPONSE = 'KIOSK_RESPONSE';

const kioskReducer = (state = defaultState, action) => {
  switch (action.type) {
    case KIOSK_RESPONSE:
      return Object.assign({}, state, action.response);
    default:
      return state;
  }
};

export default kioskReducer;
