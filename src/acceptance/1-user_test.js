/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const {expect} = require('chai');
const request = require('supertest');
const {
  expectError_UnknownLoginToken,
  expectError_UserDoesNotExist,
  expectError_WrongContentType
} = require('./user-test-commons');

describe('User data', () => {
  const webapp = request(mock.external);
  const location = '/v1/user';

  beforeEach(async () => {
    await mock.resetting();
  });

  afterEach(function() {
    /*
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
    */
  });

  describe('GET /v1/user/:id', () => {
    const existingUserUri = `/v1/user/${encodeURIComponent(
      '123openplatformId456'
    )}`;

    it('should handle non-existing user', () => {
      return webapp
        .get('/v1/user/does-not-exist')
        .expect(expectError_UserDoesNotExist);
    });

    it('should retrieve user data', async () => {
      const userData = (await webapp.get(existingUserUri)).body.data;
      expect(userData).to.deep.equal({
        created_epoch: 1517919638,
        name: 'testuser 123456',
        openplatformId: '123openplatformId456',
        image: 'b667c0cd-94ef-4732-b740-43cf8340511a',
        roles: [],
        acceptedTerms: true,
        profiles: [],
        lists: [
          {
            data: {
              created_epoch: 1522753045,
              modified_epoch: 1522753045,
              owner: '123openplatformId456',
              public: false,
              social: false,
              open: false,
              type: 'SYSTEM_LIST',
              title: 'Har læst',
              description: 'En liste over læste bøger',
              list: []
            },
            links: {self: '/v1/lists/830e113a-e2f3-44a6-8d4c-3918668b5769'}
          },
          {
            data: {
              created_epoch: 1522753045,
              modified_epoch: 1522753045,
              owner: '123openplatformId456',
              public: false,
              social: false,
              open: false,
              type: 'SYSTEM_LIST',
              title: 'Vil læse',
              description: 'En liste over bøger jeg gerne vil læse',
              list: []
            },
            links: {self: '/v1/lists/7c4a330b-750f-460a-8b17-00bab11a2c6f'}
          }
        ]
      });
    });
  });

  describe('GET /v1/user', () => {
    it('should complain about user not logged in when no token', () => {
      return webapp // force break
        .get(location)
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when unknown token', () => {
      return webapp
        .get(location)
        .set('cookie', 'login-token=token-not-known-to-service')
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when token has expired', () => {
      return webapp
        .get(location)
        .set('cookie', 'login-token=expired-login-token')
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should retrieve user data when logged in', async () => {
      const result = await webapp
        .get(location)
        .set(
          'cookie',
          'login-token=valid-login-token-for-user-seeded-on-test-start'
        );
      expect(result.body.data).to.deep.equal({
        id: 123456,
        created_epoch: 1517919638,
        name: 'testuser 123456',
        openplatformId: '123openplatformId456',
        image: 'b667c0cd-94ef-4732-b740-43cf8340511a',
        roles: [],
        acceptedTerms: true,
        profiles: [],
        lists: [
          {
            data: {
              created_epoch: 1522753045,
              modified_epoch: 1522753045,
              owner: '123openplatformId456',
              public: false,
              social: false,
              open: false,
              type: 'SYSTEM_LIST',
              title: 'Har læst',
              description: 'En liste over læste bøger',
              list: []
            },
            links: {self: '/v1/lists/830e113a-e2f3-44a6-8d4c-3918668b5769'}
          },
          {
            data: {
              created_epoch: 1522753045,
              modified_epoch: 1522753045,
              owner: '123openplatformId456',
              public: false,
              social: false,
              open: false,
              type: 'SYSTEM_LIST',
              title: 'Vil læse',
              description: 'En liste over bøger jeg gerne vil læse',
              list: []
            },
            links: {self: '/v1/lists/7c4a330b-750f-460a-8b17-00bab11a2c6f'}
          }
        ],
        shortlist: [
          {pid: '870970-basis:52041082', origin: 'Fra "En god bog"'},
          {pid: '870970-basis:26296218', origin: 'Fra "En god bog"'},
          {pid: '870970-basis:52817757', origin: 'Fra "En god bog"'}
        ],
        openplatformToken: '123openplatformToken456'
      });
    });
  });

  describe('PUT /v1/user', () => {
    const newUserInfo = {
      name: 'Ole Henriksen',
      shortlist: [
        {
          pid: 'already-seeded-pid-blendstrup-havelaagebogen',
          origin: 'en-let-læst-bog'
        },
        {
          pid: 'already-seeded-pid-martin-ridder',
          origin: 'bibliotikarens-ugentlige-anbefaling'
        }
      ],
      profiles: [
        {
          name: 'En tynd en',
          profile: {
            moods: ['frygtelig'],
            authors: ['Carsten Jensen'],
            genres: ['Skæbnefortællinger'],
            archetypes: ['Goth']
          }
        }
      ]
    };

    it('should complain about user not logged in when no token', () => {
      return webapp
        .put(location)
        .type('application/json')
        .send(newUserInfo)
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when unknown token', () => {
      return webapp
        .put(location)
        .set('cookie', 'login-token=token-not-known-to-service')
        .type('application/json')
        .send(newUserInfo)
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when token has expired', () => {
      return webapp
        .put(location)
        .set('cookie', 'login-token=expired-login-token')
        .type('application/json')
        .send(newUserInfo)
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should reject wrong content type', () => {
      return webapp
        .put(location)
        .type('text/plain')
        .send('broken')
        .expect(expectError_WrongContentType);
    });

    it('should update valid content for logged-in user', async () => {
      const expected = {
        id: 123456,
        created_epoch: 1517919638,
        name: 'Ole Henriksen',
        openplatformId: '123openplatformId456',
        image: 'b667c0cd-94ef-4732-b740-43cf8340511a',
        roles: [],
        acceptedTerms: true,
        profiles: [
          {
            name: 'En tynd en',
            profile: {
              moods: ['frygtelig'],
              authors: ['Carsten Jensen'],
              genres: ['Skæbnefortællinger'],
              archetypes: ['Goth']
            }
          }
        ],
        lists: [
          {
            data: {
              created_epoch: 1522753045,
              modified_epoch: 1522753045,
              owner: '123openplatformId456',
              public: false,
              social: false,
              open: false,
              type: 'SYSTEM_LIST',
              title: 'Har læst',
              description: 'En liste over læste bøger',
              list: []
            },
            links: {self: '/v1/lists/830e113a-e2f3-44a6-8d4c-3918668b5769'}
          },
          {
            data: {
              created_epoch: 1522753045,
              modified_epoch: 1522753045,
              owner: '123openplatformId456',
              public: false,
              social: false,
              open: false,
              type: 'SYSTEM_LIST',
              title: 'Vil læse',
              description: 'En liste over bøger jeg gerne vil læse',
              list: []
            },
            links: {self: '/v1/lists/7c4a330b-750f-460a-8b17-00bab11a2c6f'}
          }
        ],
        shortlist: [
          {
            pid: 'already-seeded-pid-blendstrup-havelaagebogen',
            origin: 'en-let-læst-bog'
          },
          {
            pid: 'already-seeded-pid-martin-ridder',
            origin: 'bibliotikarens-ugentlige-anbefaling'
          }
        ]
      };
      const updateResult = await webapp
        .put(location)
        .set(
          'cookie',
          'login-token=valid-login-token-for-user-seeded-on-test-start'
        )
        .type('application/json')
        .send(newUserInfo);
      expect(updateResult.body.data).to.deep.equal(expected);

      const getResult = await webapp
        .get(location)
        .set(
          'cookie',
          'login-token=valid-login-token-for-user-seeded-on-test-start'
        );
      expect(getResult.body.data).to.deep.equal({
        openplatformToken: '123openplatformToken456',
        ...expected
      });
    });
  });
});
