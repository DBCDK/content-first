
import createHistory from 'history/createBrowserHistory';

export const ON_PAGE_CHANGE = 'ON_PAGE_CHANGE';
const history = createHistory();

const generalReducer = (state = {}, action) => {
  switch (action.type) {
    case ON_PAGE_CHANGE:
      history.push(action.url);
      return state;
    default:
      return state;
  }
};

export default generalReducer;
