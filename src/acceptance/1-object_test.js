/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const {expect} = require('chai');
const request = require('supertest');
const _ = require('lodash');

describe('Endpoint /v1/object', () => {
  const webapp = request(mock.external);
  const internalApp = request(mock.internal);
  let cookie1, cookie2, objects;
  const user1 = {
    id: '123openplatformId456',
    token: '123openplatformToken456'
  };
  const user2 = {
    id: '123openplatformId2',
    token: '123openplatformToken2'
  };
  // _ids of test objects in database
  let objectResults;

  before(async () => {
    cookie1 = mock.createLoginCookie(
      'valid-login-token-for-user-seeded-on-test-start'
    );
    cookie2 = mock.createLoginCookie(
      'valid-login-token-for-user2-seeded-on-test-start'
    );
    objects = [
      [cookie1, {_type: 'test', text: 'object0', _public: false}],
      [cookie1, {_type: 'test', _key: 'hi', _public: true}],
      [cookie1, {_type: 'test', _key: 'ho', some: 'property', _public: true}],
      [cookie2, {_type: 'test', _key: 'hi', _public: true, other: 'property'}],
      [cookie2, {_type: 'test', _key: 'hi', Im: 'private'}],
      [cookie1, {_type: 'test', _key: 'hi', _public: true}],
      [cookie1, {_type: 'test'}]
    ];
  });

  beforeEach(async () => {
    await mock.resetting();
    await internalApp.get('/v1/test/initStorage');
    objectResults = [];
    for (const [cookie, obj] of objects) {
      objectResults.push({
        cookie,
        _id: (await webapp
          .post('/v1/object')
          .set('cookie', cookie)
          .send(obj)).body.data._id
      });
    }
  });

  afterEach(async () => {
    await internalApp.get('/v1/test/wipeStorage');
  });

  describe('Public endpoint', () => {
    describe('GET /v1/object/:pid', () => {
      it('should retrieve object', async () => {
        const id = objectResults[0]._id;
        const result = (await webapp
          .get(`/v1/object/${id}`)
          .set('cookie', cookie1)).body;
        const object = _.omit(result.data, ['_created', '_modified', '_rev']);
        expect(object).to.deep.equal({
          text: 'object0',
          _id: id,
          _key: '',
          _owner: user1.id,
          _public: false,
          _type: 'test'
        });
        expect(result.errors).to.be.an('undefined');
        expect(result.data._created).to.be.an('number');
        expect(result.data._modified).to.be.an('number');
      });
      it('fails with 404 when it does not exist', async () => {
        const result = await webapp
          .get(`/v1/object/c71b92a0-6b0d-11e8-bf34-dfd6f8cd7d98`)
          .set('cookie', cookie1);
        expect(result.status).to.equal(404);
        expect(result.body).to.deep.equal({
          data: {error: 'not found'},
          errors: [{status: 404, message: 'not found'}]
        });
      });
      it('fails with 403 when it does not have read rights', async () => {
        const id = objectResults[0]._id;
        const result = await webapp
          .get(`/v1/object/${id}`)
          .set('cookie', cookie2);
        expect(result.status).to.equal(403);
        expect(result.body).to.deep.equal({
          data: {error: 'forbidden'},
          errors: [{status: 403, message: 'forbidden'}]
        });
      });
    });
    describe('GET /v1/object/find', () => {
      it('find objects all public objects of given type', async () => {
        const result = (await webapp
          .get(`/v1/object/find?type=test`)
          .set('cookie', cookie2)).body;
        expect(result.errors).to.be.an('undefined');
        expect(result.data.length).to.equal(4);
      });
      it('find objects all own objects of given type', async () => {
        const result = (await webapp
          .get(`/v1/object/find?type=test&owner=${user2.id}`)
          .set('cookie', cookie2)).body;
        expect(result.errors).to.be.an('undefined');
        expect(result.data.length).to.equal(2);
      });
      it('find all public objects of given type+user+key', async () => {
        const result = (await webapp
          .get(`/v1/object/find?type=test&owner=${user2.id}&key=hi`)
          .set('cookie', cookie1)).body;
        expect(result.errors).to.be.an('undefined');
        expect(result.data.length).to.equal(1);
      });
      it('find objects all public objects of given type+owner', async () => {
        const result = (await webapp
          .get(`/v1/object/find?type=test&owner=${user1.id}`)
          .set('cookie', cookie2)).body;
        expect(result.errors).to.be.an('undefined');
        expect(result.data.length).to.equal(3);
      });
      it('find objects all public objects of given type+key', async () => {
        const result = (await webapp
          .get(`/v1/object/find?type=test&key=hi`)
          .set('cookie', cookie2)).body;
        expect(result.errors).to.be.an('undefined');
        expect(result.data.length).to.equal(3);
      });
      it('find public objects with limit', async () => {
        const result = (await webapp
          .get(`/v1/object/find?type=test&key=hi&limit=1`)
          .set('cookie', cookie2)).body;
        expect(result.errors).to.be.an('undefined');
        expect(result.data.length).to.equal(1);
      });
      it('find private objects with limit', async () => {
        const result = (await webapp
          .get(`/v1/object/find?type=test&key=hi&owner=${user1.id}&limit=1`)
          .set('cookie', cookie2)).body;
        expect(result.errors).to.be.an('undefined');
        expect(result.data.length).to.equal(1);
      });
      it('find no objects', async () => {
        const result = (await webapp
          .get(`/v1/object/find?type=test&key=nonexistant`)
          .set('cookie', cookie2)).body;
        expect(result.errors).to.be.an('undefined');
        expect(result.data.length).to.equal(0);
      });
    });
    describe('DELETE /v1/object/:pid', () => {
      it('successful deletes', async () => {
        const id = objectResults[1]._id;
        let result = await webapp
          .get(`/v1/object/${id}`)
          .set('cookie', cookie1);
        expect(result.status).to.equal(200);
        result = await webapp.delete(`/v1/object/${id}`).set('cookie', cookie1);
        expect(result.status).to.equal(200);
        expect(result.body).to.deep.equal({data: {ok: true}});
        result = await webapp.get(`/v1/object/${id}`).set('cookie', cookie1);
        expect(result.status).to.equal(404);
      });
      it('returns forbidden when not owner', async () => {
        const id = objectResults[1]._id;
        const result = await webapp
          .delete(`/v1/object/${id}`)
          .set('cookie', cookie2);
        expect(result.status).to.equal(403);
        expect(result.body).to.deep.equal({
          data: {error: 'forbidden'},
          errors: [{status: 403, message: 'forbidden'}]
        });
      });
      it('returns 404 when not found', async () => {
        const result = await webapp
          .delete(`/v1/object/c71b92a0-6b0d-11e8-bf34-dfd6f8cd7d98`)
          .set('cookie', cookie2);
        expect(result.status).to.equal(404);
        expect(result.body).to.deep.equal({
          data: {error: 'not found'},
          errors: [{status: 404, message: 'not found'}]
        });
      });
    });
    describe('POST /v1/object', () => {
      it('create new object', async () => {
        const result = (await webapp
          .post('/v1/object')
          .set('cookie', cookie1)
          .send({_type: 'test', _key: '123', hello: 'world'})).body;
        expect(Object.keys(result.data)).to.deep.equal(['_id', '_rev']);
        expect(result.errors).to.be.an('undefined');

        let obj = (await webapp
          .get(`/v1/object/${result.data._id}`)
          .set('cookie', cookie1)).body.data;
        expect(obj.hello).to.equal('world');
      });
      it('change an object', async () => {
        const id = objectResults[0]._id;
        let obj = (await webapp.get(`/v1/object/${id}`).set('cookie', cookie1))
          .body.data;
        obj.changed = true;

        const result = await webapp
          .post('/v1/object')
          .set('cookie', cookie1)
          .send(obj);
        expect(result.status).to.equal(200);
        expect(result.body.data._id).to.equal(obj._id);
        expect(result.body.data._rev).to.be.a('string');

        let newObj = (await webapp
          .get(`/v1/object/${id}`)
          .set('cookie', cookie1)).body.data;
        expect(newObj.changed).to.equal(true);
        expect(newObj._rev).to.equal(result.body.data._rev);
      });
    });
    describe('PUT /v1/object/:pid', () => {
      it('overwrite object', async () => {
        const id = objectResults[0]._id;
        const result = (await webapp
          .put(`/v1/object/${id}`)
          .set('cookie', cookie1)
          .send({_type: 'test', _key: '123', hi: 'world', _public: true})).body;
        const getResult = (await webapp.get(`/v1/object/${id}`)).body;
        const object = _.omit(getResult.data, [
          '_created',
          '_modified',
          '_rev'
        ]);
        expect(object).to.deep.equal({
          hi: 'world',
          _id: id,
          _key: '123',
          _owner: user1.id,
          _public: true,
          _type: 'test'
        });
        expect(result.errors).to.be.an('undefined');
      });
      it('fails with wrong revision', async () => {
        const id = objectResults[0]._id;
        const result = await webapp
          .put(`/v1/object/${id}`)
          .set('cookie', cookie1)
          .send({_type: 'test', _rev: 'wrong-revision', _key: '123'});
        expect(result.status).to.equal(409);
        expect(result.body).to.deep.equal({
          data: {error: 'conflict'},
          errors: [{status: 409, message: 'conflict'}]
        });
      });
      it('fails with user now owning the object', async () => {
        const id = objectResults[1]._id;
        const result = await webapp
          .put(`/v1/object/${id}`)
          .set('cookie', cookie2)
          .send({_type: 'test', _key: '123', hi: 'world', _public: true});
        expect(result.status).to.equal(403);
        expect(result.body).to.deep.equal({
          data: {error: 'forbidden'},
          errors: [{status: 403, message: 'forbidden'}]
        });
      });
      it('fails with non-existing object', async () => {
        const result = await webapp
          .put(`/v1/object/c71b92a0-6b0d-11e8-bf34-dfd6f8cd7d98`)
          .set('cookie', cookie2)
          .send({_type: 'test', _key: '123', hi: 'world', _public: true});
        expect(result.status).to.equal(404);
        expect(result.body).to.deep.equal({
          data: {error: 'not found'},
          errors: [{status: 404, message: 'not found'}]
        });
      });
    });
  });
});
