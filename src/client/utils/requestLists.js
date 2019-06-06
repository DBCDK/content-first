import request from 'superagent';
import {SYSTEM_LIST} from '../redux/list.reducer';
import {deleteObject} from './requester';
import {differenceBy} from 'lodash';

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

  if (!list._id) {
    Object.assign(
      list,
      (await request.post('/v1/object').send({_type: list._type})).body.data
    );
    list = Object.assign(await loadList(list._id), list);
  }

  // update all elements owned by logged in user
  // consider only updating those which are actually modified
  list.list = await Promise.all(
    list.list.map(async o => {
      if (o._owner && loggedInUserId !== o._owner) {
        return o;
      }

      try {
        const saved = Object.assign({}, o, {
          _type: 'list-entry',
          pid: o.pid,
          _key: list._id,
          _rev: null,
          _public: list._public
        });

        return Object.assign(
          saved,
          (await request.post('/v1/object').send(saved)).body.data
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

export const fetchRecent = async (limit = 20) => {
  const response = await request.get(
    `/v1/object/find?type=list&limit=${limit}`
  );
  return response.body.data.map(list => list._id);
};

async function enrichList({list}) {
  list.list = list.list || [];
  list.deleted = list.deleted || {};
  list.owner = list._owner;

  // Fetch all list entries
  let elements;
  if (list.open) {
    elements = (await request.get(
      `/v1/object/find?type=list-entry&key=${list._id}&limit=100000`
    )).body.data;
  } else {
    elements = (await request.get(
      `/v1/object/find?type=list-entry&key=${
        list._id
      }&owner=${encodeURIComponent(list._owner)}&limit=100000`
    )).body.data;
  }

  const entryMap = elements.reduce((map, element) => {
    map[element._id] = element;
    return map;
  }, {});

  // Enrich elements, preserving order of elements as specified in list.list
  list.list = list.list.map(element => {
    return {...element, ...entryMap[element._id]};
  });

  // Add rest of elements to end of list which are not in original list.list
  const rest = differenceBy(elements, list.list, '_id');
  rest.sort((o1, o2) => o1._created - o2._created);
  list.list = list.list.concat(rest);

  // Remove elements which have been removed by other users
  // and hence might still be referenced in original list.list
  list.list = list.list
    .filter(element => element.pid && element._id)
    .filter(element => !list.deleted[element._id]);

  // We don't want to keep books which have been stored at element
  // These are handled in the redux books now
  list.list.forEach(el => {
    delete el.book;
  });
}

export const loadList = async id => {
  if (!id) {
    throw Error('no id given');
  }
  const list = (await request.get(`/v1/object/${id}`)).body.data;

  if (!list) {
    throw Error('list is undefined');
  }
  await enrichList({list});
  return list;
};

// done
export const loadLists = async ({openplatformId}) => {
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
    await enrichList({list});
    result.push(list);
  }

  // Create system lists if they do not exist
  if (!containsList(SYSTEM_LIST, 'Har læst', result)) {
    let list = await saveList({
      type: SYSTEM_LIST,
      title: 'Har læst',
      description: 'En liste over læste bøger',
      list: []
    });
    result.push(list);
  }
  if (!containsList(SYSTEM_LIST, 'Vil læse', result)) {
    let list = await saveList({
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
