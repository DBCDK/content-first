import request from 'superagent';
import {SYSTEM_LIST} from '../redux/list.reducer';

// Note: only used exports are:
//
// - saveList
// - loadLists
// - loadRecentPublic
//

export const saveList = async list => {
  list = Object.assign({}, list);
  list._type = 'list';

  // old-endpoint compat, refactor to just _id later
  list._public = list.public;
  if (!list.oldId) {
    list._id = list._id || list.id;
  }

  const result = await request.post('/v1/object').send(
    Object.assign({}, list, {
      _rev: null,
      list:
        list.list &&
        list.list.map(o => ({
          pid: o.book.pid,
          description: o.description || ''
        }))
    })
  );
  Object.assign(list, result.body.data);

  // old-endpoint compat, refactor to just _id later
  list.id = list._key || list._id;

  return list;
};

const oldPayloadToList = async payload => {
  const result = Object.assign({}, payload.data);
  result.id = locationToId(payload.links.self);
  const pids = result.list.map(obj => obj.pid);
  if (pids.length === 0) {
    return result;
  }
  const works = (await request.get('/v1/books/').query({pids})).body.data;
  const worksMap = works.reduce((map, w) => {
    map[w.book.pid] = w;
    return map;
  }, {});
  result.list = payload.data.list.map(obj => {
    return Object.assign(obj, worksMap[obj.pid]);
  });
  return result;
};

export const loadRecentPublic = async () => {
  let lists = (await request.get(`/v1/object/find?type=list&limit=30`)).body
    .data;

  for (const list of lists) {
    await enrichList(list);
  }
  return lists;
};

async function enrichList(list) {
  list.id = list.id || list._id;
  list.owner = list._owner;
  list.list = list.list || [];
  const pids = list.list.map(o => o.pid);

  if (pids.length > 0) {
    const works = (await request.get('/v1/books/').query({pids})).body.data;
    const worksMap = works.reduce((map, w) => {
      map[w.book.pid] = w;
      return map;
    }, {});
    list.list = list.list.map(obj => {
      return Object.assign(obj, {book: {pid: obj.pid}}, worksMap[obj.pid]);
    });
  }
}

export const loadLists = async openplatformId => {
  if (!openplatformId) {
    return [];
  }

  // Load from database from old endpoint
  const listsPayload = (await request.get('/v1/lists')).body.data;
  let result = [];
  for (let i = 0; i < listsPayload.length; i++) {
    result.push(await oldPayloadToList(listsPayload[i]));
  }
  result = result.map(o => Object.assign(o, {oldId: true}));

  // Load new lists
  const lists = (await request.get(
    `/v1/object/find?type=list&owner=${encodeURIComponent(
      openplatformId
    )}&limit=100000`
  )).body.data;

  for (const list of lists) {
    await enrichList(list);
    result.push(list);
  }

  // Create system lists if they do not exist
  if (!containsList(SYSTEM_LIST, 'Har læst', result)) {
    const list = await saveList({
      type: SYSTEM_LIST,
      title: 'Har læst',
      description: 'En liste over læste bøger',
      list: []
    });
    result.push(list);
  }
  if (!containsList(SYSTEM_LIST, 'Vil læse', result)) {
    const list = await saveList({
      type: SYSTEM_LIST,
      title: 'Vil læse',
      description: 'En liste over bøger jeg gerne vil læse',
      list: []
    });
    result.push(list);
  }

  return result;
};

const containsList = (type, title, lists) => {
  return lists.filter(l => l.type === type && l.title === title).length !== 0;
};

const locationToId = location => {
  return location.split('/')[3];
};
