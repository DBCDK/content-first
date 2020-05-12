import request from 'superagent';

export default class StorageClient {
  async get(params, role) {
    return (await request.get(`/v1/object/${params.id}`).query({role})).body;
  }
  async put(object, role) {
    return (
      await request
        .post('/v1/object/')
        .query({role})
        .send(object)
    ).body;
  }
  async find(query, role) {
    return (await request.get('/v1/object/find').query({...query, role})).body;
  }
  async delete(params, role) {
    return (await request.del(`/v1/object/${params.id}`).query({role})).body;
  }
}
