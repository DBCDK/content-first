'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const json = require('./json');
const path = require('path');

describe('json', () => {
  describe('toLoggableString', () => {
    it('should return a string as-is', () => {
      expect(json.toLoggableString('Hello\nwörld')).to.equal('Hello world');
    });
    it('should flatten JSON', () => {
      expect(
        json.toLoggableString({Hello: [{world: ' - no answer '}]})
      ).to.equal('{"Hello":[{"world":" - no answer "}]}');
    });
  });

  describe('nicifyJsonValidationErrors', () => {
    it('should return a list of human-readable problems', () => {
      expect(
        json.nicifyJsonValidationErrors({
          errors: [
            {field: 'data.pid', message: 'is the wrong type'},
            {field: 'data.workId', message: 'is required'},
            {field: 'data["api-version"]', message: 'is the wrong type'}
          ]
        })
      ).to.deep.equal([
        'field pid is the wrong type',
        'field workId is required',
        'field api-version is the wrong type'
      ]);
    });
  });

  describe('validatingInput', () => {
    const schema = path.resolve('src/fixtures/schemas/status-out.json');
    it('should reject document that does not adhere to schema', () => {
      return expect(
        json.validatingInput({'api-version': [5, 1]}, schema)
      ).to.be.rejected.then(error => {
        expect(error).to.have.property('status');
        expect(error.status).to.equal(400);
        expect(error).to.have.property('title');
        expect(error.title).to.equal(
          'Input data does not adhere to JSON schema'
        );
        expect(error).to.have.property('meta');
        expect(error.meta).to.have.property('problems');
        expect(error.meta.problems).to.deep.equal([
          'field ok is required',
          'field version is required',
          'field api-version is the wrong type'
        ]);
      });
    });
    it('should accept document that adheres to schema', () => {
      const document = {
        ok: true,
        services: [
          {
            service: 'db',
            ok: true
          },
          {
            service: 'mail',
            ok: false,
            problems: 'Not working'
          }
        ],
        version: '1.2.3',
        'api-version': '1.2.3'
      };
      return expect(json.validatingInput(document, schema)).to.become(document);
    });
  });
});
