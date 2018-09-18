import request from 'superagent';
import {SYSTEM_LIST} from '../redux/list.reducer';
import {deleteObject} from './requester';

// Note: only used exports are:
//
// - saveList
// - loadLists
// - loadRecentPublic
//

export const saveList = async (list, loggedInUserId) => {
  list = Object.assign({}, list);
  list._type = 'list';
  list.list = list.list || [];
  list._public = list.public;
  list._id = list._id || list.id;
  list._owner = loggedInUserId;

  if (!list._id) {
    Object.assign(list, (await request.post('/v1/object').send({})).body.data);
  }

  // update all elements owned by logged in user
  // consider only updating those which are actually modified
  list.list = await Promise.all(
    list.list.map(async o => {
      if (o._owner && loggedInUserId !== o._owner) {
        return o;
      }
      const {book} = o;
      try {
        const saved = Object.assign({}, o, {
          _type: 'list-entry',
          book: null,
          pid: book.pid,
          _key: list._id,
          _rev: null,
          _public: list._public
        });
        return Object.assign(
          saved,
          (await request.post('/v1/object').send(saved)).body.data,
          {book}
        );
      } catch (e) {
        // possibly permission denied if not owner of list element
        return o;
      }
    })
  );

  // delete elements which are owned by logged in user
  if (list.pending) {
    await Promise.all(
      list.pending
        .filter(
          ({_id, _owner}) => list.deleted[_id] && _owner === loggedInUserId
        )
        .map(async ({_id}) => {
          try {
            await deleteObject({_id});
          } catch (e) {
            // possibly permission denied if not owner of list element
          }
        })
    );
  }

  // todo refactor places where list.owner is used.
  // instead list._owner should be used
  if (list._owner === loggedInUserId || list.owner === loggedInUserId) {
    const result = await request.post('/v1/object').send(
      Object.assign({}, list, {
        _rev: null,
        pending: null,
        list: list.list && list.list.map(({_id}) => ({_id}))
      })
    );
    Object.assign(list, result.body.data);
  }

  return list;
};

export const loadRecentPublic = async ({store}) => {
  let lists = (await request.get(`/v1/object/find?type=list&limit=30`)).body
    .data;

  for (const list of lists) {
    await enrichList({list, store});
  }
  return lists;
};

async function enrichList({list}) {
  list.owner = list._owner;

  // Load list elements
  list.list = list.list || [];
  list.list = await Promise.all(
    list.list.map(async o => {
      try {
        return o._id ? (await request.get('/v1/object/' + o._id)).body.data : o;
      } catch (e) {
        // might fail if permission denied, i.e. owner of list element changed permission.
        return o;
      }
    })
  );

  // Add elements for open lists
  if (list.open) {
    let othersListEntries = (await request.get(
      `/v1/object/find?type=list-entry&key=${list._id}&limit=100000`
    )).body.data;

    list.deleted = list.deleted || {};
    othersListEntries = othersListEntries.filter(({_id}) => !list.deleted[_id]);

    const listIds = list.list.map(o => o._id).filter(o => !!o);
    othersListEntries = othersListEntries.filter(
      ({_id}) => !listIds.includes(_id)
    );

    list.list = list.list.concat(othersListEntries);
  }

  list.list.forEach(el => {
    delete el.book;
  });
}

export const loadList = async (id, store) => {
  const list = (await request.get(`/v1/object/${id}`)).body.data;
  await enrichList({list, store});
  return list;
};

// done
export const loadLists = async ({openplatformId, store}) => {
  if (!openplatformId) {
    return [];
  }
  const lists = (await request.get(
    `/v1/object/find?type=list&owner=${encodeURIComponent(
      openplatformId
    )}&limit=100000`
  )).body.data;

  let result = [];
  for (const list of lists) {
    await enrichList({list, store});
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
