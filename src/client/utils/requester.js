import request from 'superagent';
import {ON_BELT_RESPONSE} from '../redux/belts.reducer';
import {ON_WORK_RESPONSE} from '../redux/work.reducer';
import {ON_PROFILE_RECOMMENDATIONS_RESPONSE, ON_USER_DETAILS_RESPONSE, ON_LOGOUT_RESPONSE} from '../redux/profile.reducer';
import {getLeaves} from './filters';
import profiles from '../data/ranked-profiles.json';
import similar from '../data/similar-pids.json';
import {taxonomyMap} from './taxonomy';
import requestProfileRecommendations from './requestProfileRecommendations';


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
      if (work.book.loans < 100) {
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

  // mapping pid to score
  const similarList = similar[pid] || [];
  const scores = {};
  similarList.forEach(o => {
    scores[o.pid] = o.val;
  });

  const getWork = request.get(`/v1/book/${pid}`);
  const getMetaTags = request.get(`/v1/tags/${pid}`);
  const getSimilarWorks = request.get('/v1/books/')
    .query({pids: similarList.map(o => o.pid)});

  Promise.all([getWork, getMetaTags, getSimilarWorks]).then(responses => {
    const work = JSON.parse(responses[0].text);
    const tags = JSON.parse(responses[1].text).data.tags;
    const similarWorks = JSON.parse(responses[2].text).data.map(w => {
      w.score = scores[w.book.pid];
      return w;
    });

    work.tags = [];
    tags.forEach(t => {
      if (taxonomyMap[t]) {
        work.tags.push(taxonomyMap[t]);
      }
    });

    work.similar = similarWorks;
    work.similar.sort((w1, w2) => w2.score-w1.score);

    dispatch({type: ON_WORK_RESPONSE, response: work});
  }).catch(error => {
    dispatch({type: ON_WORK_RESPONSE, pid, error});
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

export const fetchProfileRecommendations = (profileState, dispatch) => {
  requestProfileRecommendations().then(recommendations => dispatch({type: ON_PROFILE_RECOMMENDATIONS_RESPONSE, recommendations}));
};

export const fetchUser = (dispatch, cb) => {
  request.get('/v1/user')
    .end(function(error, res) {
      if (error) {
        dispatch({type: ON_USER_DETAILS_RESPONSE, error});
      }
      else {
        const user = JSON.parse(res.text).data;
        dispatch({type: ON_USER_DETAILS_RESPONSE, user});
      }
      cb();
    });
};

export const logout = (dispatch) => {
  dispatch({type: ON_LOGOUT_RESPONSE});
  document.body.innerHTML += '<form id="logoutform" action="/v1/logout" method="post"></form>';
  document.getElementById('logoutform').submit();
};

export const saveShortList = (elements, isLoggedIn) => {
  if (window && window.localStorage) {
    localStorage.setItem('contentFirstShortList', JSON.stringify(elements));
  }
  if (isLoggedIn) {
    const payload = elements.map(e => {
      return {
        pid: e.book.pid,
        origin: e.origin
      };
    });
    request.put('/v1/shortlist')
      .send(payload)
      .end(function(error) {
        if (error) {
          console.log('error persisting shortlist', error) // eslint-disable-line
        }
      });
  }
};

export const loadShortList = async (cb, isLoggedIn) => {
  let localStorageElements= [];
  if (window && window.localStorage) {
    const jsonString = localStorage.getItem('contentFirstShortList');
    localStorageElements = jsonString ? JSON.parse(jsonString) : localStorageElements;
  }
  if (!isLoggedIn) {
    return cb({localStorageElements});
  }

  try {
    const databaseElements = (await request.get('/v1/shortlist')).body.data;
    const pids = databaseElements.map(e => e.pid);
    const works = (await request.get('/v1/books/').query({pids})).body.data;
    const worksMap = works.reduce((map, w) => {
      map[w.book.pid] = w;
      return map;
    }, {});
    databaseElements.forEach(e => (e.book = worksMap[e.pid].book));

    return cb({localStorageElements, databaseElements});
  }
  catch (e) {
    console.log('Error loading shortlist', e) // eslint-disable-line
  }
};
