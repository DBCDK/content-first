/*
 * Common verifiers and JSON validator functions for endpoint testing.
 */

'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;
const validator = require('is-my-json-valid/require');
const formats = require('server/schemas/formats');
const nicifyJsonValidationErrors = require('__/json').nicifyJsonValidationErrors;

function expectSuccess(document, next) {
  const validate = validator('schemas/success-out.json');
  validate(document);
  const problems = nicifyJsonValidationErrors(validate);
  if (problems.length > 0) {
    expect(problems).to.deep.equal([], `Got ${JSON.stringify(document)}`);
  }
  const links = document.links;
  expect(document).to.have.property('data');
  const data = document.data;
  next(links, data);
}
exports.expectSuccess = expectSuccess;

function expectFailure(document, next) {
  const validate = validator('schemas/failure-out.json');
  validate(document);
  const problems = nicifyJsonValidationErrors(validate);
  if (problems.length > 0) {
    expect(problems).to.deep.equal([], `Got ${JSON.stringify(document)}`);
  }
  expect(document).to.have.property('errors');
  const errors = document.errors;
  expect(errors).to.be.an('array');
  next(errors);
}
exports.expectFailure = expectFailure;

function expectValidate(document, schema) {
  const validate = validator(schema, formats);
  validate(document);
  const problems = nicifyJsonValidationErrors(validate);
  if (problems.length > 0) {
    assert(false, `Got JSON ${JSON.stringify(document)} with the following problems: ${problems}`);
  }
  expect(problems).to.deep.equal([]);
}
exports.expectValidate = expectValidate;
