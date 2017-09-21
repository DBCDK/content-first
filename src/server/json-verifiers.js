/*
 * Common verifiers and JSON validator functions for the service.
 */
'use strict';
const validator = require('is-my-json-valid/require');
const formats = require('server/schemas/formats');
const nicifyJsonValidationErrors = require('__/json').nicifyJsonValidationErrors;

function validatingInput (document, schema) {
  return new Promise((resolve, reject) => {
    try {
      const validate = validator(schema, formats);
      if (validate(document)) {
        return resolve(document);
      }
      // Massage array of objects of errors into human-readable form.
      const niceErrors = nicifyJsonValidationErrors(validate);
      reject({
        status: 400,
        title: `Input data does not adhere to ${schema}`,
        meta: {body: document, problems: niceErrors}
      });
    }
    catch (error) {
      reject(error);
    }
  });
}
exports.validatingInput = validatingInput;
