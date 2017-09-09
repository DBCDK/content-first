/*
 * Common verifiers and JSON validator functions for endpoint testing.
 */

'use strict';

const expect = require('chai').expect;
const validator = require('is-my-json-valid/require');
const formats = require('server/schemas/formats');

function expectSuccess(document, next) {
  const validate = validator('schemas/success-out.json');
  validate(document);
  const errors = JSON.stringify(validate.errors);
  expect(errors).to.equal('null');
  const links = document.links;
  expect(document).to.have.property('data');
  const data = document.data;
  next(links, data);
}
exports.expectSuccess = expectSuccess;

function expectFailure(document, next) {
  const validate = validator('schemas/failure-out.json');
  validate(document);
  const problems = JSON.stringify(validate.errors);
  expect(problems).to.equal('null');
  expect(document).to.have.property('errors');
  const errors = document.errors;
  expect(errors).to.be.an('array');
  next(errors);
}
exports.expectFailure = expectFailure;

function expectValidate(document, schema) {
  const validate = validator(schema, formats);
  validate(document);
  const errors = JSON.stringify(validate.errors);
  expect(errors).to.equal('null');
}
exports.expectValidate = expectValidate;
