const defaultState = {};

export const SCROLL_TO_COMPONENT = 'SCROLL_TO_COMPONENT';
export const SCROLL_TO_COMPONENT_COMPLETE = 'SCROLL_TO_COMPONENT_COMPLETE';

function scrollToComponentReducer(state = defaultState, action) {
  switch (action.type) {
    case SCROLL_TO_COMPONENT:
      return {...state, [action.id]: true};
    case SCROLL_TO_COMPONENT_COMPLETE: {
      const newState = {...state};
      delete newState[action.id];
      return newState;
    }
    default:
      return state;
  }
}

export default scrollToComponentReducer;
