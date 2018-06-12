import openplatform from 'openplatform';
import request from 'superagent';
import {
  BOOKS_RESPONSE,
  REVIEW_RESPONSE,
  COLLECTION_RESPONSE
} from '../redux/books.reducer';
import {SEARCH_RESULTS} from '../redux/search.reducer';
import {HISTORY_PUSH} from '../redux/router.reducer';
import {
  ON_USER_DETAILS_RESPONSE,
  ON_LOGOUT_RESPONSE,
  ON_USER_DETAILS_ERROR
} from '../redux/user.reducer';
import {TASTE_RECOMMENDATIONS_RESPONSE} from '../redux/taste.reducer';
import {getLeavesMap} from './taxonomy';
import requestProfileRecommendations from './requestProfileRecommendations';
import {setItem, getItem} from '../utils/localstorage';
import unique from './unique';

const taxonomyMap = getLeavesMap();
const SHORT_LIST_KEY = 'contentFirstShortList';
const SHORT_LIST_VERSION = 1;

export const fetchTags = async (pids = []) => {
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

export const fetchBooks = (pids = [], includeTags, dispatch) => {
  pids = unique(pids);
  const getBooks = request.get('/v1/books/').query({pids});

  // Fetch the covers from openplatform in parallel with fetching the metadata for the backend.
  Promise.all(
    pids.map(async pid => {
      try {
        const [{coverUrlFull, hasReview, collection}] = await openplatform.work(
          {
            pids: [pid],
            fields: ['coverUrlFull', 'hasReview', 'collection']
          }
        );
        return {
          coverUrlFull: coverUrlFull && coverUrlFull[0],
          hasReview,
          collection
        };
      } catch (e) {
        // ignore errors/missing on fetching covers
        return;
      }
    })
  ).then(result => {
    console.log('ost');
    dispatch({
      type: BOOKS_RESPONSE,
      response: pids
        .map((pid, i) => {
          if (result && result[i]) {
            return {
              book: {
                pid: pid,
                coverUrl: result[i].coverUrlFull || '',
                reviews: {data: result[i].hasReview || []},
                collection: {data: result[i].collection || []}
              }
            };
          }
        })
        .filter(b => b)
    });
  });

  return Promise.all([getBooks])
    .then(async responses => {
      const books = JSON.parse(responses[0].text).data;
      if (includeTags) {
        const tags = await fetchTags(pids);

        books.forEach(b => {
          b.book.tags = tags[b.book.pid];
        });
      }
      dispatch({type: BOOKS_RESPONSE, response: books});
      return books;
    })
    .catch(error => {
      dispatch({
        type: 'LOG_ERROR',
        actionType: BOOKS_RESPONSE,
        pids,
        error: String(error)
      });
      throw error;
    });
};

export const fetchReviews = (pid, reviews, dispatch) => {
  // Fetch the covers from openplatform in parallel with fetching the metadata for the backend.
  Promise.all(
    reviews.data.map(async review => {
      try {
        const [
          {identifierURI, creatorOth, isPartOf, date}
        ] = await openplatform.work({
          pids: [review],
          fields: ['identifierURI', 'creatorOth', 'isPartOf', 'date']
        });
        return {
          identifierURI,
          creatorOth,
          isPartOf,
          date
        };
      } catch (e) {
        // ignore errors/missing on fetching covers
        return;
      }
    })
  ).then(result => {
    dispatch({
      type: REVIEW_RESPONSE,
      pid,
      response: reviews.data
        .map((review, i) => {
          if (result && result[i]) {
            return {
              pid: review,
              iURI: result[i].identifierURI || false,
              creatorOth: result[i].creatorOth || '',
              isPartOf: result[i].isPartOf || '',
              date: result[i].date || ''
            };
          }
        })
        .filter(r => r && r.iURI)
        .filter(r => r.iURI[0].includes('litteratursiden.dk'))
    });
  });
};

export const fetchCollection = (pid, collection = [], dispatch) => {
  // Fetch the covers from openplatform in parallel with fetching the metadata for the backend.
  Promise.all(
    collection.data.map(async col => {
      try {
        const [{type, identifierURI}] = await openplatform.work({
          pids: [col],
          fields: ['type', 'identifierURI']
        });
        return {
          type,
          identifierURI
        };
      } catch (e) {
        // ignore errors/missing on fetching covers
        return;
      }
    })
  ).then(result => {
    dispatch({
      type: COLLECTION_RESPONSE,
      pid,
      response: collection.data
        .map((col, i) => {
          if (result && result[i]) {
            return {
              pid: col,
              type: result[i].type || '',
              iURI: result[i].identifierURI || false
            };
          }
        })
        .filter(r => r.iURI)
        .filter(r => r.iURI[0].includes('ereolen.dk'))
    });
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
      .put(`/v1/object/${object._id}`)
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
export const deleteObject = object => {
  return updateObject({_id: object._id});
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

export const loadShortList = async ({isLoggedIn, dispatch}) => {
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
    const works = await fetchBooks(pids, false, dispatch);

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
