import {findIndex} from 'lodash';

export default class ListRequester {
  constructor({storageClient}) {
    this.storageClient = storageClient;
  }
  async createSystemList(title) {
    const l = {
      _type: 'list',
      type: 'SYSTEM_LIST',
      title: title,
      list: [],
      deleted: {}
    };
    const id = (await this.storageClient.put(l)).data._id;
    return (await this.storageClient.get({id})).data;
  }

  async fetchOwnedLists(owner) {
    const lists = (await this.storageClient.find({
      type: 'list',
      owner
    })).data;

    await Promise.all(
      lists.map(async list => {
        list.tmpEntries = await this.fetchEntries(list);
      })
    );

    if (findIndex(lists, {type: 'SYSTEM_LIST', title: 'Har læst'}) === -1) {
      lists.push(await this.createSystemList('Har læst'));
    }
    if (findIndex(lists, {type: 'SYSTEM_LIST', title: 'Vil læse'}) === -1) {
      lists.push(await this.createSystemList('Vil læse'));
    }

    return lists;
  }

  async fetchList(id) {
    const list = (await this.storageClient.get({id})).data;
    if (!list) {
      throw Error('list is undefined');
    }
    list.tmpEntries = await this.fetchEntries(list);
    return list;
  }

  async fetchEntries(list) {
    return (await this.storageClient.find({
      type: 'list-entry',
      key: list._id,
      owner: list._public ? undefined : list._owner // eslint-disable-line no-undefined
    })).data;
  }

  async saveList(list, loggedInUserId) {
    list = Object.assign({}, list);
    list._type = 'list';
    list.list = list.list || [];
    list._public = list._public || false;

    list._id = list._id || list.id;

    if (!list._id) {
      Object.assign(list, (await this.storageClient.put(list)).data);
      list = Object.assign(
        (await this.storageClient.get({id: list._id})).data,
        list
      );
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
            // Exclude books in storage
            book: null,
            // include pid for work fetch
            pid: o.pid || o.book.pid,
            _key: list._id,
            _rev: null,
            _public: list._public
          });

          return Object.assign(
            saved,
            (await this.storageClient.put(saved)).data
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
              await this.storageClient.delete({id: _id});
            } catch (e) {
              // possibly permission denied if not owner of list element
            }
          })
      );
    }

    // todo refactor places where list.owner is used.
    // instead list._owner should be used
    if (list._owner === loggedInUserId || list.owner === loggedInUserId) {
      const result = await this.storageClient.put(
        Object.assign({}, list, {
          _rev: null,
          pending: null,
          list: list.list && list.list.map(({_id}) => ({_id}))
        })
      );
      Object.assign(list, result.data);
    }

    return list;
  }

  async deleteList(id) {
    await this.storageClient.delete({id});
  }
}
