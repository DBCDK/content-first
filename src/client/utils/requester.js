import request from 'superagent';
import {ON_WORK_RESPONSE} from '../redux/work.reducer';
import {BOOKS_RESPONSE} from '../redux/books.reducer';
import {SEARCH_RESULTS} from '../redux/search.reducer';
import {HISTORY_PUSH} from '../redux/router.reducer';
import {
  ON_USER_DETAILS_RESPONSE,
  ON_LOGOUT_RESPONSE,
  ON_USER_DETAILS_ERROR
} from '../redux/user.reducer';
import {TASTE_RECOMMENDATIONS_RESPONSE} from '../redux/taste.reducer';
import similar from '../../data/similar-pids.json';
import {getLeavesMap} from './taxonomy';
import requestProfileRecommendations from './requestProfileRecommendations';
import {setItem, getItem} from '../utils/localstorage';

const taxonomyMap = getLeavesMap();
const SHORT_LIST_KEY = 'contentFirstShortList';
const SHORT_LIST_VERSION = 1;

export const fetchTags = async (pids = []) => {
  /*
    accepts:
      pids = ["pid1","pid2","..."]
    returns:
      [{tag},{tag},{...}]
  */
  let result = {};
  let requests = [];

  for (var i = 0; i < pids.length; i++) {
    const pid = pids[i];
    requests.push({pid: pid, request: request.get(`/v1/tags/${pid}`)});
  }

  for (var x = 0; x < requests.length; x++) {
    const req = requests[x];
    const response = await req.request;
    const tags = response.body.data.tags
      .map(t => taxonomyMap[t])
      .filter(t => t);
    result[req.pid] = tags;
  }

  return result;
};

export const fetchBooks = (pids = [], dispatch) => {
  /*
    accepts:
      pids = ["pid1","pid2","..."]
    returns:
      [{book},{book},{...}]
  */
  const getBooks = request.get('/v1/books/').query({pids: pids});

  Promise.all([getBooks])
    .then(async responses => {
      const books = JSON.parse(responses[0].text).data;
      // const tags = await fetchTags(pids);
      //
      // books.forEach(b => {
      //   b.book.tags = tags[b.book.pid];
      // });

      dispatch({type: BOOKS_RESPONSE, response: books});
    })
    .catch(error => {
      dispatch({
        type: 'LOG_ERROR',
        actionType: BOOKS_RESPONSE,
        pids,
        error: String(error)
      });
    });
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
  const getSimilarWorks = request
    .get('/v1/books/')
    .query({pids: similarList.map(o => o.pid)});

  Promise.all([getWork, getMetaTags, getSimilarWorks])
    .then(responses => {
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
      work.similar.sort((w1, w2) => w2.score - w1.score);

      dispatch({type: ON_WORK_RESPONSE, response: work});
    })
    .catch(error => {
      dispatch({type: ON_WORK_RESPONSE, pid, error});
    });
};

export const fetchProfileRecommendations = (profileState, dispatch) => {
  requestProfileRecommendations().then(recommendations =>
    dispatch({type: TASTE_RECOMMENDATIONS_RESPONSE, recommendations})
  );
};

export const fetchUser = (dispatch, cb) => {
  request.get('/v1/user').end(function(error, res) {
    if (error) {
      dispatch({type: ON_USER_DETAILS_ERROR});
    } else {
      const user = JSON.parse(res.text).data;
      dispatch({type: ON_USER_DETAILS_RESPONSE, user});
      if (!user.acceptedTerms) {
        dispatch({type: HISTORY_PUSH, path: '/profile/opret'});
      }
    }
    cb();
  });
};

export const addImage = imageData => {
  return new Promise((resolve, reject) => {
    if (!['image/png', 'image/jpeg'].includes(imageData.type)) {
      return reject({status: 400, msg: 'Invalid MIME type'});
    }
    request
      .post('/v1/image/')
      .type('image/jpeg')
      .send(imageData)
      .end((error, res) => {
        if (error) {
          reject(res.body && res.body.errors ? res.body.errors[0] : error);
        } else {
          resolve(res.body);
        }
      });
  });
};

export const saveUser = user => {
  return new Promise((resolve, reject) => {
    request
      .put('/v1/user')
      .send(Object.assign({}, {shortlist: [], profiles: []}, user))
      .end((error, res) => {
        if (error) {
          reject(res.body && res.body.errors ? res.body.errors[0] : error);
        } else {
          resolve(res.body.data);
        }
      });
  });
};

export const fetchObjects = (key, type, limit = 100) => {
  return new Promise((resolve, reject) => {
    request
      .get('/v1/object/find')
      .query({key, type, limit})
      .end((error, res) => {
        if (error) {
          reject(res.body && res.body.errors ? res.body.errors[0] : error);
        } else {
          resolve(res.body);
        }
      });
  });
};

export const addObject = object => {
  return new Promise((resolve, reject) => {
    request
      .post('/v1/object/')
      .send(object)
      .end((error, res) => {
        if (error) {
          reject(res.body && res.body.errors ? res.body.errors[0] : error);
        } else {
          resolve(res.body);
        }
      });
  });
};

export const updateObject = object => {
  return new Promise((resolve, reject) => {
    request
      .put('/v1/object/')
      .send(object)
      .end((error, res) => {
        if (error) {
          reject(res.body && res.body.errors ? res.body.errors[0] : error);
        } else {
          resolve(res.body);
        }
      });
  });
};

export const logout = dispatch => {
  dispatch({type: ON_LOGOUT_RESPONSE});
  document.body.innerHTML +=
    '<form id="logoutform" action="/v1/logout" method="post"></form>';
  document.getElementById('logoutform').submit();
};

export const saveShortList = (elements, isLoggedIn) => {
  setItem(SHORT_LIST_KEY, elements, SHORT_LIST_VERSION);
  if (isLoggedIn) {
    const payload = elements.map(e => {
      return {
        pid: e.book.pid,
        origin: e.origin
      };
    });
    request
      .put('/v1/shortlist')
      .send(payload)
      .end(function(error) {
        if (error) {
          console.log('error persisting shortlist', error); // eslint-disable-line
        }
      });
  }
};

export const loadShortList = async isLoggedIn => {
  const localStorageElements = getItem(SHORT_LIST_KEY, SHORT_LIST_VERSION, []);
  if (!isLoggedIn) {
    return {localStorageElements};
  }

  try {
    const databaseElements = (await request.get('/v1/shortlist')).body.data;
    if (databaseElements.length === 0) {
      return {localStorageElements, databaseElements: []};
    }
    const pids = databaseElements.map(e => e.pid);
    const works = (await request.get('/v1/books/').query({pids})).body.data;
    const worksMap = works.reduce((map, w) => {
      map[w.book.pid] = w;
      return map;
    }, {});
    databaseElements.forEach(e => (e.book = worksMap[e.pid].book));

    return {localStorageElements, databaseElements};
  } catch (e) {
    console.log('Error loading shortlist', e); // eslint-disable-line
    return {localStorageElements, databaseElements: []};
  }
};

export async function fetchSearchResults({query, dispatch}) {
  try {
    const result = await request.get(
      '/v1/search?q=' + encodeURIComponent(query)
    );
    dispatch({
      type: SEARCH_RESULTS,
      query,
      results: JSON.parse(result.text).data
    });
  } catch (e) {
    dispatch({type: SEARCH_RESULTS, query, results: null});
  }
}
