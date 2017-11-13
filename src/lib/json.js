'use strict';

const _ = require('lodash');
const validator = require('is-my-json-valid');
const formats = require('__/schemas/formats');
const path = require('path');

/**
 * A promise to validate document against a JSON schema, which resolves to the
 * document itself, or rejects with a webservice-friendly
 *   {status, title, meta: {body, problems}}
 * structure.
 */
function validatingInput (document, schemaPath) {
  return new Promise((resolve, reject) => {
    let schema;
    try {
      schema = require(schemaPath);
    }
    catch (error) {
      reject({
        status: 500,
        title: 'Schema not found',
        meta: {body: document, problems: `Schema ${schemaPath} not found: ${error}`}
      });
    }
    try {
      const validate = validator(schema, formats);
      if (validate(document)) {
        return resolve(document);
      }
      // Massage array of objects of errors into human-readable form.
      const niceErrors = nicifyJsonValidationErrors(validate);
      reject({
        status: 400,
        title: 'Input data does not adhere to JSON schema',
        detail: `Input data does not adhere to ${path.basename(schemaPath)}`,
        meta: {body: document, problems: niceErrors}
      });
    }
    catch (error) {
      reject(error);
    }
  });
}

/**
 * Fixate validation on a specific schema.
 * @param  {json} schemaPath       JSON schema
 * @return {Promise(validation)}   Promise of validation.
 */
function validating (schemaPath) {
  return document => validatingInput(document, schemaPath);
}

/**
 * A promise to validate each item in a list of JSON documents against a
 * schema, which resolves to the list itself, or rejects like validatingInput.
 */
function validatingInputs (items, schemaPath) {
  return items.reduce((prev, item) => {
    return prev.then(() => {
      return validatingInput(item, schemaPath);
    });
  }, Promise.resolve())
    .then(() => {
      return items;
    });
}

/**
 * Takes the validation output from a failed validate-my-json and returns the
 * list of errors in a more readable form, like
 *
 *     ['pid is the wrong type', 'creator is required']
 */
function nicifyJsonValidationErrors (validate) {
  return _.map(
    _.map(
      _.map(validate.errors, _.values),
      _.curry(_.join)(_, ' ')
    ),
    x => _.replace(_.replace(_.replace(x, 'data["', 'field '), '"]', ''), 'data.', 'field ')
  );
}

module.exports = {
  validatingInput,
  validatingInputs,
  validating,
  nicifyJsonValidationErrors
};
