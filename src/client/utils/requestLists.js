import request from 'superagent';
import {setItem, getItem} from '../utils/localstorage';
import {SYSTEM_LIST} from '../redux/list.reducer';

const LIST_KEY = 'contentFirstLists';
const CURRENT_LIST_KEY = 'contentFirstCurrentList';
const LIST_VERSION = 1;

const listToPayload = list => {
  const listCopy = {};
  listCopy.title = list.title;
  listCopy.description = list.description;
  listCopy.type = list.type;
  listCopy.public = list.public;
  listCopy.image = list.image;
  listCopy.template = list.template;
  listCopy.list = list.list.map(element => {
    return {
      pid: element.book.pid,
      description: element.description || ''
    };
  });
  return listCopy;
};
const payloadToList = async payload => {
  const result = Object.assign({}, payload);
  result.data.id = locationToId(result.links.self);
  const pids = result.data.list.map(obj => obj.pid);
  if (pids.length === 0) {
    return result;
  }
  const works = (await request.get('/v1/books/').query({pids})).body.data;
  const worksMap = works.reduce((map, w) => {
    map[w.book.pid] = w;
    return map;
  }, {});
  result.data.list = payload.data.list.map(obj => {
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
export const saveList = async list => {
  const listPayload = listToPayload(list.data);
  const location = list.links.self || (await createListLocation()).location;
  console.log('store list', listPayload);
  await request.put(location).send(listPayload);
  return Object.assign({}, list, {links: {self: location}});
};
export const createListLocation = async () => {
  const location = (await request.post('/v1/lists')).body.data;
  return {
    id: locationToId(location),
    location
  };
};
export const loadRecentPublic = async () => {
  const listsPayload = (await request
    .get('/v1/public-lists')
    .query({limit: 30})).body.data;
  const result = [];
  for (let i = 0; i < listsPayload.length; i++) {
    result.push(await payloadToList(listsPayload[i]));
  }
  return result;
};
export const loadLists = async isLoggedIn => {
  if (!isLoggedIn) {
    return [];
  }
  // Load from database
  const listsPayload = (await request.get('/v1/lists')).body.data;
  const result = [];
  for (let i = 0; i < listsPayload.length; i++) {
    result.push(await payloadToList(listsPayload[i]));
  }

  // Create system lists if they do not exist
  if (!containsList(SYSTEM_LIST, 'Har læst', result)) {
    const list = await saveList({
      data: {
        type: SYSTEM_LIST,
        title: 'Har læst',
        description: 'En liste over læste bøger',
        list: []
      },
      links: {self: null}
    });
    result.push(list);
  }
  if (!containsList(SYSTEM_LIST, 'Vil læse', result)) {
    const list = await saveList({
      data: {
        type: SYSTEM_LIST,
        title: 'Vil læse',
        description: 'En liste over bøger jeg gerne vil læse',
        list: []
      },
      links: {self: null}
    });
    result.push(list);
  }

  return result;
};

const containsList = (type, title, lists) => {
  return (
    lists.filter(l => l.data.type === type && l.data.title === title).length !==
    0
  );
};
export const saveCurrentList = currentList => {
  setItem(CURRENT_LIST_KEY, currentList, LIST_VERSION);
};

export const loadCurrentlist = () => {
  return getItem(CURRENT_LIST_KEY, LIST_VERSION, {title: '', list: []});
};

const locationToId = location => {
  return location.split('/')[3];
};
