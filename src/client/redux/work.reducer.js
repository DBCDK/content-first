const defaultState = {
  pid: '',
  isLoading: false,
  work: {}
};

export const ON_WORK_REQUEST = 'ON_WORK_REQUEST';
export const ON_WORK_RESPONSE = 'ON_WORK_RESPONSE';

const workReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_WORK_REQUEST:
      return Object.assign({}, state, {pid: action.pid}, {isLoading: true});
    case ON_WORK_RESPONSE:
      return Object.assign(
        {},
        state,
        {work: action.response},
        {isLoading: false}
      );
    default:
      return state;
  }
};

export default workReducer;
