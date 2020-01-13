const _ = require('lodash');
const request = require('superagent');

/**
 * Get recommendations
 */

class RecompasTags {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.clear();
  }

  getName() {
    return 'recompasTags';
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

  async getRecommendations({
    tags,
    creators,
    maxresults,
    agencyId,
    branch,
    timeout
  }) {
    try {
      let branchid;
      let status;
      if (agencyId && branch) {
        branchid = `${agencyId}|${branch}`;
        status = 'onShelf';
      }
      const result = await request
        .post(this.config.recompass.url.tags)
        .send({tags, creators, maxresults, branchid, status, timeout});
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
        this.config.recompass.url.tags + '/status'
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

module.exports = RecompasTags;
