import openplatform from 'openplatform';
import request from 'superagent';
import {BOOKS_RESPONSE} from '../redux/books.reducer';
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
import {get} from 'lodash';

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
    if (req.request.body) {
      const tags = response.body.data.tags
        .map(t => taxonomyMap[t])
        .filter(t => t);
      result[req.pid] = tags;
    }
  }

  return result;
};

export const fetchBooks = (pids = [], dispatch) => {
  pids = unique(pids);
  const getBooks = request.get('/v1/books/').query({pids});

  return Promise.all([getBooks])
    .then(async responses => {
      let books = JSON.parse(responses[0].text).data;
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

export const fetchCoverRefs = (pids = []) => {
  pids = unique(pids);

  // Fetch the covers from openplatform in parallel with fetching the metadata for the backend.
  return Promise.all(
    pids.map(async pid => {
      try {
        const [{coverUrlFull}] = await openplatform.work({
          pids: [pid],
          fields: ['coverUrlFull']
        });
        return {
          coverUrlFull: coverUrlFull && coverUrlFull[0]
        };
      } catch (e) {
        // ignore errors/missing on fetching covers
        return;
      }
    })
  ).then(result => {
    return pids
      .map((pid, i) => {
        if (result && result[i]) {
          return {
            book: {
              pid: pid,
              coverUrl: result[i].coverUrlFull || ''
            }
          };
        }
      })
      .filter(b => b);
  });
};

export const fetchBooksRefs = (pids = []) => {
  pids = unique(pids);

  // Fetch the covers from openplatform in parallel with fetching the metadata for the backend.
  return Promise.all(
    pids.map(async pid => {
      try {
        const [{hasReview, collection}] = await openplatform.work({
          pids: [pid],
          fields: ['hasReview', 'collection']
        });
        return {
          hasReview,
          collection
        };
      } catch (e) {
        // ignore errors/missing on fetching covers
        return;
      }
    })
  ).then(result => {
    return pids
      .map((pid, i) => {
        if (result && result[i]) {
          return {
            book: {
              pid: pid,
              reviews: {data: result[i].hasReview || []},
              collection: {data: result[i].collection || []}
            }
          };
        }
      })
      .filter(b => b);
  });
};

export const fetchBooksTags = async (pids = []) => {
  pids = unique(pids);
  const tags = await fetchTags(pids);
  let books = pids.map(pid => {
    return {
      book: {
        pid: pid,
        tags: tags[pid]
      }
    };
  });
  return books;
};

export const fetchReviews = (pids, store) => {
  const books = store.getState().booksReducer.books;
  const booksToBeFetched = pids
    .map(pid => books[pid])
    .filter(work => get(work, 'book.reviews.data.length') > 0);
  // Fetch the covers from openplatform in parallel with fetching the metadata for the backend.
  return Promise.all(
    booksToBeFetched.map(async ref => {
      try {
        const result = await openplatform.work({
          pids: ref.book.reviews.data,
          fields: ['identifierURI', 'creatorOth', 'isPartOf', 'date']
        });

        return {
          book: {
            pid: ref.book.pid,
            reviews: {
              data: result,
              isLoading: false
            }
          }
        };
      } catch (e) {
        // ignore errors/missing on fetching covers
        return;
      }
    })
  ).then(result => {
    return result;
  });
};

export const fetchCollection = (pids, store) => {
  const books = store.getState().booksReducer.books;
  const booksToBeFetched = pids
    .map(pid => books[pid])
    .filter(work => get(work, 'book.collection.data.length') > 0);
  // Fetch the covers from openplatform in parallel with fetching the metadata for the backend.
  return Promise.all(
    booksToBeFetched.map(async ref => {
      try {
        const pidsInCollection = ref.book.collection.data;
        const collectionRes = (await Promise.all(
          pidsInCollection.map(pid => {
            return openplatform.work({
              pids: [pid],
              fields: ['type', 'identifierURI']
            });
          })
        )).map(r => r[0]);
        return {
          book: {
            pid: ref.book.pid,
            collection: {
              data: collectionRes,
              isLoading: false
            }
          }
        };
      } catch (e) {
        // ignore errors/missing on fetching covers
        return;
      }
    })
  ).then(result => {
    return result;
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

export const fetchObjects = (key, type, owner = null, limit = 100) => {
  return new Promise((resolve, reject) => {
    request
      .get('/v1/object/find')
      .query({key, type, owner, limit})
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
