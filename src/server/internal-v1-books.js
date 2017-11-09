'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const bookTable = constants.books.table;
const bookUtil = require('server/books');
const {validatingInput, validatingInputs} = require('__/json');
const path = require('path');
const schemaBooks = path.join(__dirname, 'schemas/books-in.json');
const schemaOneBook = path.join(__dirname, 'schemas/book-in.json');

router.route('/')
  //
  // PUT /v1/books
  //
  .put(asyncMiddleware(async (req, res, next) => {
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
      return next({
        status: 400,
        title: 'Books have to be provided as application/json',
        detail: `Content type ${contentType} is not supported`
      });
    }
    try {
      await validatingInput(req.body, schemaBooks);
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Malformed book data',
        detail: 'Book data does not adhere to schema',
        meta: error.meta || error
      });
    }
    let books;
    try {
      books = await validatingInputs(req.body, schemaOneBook);
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Malformed book data',
        detail: 'Book data does not adhere to schema',
        meta: error.meta || error
      });
    }
    try {
      await knex.transaction(transaction => {
        return books.reduce((prev, book) => {
          return prev.then(() => {
            return bookUtil.parsingMetaDataInjection(book)
              .then(meta => {
                const spiked = bookUtil.transformMetaDataToBook(meta);
                return transaction.insert(spiked).into(bookTable);
              });
          });
        }, transaction.raw(`truncate table ${bookTable}`));
      });
    }
    catch (error) {
      const errorRegex = /^key \(pid\)=\(([^)]+)\) already exists/i;
      if (typeof error.detail === 'string' && error.detail.match(errorRegex)) {
        const matches = error.detail.match(errorRegex);
        return next({
          status: 400,
          title: 'Duplicate PID',
          detail: `PID ${matches[1]} duplicated`,
          meta: error
        });
      }
      return next({
        status: 500,
        title: 'Database operation failed',
        meta: error
      });
    }
    return res.status(200).json({
      data: `${books.length} books created`,
      links: {self: '/v1/books'}
    });
  }))
;

module.exports = router;
