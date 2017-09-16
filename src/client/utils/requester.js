import request from 'superagent';
import {ON_BELT_RESPONSE} from '../redux/belts.reducer';
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
    // get the selected tag ids, which are part of the taxonomy
    // these are the tags which do not have the custom property set to true
    const allSelected = filterState.beltFilters[belt.name];
    const selectedTags = getLeaves(filterState.filters)
      .filter(f => !f.custom && allSelected.includes(f.id))
      .map(f => f.id);

    // get titles of custom selected tags. These tags are not part of the taxonomy
    // and hence they need to be filtered by other means. We'll do that client side
    // for now.
    const selectedTitles = getLeaves(filterState.filters)
      .filter(f => f.custom && allSelected.includes(f.id))
      .map(f => f.title);

    request.get('/v1/recommendations')
      .query({tags: selectedTags})
      .end(function(err, res) {
        if (err) {
          dispatch({type: ON_BELT_RESPONSE, beltName: belt.name, error: err});
          return;
        }

        // Lets perform some client side filtering of stuff which is not yet
        // possible in backend
        const works = JSON.parse(res.text).data.filter(work => {
          if (selectedTitles.includes('Kort')) {
            if (work.book.pages > 150) {
              return false;
            }
          }
          if (selectedTitles.includes('Medium længde')) {
            if (work.book.pages <= 150 || work.book.pages > 350) {
              return false;
            }
          }
          if (selectedTitles.includes('Laaaaaaaaaaaaaaaang')) {
            if (work.book.pages <= 350) {
              return false;
            }
          }
          if (selectedTitles.includes('Er på mange biblioteker')) {
            if (work.book.libraries < 50) {
              return false;
            }
          }
          if (selectedTitles.includes('Udlånes meget')) {
            if (work.book.loan_count < 100) {
              return false;
            }
          }
          return true;
        });
        dispatch({type: ON_BELT_RESPONSE, beltName: belt.name, response: works});
      });
  }
};

export default fetchBeltWorks;
