import request from 'superagent';
import {ON_BELT_REQUEST, ON_BELT_RESPONSE} from '../redux/belts.reducer';

const fetchBeltWorks = (belt, dispatch) => {

  // Will currently only fetch works by pid list
  // later fetching by recommendations/filtering will be possible
  if (belt.pids) {
    dispatch({type: ON_BELT_REQUEST, beltName: belt.name});
    request.get('/v1/books')
      .query({pids: belt.pids})
      .end(function(err, res) {
        dispatch({type: ON_BELT_RESPONSE, beltName: belt.name, response: JSON.parse(res.text).data});
      });
  }
};

export default fetchBeltWorks;
