'use strict';

const constants = require('server/constants')();
const taxonomyTopTable = constants.taxonomy.topTable;
const taxonomyMiddleTable = constants.taxonomy.middleTable;
const taxonomyBottomTable = constants.taxonomy.bottomTable;

exports.up = function(knex) {
  return knex.schema.createTable(taxonomyTopTable, table => {
    table.integer('id').primary();
    table.string('title').notNullable();
  })
    .then(() => {
      return knex.schema.createTable(taxonomyMiddleTable, table => {
        table.integer('id').primary();
        table.integer('top').notNullable();
        table.foreign('top').references(`${taxonomyTopTable}.id`);
        table.string('title').notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable(taxonomyBottomTable, table => {
        table.integer('id').primary();
        table.integer('middle').notNullable();
        table.foreign('middle').references(`${taxonomyMiddleTable}.id`);
        table.string('title').notNullable();
      });
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists(taxonomyBottomTable)
    .then(() => {
      return knex.schema.dropTableIfExists(taxonomyMiddleTable);
    })
    .then(() => {
      return knex.schema.dropTableIfExists(taxonomyTopTable);
    });
};
