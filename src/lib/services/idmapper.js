const _ = require('lodash');
const request = require('superagent');
const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 60 * 60 * 24}); // Time to live is 24 hours

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
      const pidsToFetch = pids.filter(pid => !cache.get(pid));
      if (pidsToFetch.length > 0) {
        const result = await request
          .post(`${this.config.idmapper.url}/map/pid-to-workpids`)
          .send(pidsToFetch);
        Object.entries(result.body).forEach(([key, val]) =>
          cache.set(key, val)
        );
      }
      const body = {};
      pids.forEach(pid => (body[pid] = cache.get(pid)));

      return body;
    } catch (e) {
      const msg = _.get(e, 'response.body.value') || 'Internal server error';
      this.logger.log.error({
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
