import request from 'superagent';
import {setItem, getItem} from '../utils/localstorage';

const LIST_KEY = 'contentFirstLists';
const CURRENT_LIST_KEY = 'contentFirstCurrentList';
const LIST_VERSION = 1;

const listToPayload = list => {
  const listCopy = Object.assign({}, list);
  listCopy.list = listCopy.list.map(element => {
    return {
      pid: element.book.pid,
      description: element.description || ''
    };
  });
  return listCopy;
};
const payloadToList = async payload => {
  const result = Object.assign({}, payload);
  const pids = result.list.map(obj => obj.pid);
  if (pids.length === 0) {
    return result;
  }
  const works = (await request.get('/v1/books/').query({pids})).body.data;
  const worksMap = works.reduce((map, w) => {
    map[w.book.pid] = w;
    return map;
  }, {});
  result.list = payload.list.map(obj => {
    return Object.assign(obj, worksMap[obj.pid]);
  });
  return result;
};
export const saveLists = async (lists, isLoggedIn = false) => {
  setItem(LIST_KEY, lists, LIST_VERSION);
  if (isLoggedIn) {
    // Save on database
    const listsPayload = lists.map(l => listToPayload(l));
    await request.put('/v1/lists').send(listsPayload);
  }
};
export const loadLists = async isLoggedIn => {
  const localStorageElements = getItem(LIST_KEY, LIST_VERSION, []);
  if (!isLoggedIn) {
    return localStorageElements;
  }
  // Load from database
  const listsPayload = (await request.get('/v1/lists')).body.data;
  const result = [];
  for (let i = 0; i < listsPayload.length; i++) {
    result.push(await payloadToList(listsPayload[i]));
  }
  return result;
};
export const saveCurrentList = currentList => {
  setItem(CURRENT_LIST_KEY, currentList, LIST_VERSION);
};

export const loadCurrentlist = () => {
  return getItem(CURRENT_LIST_KEY, LIST_VERSION, {title: '', list: []});
};
