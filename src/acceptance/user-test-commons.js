/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

module.exports = {
  expectError_UnknownLoginToken,
  expectError_UserDoesNotExist,
  expectError_WrongContentType,
  expectLocation
};

const {expect} = require('chai');
const {expectFailure} = require('fixtures/output-verifiers');

function expectError_UserDoesNotExist(response) {
  expectFailure(response.body, errors => {
    expect(errors).to.have.length(1);
    const error = errors[0];
    expect(error.title).to.match(/user not found/i);
    // expect(error.detail).to.match(/no user with openplatform id/i);
    expect(error.detail).to.match(/user.+does not exist or is deleted/i);
  });
  expect(response.status).to.equal(404);
}

function expectError_UnknownLoginToken(uri) {
  expectLocation(uri);
  return response => {
    expectFailure(response.body, errors => {
      expect(errors).to.have.length(1);
      const error = errors[0];
      expect(error.title).to.match(/user not logged in/i);
      expect(error.detail).to.match(/User not logged in or session expired/i);
      expect(error).to.have.property('meta');
      expect(error.meta).to.have.property('resource');
      expect(error.meta.resource).to.equal(uri);
    });
    expect(response.status).to.equal(200);
  };
}

function expectError_WrongContentType(response) {
  expectFailure(response.body, errors => {
    expect(errors).to.have.length(1);
    const error = errors[0];
    expect(error.title).to.match(/data .+ provided as application\/json/i);
    expect(error).to.have.property('detail');
    expect(error.detail).to.match(/text\/plain .*not supported/i);
  });
  expect(response.status).to.equal(400);
}

function expectLocation(uri) {
  expect(uri).to.be.a('string', 'Not a URI');
  expect(uri).to.match(
    /^\/v1\/(lists|profiles|public-lists|shortlist|user)/i,
    'Not a URI'
  );
}
