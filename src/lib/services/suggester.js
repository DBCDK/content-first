const _ = require('lodash');
const request = require('superagent');

class Suggester {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.clear();
  }

  getName() {
    return 'suggester';
  }

  clear() {
    this.setOk();
    this.errorLog = [];
  }

  setOk() {
    this.ok = true;
    this.currentError = null;
  }
  isOk() {
    return this.ok;
  }

  getCurrentError() {
    return this.currentError;
  }

  getErrorLog() {
    return this.errorLog;
  }

  async getSuggestions(params) {
    try {
      const result = await request.get(this.config.suggester.url).query(params);
      return result.body;
    } catch (e) {
      const msg = _.get(e, 'response.body.value') || 'Internal server error';
      this.logger.log.error({
        source: 'suggester',
        error: msg
      });
      throw new Error(msg);
    }
  }
  async testingConnection() {
    try {
      const result = await request.get(this.config.suggester.status);
      return result.body.ok;
    } catch (e) {
      this.ok = false;
      this.currentError = e.message;
    }
  }
}

module.exports = Suggester;
