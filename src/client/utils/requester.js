import openplatform from 'openplatform';
import request from 'superagent';
import {BOOKS_RESPONSE} from '../redux/books.reducer';
import {ON_LOGOUT_RESPONSE} from '../redux/user.reducer';
import {setItem, getItem} from '../utils/localstorage';
import unique from './unique';
import {getLeavesMap} from './taxonomy';
import {get} from 'lodash';

const taxonomyMap = getLeavesMap();
const SHORT_LIST_KEY = 'contentFirstShortList';
const SHORT_LIST_VERSION = 1;

/**
 * fetchTags
 * @param pids
 * @returns {Promise<void>}
 */
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

/**
 * fetchBooks
 * @param pids
 * @returns {Promise<any[] | never>}
 */
export const fetchBooks = (pids = [], store) => {
  pids = unique(pids);
  const getBooks = request.post('/v1/books/').send({pids});

  return Promise.all([getBooks])
    .then(async responses => {
      return JSON.parse(responses[0].text).data;
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

/**
 * fetchBooksRefs
 * @param pids
 * @returns {Promise<any[] | never>}
 */
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
      return null;
    });
  });
};

/**
 * fetchBooksTags
 * @param pids
 * @returns {Promise<{book: {pid: *, tags: *}}[]>}
 */
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

/**
 * fetchSeries
 * @param pids
 * @returns {Promise}
 */
export const fetchSeries = async (pids = []) => {
  pids = unique(pids);

  const allRes = await Promise.all(
    pids.map(async pid => {
      try {
        const res = await request.get(`/v1/series/${pid}`);
        return res.body;
      } catch (e) {
        // ignore errors/missing on fetching covers
        return;
      }
    })
  );

  let books = pids.map((pid, idx) => {
    return {
      book: {
        pid: pid,
        series: allRes[idx]
      }
    };
  });

  return books;
};

/**
 * fetchStats
 * @returns {Promise<*>}
 */
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

/**
 * fetchReviews
 * @param pids
 * @param store
 * @returns {Promise<any[] | never>}
 */
export const fetchReviews = (pids, store) => {
  const state = store.getState();
  const books = state.booksReducer.books;

  const authenticatedToken = get(state, 'userReducer.openplatformToken');

  const booksToBeFetched = pids.map(pid => books[pid]);
  // Fetch the covers from openplatform in parallel with fetching the metadata for the backend.
  return Promise.all(
    booksToBeFetched.map(async ref => {
      try {
        const result = await openplatform.work({
          pids: ref.book.reviews.data,
          fields: [
            'identifierURI',
            'creatorOth',
            'isPartOf',
            'date',
            'fullTextReviews',
            'abstract'
          ],
          access_token: await fetchAnonymousToken()
        });

        // Set auth token if user is logged in, else use anonymous token
        const access_token = authenticatedToken
          ? authenticatedToken
          : await fetchAnonymousToken();

        /*
          Check if kioskmode and if, get libraryCode from kiosk config.
          This will allow to fetch infomedia articles with an anonymous token.
          (user not logged in)
        */
        const libraryCode = state.kiosk.enabled
          ? get(state, 'kiosk.configuration.agencyId')
          : null;

        const pidsInRef = ref.book.reviews.data;

        const reviewsFromPids = await Promise.all(
          pidsInRef.map(async pid => {
            try {
              return await openplatform.infomedia({
                pid,
                libraryCode,
                access_token
              });
            } catch (e) {
              return {statusCode: e.statusCode};
            }
          })
        );
        result.forEach((e, index) => {
          e.infomedia = reviewsFromPids[index];
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

/**
 * fetchCollection
 * @param pids
 * @param store
 * @returns {Promise<any[] | never>}
 */
export const fetchCollection = (pids, store) => {
  const books = store.getState().booksReducer.books;
  const booksToBeFetched = pids.map(pid => books[pid]);

  // Fetch the covers from openplatform in parallel with fetching the metadata for the backend.
  return Promise.all(
    booksToBeFetched.map(async ref => {
      try {
        const pidsInCollection = ref.book.collection.data;
        const collectionRes = (
          await Promise.all(
            pidsInCollection.map(async pid => {
              return openplatform.work({
                pids: [pid],
                fields: ['type', 'identifierURI', 'pid'],
                access_token: await fetchAnonymousToken()
              });
            })
          )
        ).map(r => r[0]);
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

/**
 * addImage
 * @param imageData
 * @returns {Promise<any>}
 */
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

/**
 * saveUser
 * @param user
 * @returns {Promise<any>}
 */
export const saveUser = user => {
  return new Promise((resolve, reject) => {
    request
      .put('/v1/user')
      .send(Object.assign({}, {profiles: []}, user))
      .end((error, res) => {
        if (error) {
          reject(res.body && res.body.errors ? res.body.errors[0] : error);
        } else {
          resolve(res.body.data);
        }
      });
  });
};

/**
 * deleteUser
 * @param id
 * @returns {Promise<any>}
 */
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

/**
 * fetchObjects
 * @param key
 * @param type
 * @param owner
 * @param limit
 * @returns {Promise<any>}
 */
export const fetchObjects = (key, type, owner, limit = 100) => {
  return new Promise((resolve, reject) => {
    request
      .get('/v1/object/find')
      .query({key, type, owner, limit})
      .end((error, res) => {
        if (error) {
          reject(
            res && res.body && res.body.errors ? res.body.errors[0] : error
          );
        } else {
          resolve(res.body);
        }
      });
  });
};

/**
 * addObject
 * @param object
 * @returns {Promise<any>}
 */
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

/**
 * updateObject
 * @param object
 * @returns {Promise<any>}
 */
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

/**
 * deleteObject
 * @param object
 * @returns {Promise<any>}
 */
export const deleteObject = object => {
  return updateObject({_id: object._id});
};

/**
 * logout
 * @param dispatch
 */

export const logout = dispatch => {
  dispatch({type: ON_LOGOUT_RESPONSE});
  document.body.innerHTML +=
    '<form id="logoutform" action="/v1/auth/logout" method="post"></form>';
  document.getElementById('logoutform').submit();
};

export const deleteAndLogout = id => {
  document.body.innerHTML +=
    '<form id="deleteform" action="/v1/user/delete/' +
    id +
    '" method="post"></form>';
  document.getElementById('deleteform').submit();
};

/**
 * saveShortList
 * @param elements
 * @param isLoggedIn
 */
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

/**
 * loadShortList
 * @param isLoggedIn
 * @param store
 * @returns {Promise<*>}
 */
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

let accessToken;
let accessTokenRequest = null;
/**
 * fetchAnonymousToken
 * @returns {Promise<*>}
 */
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

/**
 * ListAggregation
 */

export const loadListAggragation = async (type, sort, limit, pid) => {
  const lists = (
    await request
      .get(`/v1/object/aggregation`)
      .query({type: 'list', sort, pid, limit})
  ).body.data;
  return lists;
};
