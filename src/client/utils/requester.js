import request from 'superagent';
import {ON_BELT_REQUEST, ON_BELT_RESPONSE} from '../redux/belts.reducer';
import {getLeaves} from './filters';

const fetchBeltWorks = (belt, filterState, dispatch) => {

  // Will currently only fetch works by pid list
  // later fetching by recommendations/filtering will be possible
  if (belt.pids) {
    request.get('/v1/books')
      .query({pids: belt.pids})
      .end(function(err, res) {
        dispatch({type: ON_BELT_RESPONSE, beltName: belt.name, response: JSON.parse(res.text).data});
      });
  }
  else {
    // get the selected metakompas tags
    const allSelected = filterState.beltFilters[belt.name];
    const tags = getLeaves(filterState.filters[0].children)
      .filter(f => allSelected.includes(f.id))
      .map(f => f.id);

    request.get('/v1/recommendations')
      .query({tags})
      .end(function(err, res) {
        dispatch({type: ON_BELT_RESPONSE, beltName: belt.name, response: JSON.parse(res.text).data});
      });
  }
};

export default fetchBeltWorks;
