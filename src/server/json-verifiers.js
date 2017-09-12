/*
 * Common verifiers and JSON validator functions for the service.
 */
'use strict';
const validator = require('is-my-json-valid/require');
const formats = require('server/schemas/formats');
const _ = require('lodash');

function validatingInput (document, schema) {
  return new Promise((resolve, reject) => {
    const validate = validator(schema, formats);
    if (validate(document)) {
      return resolve(document);
    }
    // Massage array of objects of errors into human-readable form.
    const niceErrors = _.map(_.map(_.map(validate.errors, _.values), _.curry(_.join)(_, ' ')), x => _.replace(x, 'data.', ''));
    reject({
      status: 400,
      title: `Input data does not adhere to ${schema}`,
      meta: {body: document, problems: niceErrors}
    });
  });
}
exports.validatingInput = validatingInput;
