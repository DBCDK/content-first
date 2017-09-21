import request from 'superagent';
import {ON_BELT_RESPONSE} from '../redux/belts.reducer';
import {ON_WORK_RESPONSE} from '../redux/work.reducer';
import {getLeaves} from './filters';
import profiles from '../data/profiles.json';
import similar from '../data/similar.json';

const filter = (works, selectedTitles) => {
  // Lets perform some client side filtering of stuff which is not yet
  // possible in backend
  return works.filter(work => {
    if (selectedTitles.indexOf('Kort') >= 0) {
      if (work.book.pages > 150) {
        return false;
      }
    }
    if (selectedTitles.indexOf('Medium længde') >= 0) {
      if (work.book.pages <= 150 || work.book.pages > 350) {
        return false;
      }
    }
    if (selectedTitles.indexOf('Laaaaaaaaaaaaaaaang') >= 0) {
      if (work.book.pages <= 350) {
        return false;
      }
    }
    if (selectedTitles.indexOf('Er på mange biblioteker') >= 0) {
      if (work.book.libraries < 50) {
        return false;
      }
    }
    if (selectedTitles.indexOf('Udlånes meget') >= 0) {
      if (work.book.loan_count < 100) {
        return false;
      }
    }
    return true;
  });
};

const sort = (works, profile) => {
  const scores = profiles[profile.id];
  works.forEach(w => {
    w.score = scores[w.book.pid] || 0;
  });

  // will sort in place - no new array returned
  works.sort((w1, w2) => w1.score-w2.score);
};

export const fetchWork = (pid, dispatch) => {
  request.get(`/v1/book/${pid}`)
    .end(function(err, res) {
      if (err) {
        dispatch({type: ON_WORK_RESPONSE, pid, error: err});
        return;
      }
      const work = JSON.parse(res.text);

      // mapping pid to score
      const similarList = similar[pid] || [];
      const scores = {};
      similarList.forEach(o => {
        scores[o.pid] = o.val;
      });

      // fetch similar works
      request.get('/v1/books/')
        .query({pids: similarList.map(o => o.pid)})
        .end(function(errSimilar, resSimilar) {

          if (errSimilar) {
            // just dispatch response wihtout similar works
            dispatch({type: ON_WORK_RESPONSE, response: work});
            return;
          }
          const works = JSON.parse(resSimilar.text).data.map(w => {
            w.score = scores[w.book.pid];
            return w;
          });

          work.similar = works;
          work.similar.sort((w1, w2) => w2.score-w1.score);

          dispatch({type: ON_WORK_RESPONSE, response: work});
        });
    });
};

export const fetchBeltWorks = (belt, filterState, dispatch) => {
  // get the selected tag ids, which are part of the taxonomy
  // these are the tags which do not have the custom property set to true
  const allSelected = filterState.beltFilters[belt.name];
  const selectedTags = getLeaves(filterState.filters)
    .filter(f => !f.custom && allSelected.indexOf(f.id) >= 0)
    .map(f => f.id);

  // push 'all' tag to fetch all works if no taxonomy tags are selected.
  // for instance if only client side filters are selected.
  selectedTags.push('-1');

  // get titles of custom selected tags. These tags are not part of the taxonomy
  // and hence they need to be filtered by other means. We'll do that client side
  // for now.
  const selectedTitles = getLeaves(filterState.filters)
    .filter(f => f.custom && allSelected.indexOf(f.id) >= 0)
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
      const works = filter(JSON.parse(res.text).data, selectedTitles);
      sort(works, filterState.sortBy.find(o => o.selected));

      dispatch({type: ON_BELT_RESPONSE, beltName: belt.name, response: works});
    });

};
