'use strict';

/**
 * Database error accounting.
 */
class Database {
  constructor(knex) {
    this.knex = knex;
    this.ok = true;
    this.currentError = null;
    this.databaseErrors = [];
  }
  clear() {
    this.setOk();
  }
  getName() {
    return 'database';
  }
  isOk() {
    return this.ok;
  }
  setOk() {
    this.ok = true;
    this.currentError = null;
  }
  getCurrentError() {
    if (this.isOk()) {
      return null;
    }
    return this.currentError;
  }
  getErrorLog() {
    return this.databaseErrors;
  }
  logError(error) {
    this.currentError = 'Database probably unreachable';
    this.databaseErrors.push(new Date().toISOString() + ': ' + error);
    this.ok = false;
  }
  testingConnection() {
    const me = this;
    // Make a dummy query.
    return me.knex
      .raw('select * from cookies limit 1')
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
