/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const seeder = require('./seed-community');
const supertest = require('supertest');

const chai = require('chai');
const expect = require('chai').expect;

describe('User data', () => {
  const request = supertest(mock.external);

  beforeEach(async () => {
    await mock.resetting();
    await seeder.seedingCommunity();
  });

  afterEach(function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  describe('/v1/object', () => {
    it('should correctly run through a usage flow', async () => {
      const cookieUser1 = 'login-token=a-valid-login-token';
      const cookieUser2 = 'login-token=a-valid-login-token-for-other-user';
      const url = '/v1';

      let result;
      const user1 = (await request
        .get(url + '/user')
        .set('cookie', cookieUser1)).body.data;

      // Try to find a public writable list owned by user1
      result = (await request.get(url + '/object/find?type=list')).body.data;
      let list = result.find(
        o => o.writable && o.owner === user1.openplatformId
      );

      // Create a new public writable list owned by user1 if none found
      if (!list) {
        list = {
          type: 'list',
          writable: true,
          public: true,
          description: 'some list description',
          children: []
        };
        result = (await request
          .post(url + '/object')
          .set('cookie', cookieUser1)
          .send(list)).body.data;
        expect(Object.keys(result)).to.deep.equal(['ok', 'id', 'rev']);
        Object.assign(list, {
          _rev: result.rev,
          _id: result.id,
          owner: user1.openplatformId
        });
      }

      // We can fetch the list, even as anonymous user as it is public.
      const dbList = (await request.get(url + '/object/' + list._id)).body.data;
      expect(dbList).to.deep.equal(list);

      // anonymous cannot add list entries
      result = await request.post(url + '/object').send({
        type: 'listEntry',
        key: list._id,
        content: 'hi',
        public: true
      });
      expect(result.statusCode).to.equal(403);
      expect(result.text).to.equal(
        '{"data":{"error":"forbidden"},"errors":[{"message":"forbidden","status":403}]}'
      );

      // Let user 1  and user 2 add comments (order is unspecified, as added within same second) and order is given by community-service time stamp
      await request
        .post(url + '/object')
        .set('cookie', cookieUser1)
        .send({
          type: 'listEntry',
          key: list._id,
          content: 'comment1',
          public: true
        });
      await request
        .post(url + '/object')
        .set('cookie', cookieUser2)
        .send({
          type: 'listEntry',
          key: list._id,
          content: 'comment2',
          public: true
        });

      let listEntries = await (await request.get(
        url + `/object/find?type=listEntry&key=${encodeURIComponent(list._id)}`
      )).body.data;
      chai.assert(['comment1', 'comment2'].includes(listEntries[0].content));
      chai.assert(['comment1', 'comment2'].includes(listEntries[1].content));
      chai.assert(listEntries[1].content !== listEntries[0]);

      // user 2 cannot change the actual list object owned by user1
      result = await request
        .put(url + '/object/' + list._id)
        .set('cookie', cookieUser2)
        .send(list);
      expect(result.statusCode).to.equal(403);
      expect(result.text).to.equal(
        '{"data":{"error":"forbidden"},"errors":[{"status":403,"message":"forbidden"}]}'
      );

      // user 1 can change the list
      list.children = [listEntries[1]._id];
      list.blacklist = [listEntries[0]._id];
      result = await request
        .put(url + '/object/' + list._id)
        .set('cookie', cookieUser1)
        .send(list);
      expect(result.statusCode).to.equal(200);
    });
  });
});
