export default class StorageClient {
  constructor({user, objectStore}) {
    this.user = user;
    this.objectStore = objectStore;
  }
  async get(params, role) {
    return await this.objectStore.get(params, this.user, role);
  }
  async put(object, role) {
    return await this.objectStore.put(object, this.user, role);
  }
  async find(query, role) {
    return await this.objectStore.find(query, this.user, role);
  }
  async delete(params, role) {
    return await this.objectStore.del(params, this.user, role);
  }
}
