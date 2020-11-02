const _ = require('lodash');
const request = require('superagent');

const exportTaxonomyURL =
  'https://artifactory.dbc.dk/artifactory/fe-generic/metakompasset/json-files.tar.gz!/exportTaxonomy.json';

class Taxonomy {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.clear();
  }

  getName() {
    return 'taxonomy';
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

  async getTaxonomy() {
    try {
      const result = await request.get(exportTaxonomyURL);
      return result.body;
    } catch (e) {
      const msg = _.get(e, 'response.body.value') || 'Internal server error';
      this.logger.log.error('get suggestions - error', {
        source: 'taxonomy',
        errorMessage: msg,
        stack: e.stack
      });
      throw new Error(msg);
    }
  }
}

module.exports = Taxonomy;
