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
    if (response.body) {
      const tags = response.body.data.tags
        .filter(t => taxonomyMap[t.id])
        .map(t => Object.assign({score: t.score}, taxonomyMap[t.id]));

      result[req.pid] = tags;
    } else {
      result[req.pid] = [];
    }
  }

  return result;
};

export const fetchBooks = (pids = [], store) => {
  pids = unique(pids);
  const getBooks = request.post('/v1/books/').send({pids});

  return Promise.all([getBooks])
    .then(async responses => {
      let books = JSON.parse(responses[0].text).data;
      return books;
    })
    .catch(error => {
      store.dispatch({
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
          fields: ['coverUrlFull'],
          access_token: await fetchAnonymousToken()
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

export const fetchBooksRefs = async (pids = []) => {
  pids = unique(pids);

  // Fetch the covers from openplatform in parallel with fetching the metadata for the backend.
  return Promise.all(
    pids.map(async pid => {
      try {
        const [{hasReview, collection}] = await openplatform.work({
          pids: [pid],
          fields: ['hasReview', 'collection'],
          access_token: await fetchAnonymousToken()
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
    return pids.map((pid, i) => {
      if (result && result[i]) {
        return {
          book: {
            pid: pid,
            reviews: {data: result[i].hasReview || []},
            collection: {data: result[i].collection || []}
          }
        };
      }
    });
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

export const fetchStats = async () => {
  try {
    const response = await request.get('/v1/stats/');
    if (response.body) {
      return response.body.data;
    }
    return 0;
  } catch (e) {
    // ignore errors/missing on fetching stats
    return 0;
  }
};

export const fetchReviews = (pids, store) => {
  const books = store.getState().booksReducer.books;
  const booksToBeFetched = pids.map(pid => books[pid]);
  // Fetch the covers from openplatform in parallel with fetching the metadata for the backend.
  return Promise.all(
    booksToBeFetched.map(async ref => {
      try {
        const result = await openplatform.work({
          pids: ref.book.reviews.data,
          fields: ['identifierURI', 'creatorOth', 'isPartOf', 'date'],
          access_token: await fetchAnonymousToken()
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
        return {
          book: {
            pid: ref.book.pid,
            reviews: {
              data: [],
              isLoading: false
            }
          }
        };
      }
    })
  ).then(result => {
    return result;
  });
};

export const fetchCollection = (pids, store) => {
  const books = store.getState().booksReducer.books;
  const booksToBeFetched = pids.map(pid => books[pid]);

  // Fetch the covers from openplatform in parallel with fetching the metadata for the backend.
  return Promise.all(
    booksToBeFetched.map(async ref => {
      try {
        const pidsInCollection = ref.book.collection.data;
        const collectionRes = (await Promise.all(
          pidsInCollection.map(async pid => {
            return openplatform.work({
              pids: [pid],
              fields: ['type', 'identifierURI'],
              access_token: await fetchAnonymousToken()
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
        return {
          book: {
            pid: ref.book.pid,
            collection: {
              data: [],
              isLoading: false
            }
          }
        };
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

export const deleteUser = id => {
  return new Promise((resolve, reject) => {
    request.delete('/v1/user/' + id).end((error, res) => {
      if (error) {
        reject(res.body && res.body.errors ? res.body.errors[0] : error);
      } else {
        resolve(res.body.data);
      }
    });
  });
};

export const fetchObjects = (key, type, owner, limit = 100) => {
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

export const loadShortList = async ({isLoggedIn, store}) => {
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
    const works = await fetchBooks(pids, store);

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

function formatQuery(query) {
  // Remove parenthesis and everything between from query string + leading/ending spaces
  query = query.replace(/\(.*\)/, '').trim();
  // remove & , . -
  query = query
    .split('&')
    .join(' ')
    .split(',')
    .join(' ')
    .split('.')
    .join(' ')
    .split('-')
    .join(' ');
  // Replace all multiple whitespace characters with a single space
  query = query.replace(/\s+/g, ' ');
  // add & to spaces between words in query
  query = query.split(' ').join('&');

  return query;
}
export async function fetchSearchResults({query, dispatch}) {
  query = formatQuery(query);

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

let accessToken;
let accessTokenRequest = null;
export const fetchAnonymousToken = async () => {
  if (accessToken) {
    // Return already fetched token
    return accessToken;
  }
  if (accessTokenRequest) {
    // A token request is currently running
    // We wait for that to complete
    return (await accessTokenRequest).body.access_token;
  }

  accessTokenRequest = request.get('/v1/openplatform/anonymous_token');
  accessToken = (await accessTokenRequest).body.access_token;
  accessTokenRequest = null;
  return accessToken;
};
