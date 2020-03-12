const _ = require('lodash');
const request = require('superagent');

/**
 * Get recommendations
 */

class RecompasWork {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.clear();
  }

  getName() {
    return 'recompasWork';
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

  async getRecommendations(query) {
    try {
      if (query.agencyId && query.branch) {
        query = {
          ...query,
          branchid: `${query.agencyId}|${
            query.branch.match(/^".*"$/) ? query.branch : `"${query.branch}"`
          }`,
          status: 'onShelf'
        };
        delete query.agencyId;
        delete query.branch;
      }
      query.types = ['Lydbog (net)', 'Ebog'];
      const result = await request
        .post(this.config.recompass.url.work)
        .send(query);
      return result.body;
    } catch (e) {
      const msg = _.get(e, 'response.body.value') || 'Internal server error';
      this.logger.log.error({
        source: 'recommender',
        error: msg
      });
      throw new Error(msg);
    }
  }
  async testingConnection() {
    try {
      const result = await request.get(
        this.config.recompass.url.work + '/status'
      );
      if (!result.body.ok) {
        throw new Error('Recommender /status returns not ok');
      }
      return this.isOk();
    } catch (e) {
      this.ok = false;
      this.currentError = e.message;
    }
  }
}

module.exports = RecompasWork;
