const _ = require('lodash');
const request = require('superagent');

/**
 * Get id mappings
 */

class IDMapper {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.clear();
  }

  getName() {
    return 'idmapper';
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

  async pidToWorkPids(pids) {
    try {
      const result = await request
        .post(`${this.config.idmapper.url}/map/pid-to-workpids`)
        .send(pids);
      return result.body;
    } catch (e) {
      const msg = _.get(e, 'response.body.value') || 'Internal server error';
      this.logger.log.error('pidToWorkPids - error', {
        source: 'idmapper',
        errorMessage: msg,
        stack: e.stack
      });
      throw new Error(msg);
    }
  }
  async testingConnection() {
    await request.get(this.config.holdings.url);
    return this.isOk();
  }
}

module.exports = IDMapper;
