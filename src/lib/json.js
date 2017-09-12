'use strict';

const _ = require('lodash');

/**
 * Takes the validation output from a failed validate-my-json and returns the
 * list of errors in a more readable form, like
 *
 *     ['pid is the wrong type', 'creator is required']
 */
function nicifyJsonValidationErrors (validate) {
  return _.map(_.map(_.map(validate.errors, _.values), _.curry(_.join)(_, ' ')), x => _.replace(x, 'data.', 'field '));
}
exports.nicifyJsonValidationErrors = nicifyJsonValidationErrors;
