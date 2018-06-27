export const INTERACTION = 'INTERACTION';
export const FETCH_INTERACTIONS = 'FETCH_INTERACTIONS';
export const FETCH_INTERACTIONS_SUCCESS = 'FETCH_INTERACTIONS_SUCCESS';
export const FETCH_INTERACTIONS_ERROR = 'FETCH_INTERACTIONS_ERROR';

const defaultState = {
  interactions: []
};

const interactionReducer = (state = defaultState, action) => {
  switch (action.type) {
    case INTERACTION: {
      return { ...state,
        interactions: [
          ...state.interactions,
          {
            type: 'INTERACTION',
            interaction: action.interaction,
            pid: action.pid
          }
        ]
      }
    }

    case FETCH_INTERACTIONS: {
      return {...state, interactions: [...state.interactions], isLoading: true};
    }

    case FETCH_INTERACTIONS_SUCCESS: {
      return {...state,
        interactions: action.interactions,
        isLoading: false
      }
    }

    case FETCH_INTERACTIONS_ERROR: {
      return {...state,
        error: action.error
      };
    }

    default:
      return state;
  }
};

export default interactionReducer;
