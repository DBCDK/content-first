/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const seeder = require('./seed-community');
const {expect} = require('chai');
const request = require('supertest');
const {expectSuccess, expectValidate} = require('fixtures/output-verifiers');

describe('List interactions', () => {
  const webapp = request(mock.external);

  beforeEach(async () => {
    await mock.resetting();
    await seeder.seedingCommunity('0101781234');
  });

  afterEach(function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  it('PUT /shortlist should not interact with other lists', () => {
    // Arrange.
    const loginToken = 'a-valid-login-token-seeded-on-test-start';
    return webapp
      .put('/v1/shortlist')
      .set('cookie', `login-token=${loginToken}`)
      .type('application/json')
      .send([])
      .expect(200)
      .then(() => {
        // Act.
        return webapp
          .get('/v1/lists')
          .set('cookie', `login-token=${loginToken}`)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(data, 'schemas/lists-data-out.json');
              expect(data).to.deep.include({
                id: 'fc8fbafab2a94bfaae5f84b1d5bfd480',
                type: 'SYSTEM_LIST',
                public: false,
                title: 'My List',
                description: 'A brand new list',
                list: [
                  {
                    pid: '870970-basis-22629344',
                    description: 'Magic to the people'
                  }
                ]
              });
              expect(data).to.deep.include({
                id: 'fa4f3a3de3a34a188234ed298ecbe810',
                type: 'CUSTOM_LIST',
                public: false,
                title: 'Gamle Perler',
                description: 'Bøger man simpelthen må læse',
                list: [
                  {
                    pid: '870970-basis-47573974',
                    description: 'Russisk forvekslingskomedie'
                  }
                ]
              });
            });
          })
          .expect(200);
      });
  });
});
