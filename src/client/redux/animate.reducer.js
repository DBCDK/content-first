const defaultState = {};

export const ANIMATE_START = 'ANIMATE_START';
export const ANIMATE_STOP = 'ANIMATE_STOP';

const animateReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ANIMATE_START: {
      if (!action.name) {
        throw new Error('! No animation name found');
      }
      if (!action.component) {
        throw new Error('! No component found');
      }
      if (!action.from || !action.to) {
        throw new Error('! You need to set both a "from" and "to" position');
      }

      console.log('ANIMATE_START');

      const newState = Object.assign({}, state, {
        ...state,
        [action.name]: {
          name: action.name,
          component: action.component,
          from: action.from,
          to: action.to,
          onEnd: action.onEnd,
          animating: true,
          animated: false
        }
      });

      return newState;
    }

    case ANIMATE_STOP: {
      if (!action.name) {
        throw new Error('! No animation name found');
      }

      console.log('ANIMATE_STOP');

      return Object.assign({}, state, {
        [action.name]: {
          animating: false,
          animated: true
        }
      });
    }

    default:
      return state;
  }
};

export const startAnimate = animate => {
  console.log('startAnimate action', animate);

  return {
    type: ANIMATE_START,
    name: animate.name,
    component: animate.component,
    from: animate.from,
    to: animate.to,
    onEnd: animate.onEnd
  };
};

export const stopAnimate = name => {
  console.log('stopAnimate name', name);

  return {
    type: ANIMATE_STOP,
    name
  };
};

export default animateReducer;
