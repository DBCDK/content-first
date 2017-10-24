'use strict';
const config = require('server/config');
const knex = require('knex')(config.db);

/**
 * Database error accounting.
 */
class Database {
  constructor () {
    this.ok = true;
    this.currentError = null;
    this.databaseErrors = [];
  }
  getName () {
    return 'database';
  }
  isOk () {
    return this.ok;
  }
  setOk () {
    this.ok = true;
  }
  getCurrentError () {
    if (this.isOk()) {
      return null;
    }
    return this.currentError;
  }
  getErrorLog () {
    return this.databaseErrors;
  }
  logError (error) {
    this.currentError = 'Database probably unreachable';
    this.databaseErrors.push(
      (new Date()).toISOString() + ': ' + error
    );
    this.ok = false;
  }
  testingConnection () {
    const me = this;
    // Make a dummy query.
    return knex.raw('select 1+1 as result')
      .then(() => {
        me.setOk();
        return me.isOk();
      })
      .catch(error => {
        me.logError(error);
        return me.isOk();
      });
  }
}

module.exports = Database;
