const _ = require('lodash');
const request = require('superagent');

/**
 * Get recommendations
 */

class Holdings {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.clear();
  }

  getName() {
    return 'holdings';
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

  extractHoldingsData(holdings) {
    const docs = holdings && holdings.response && holdings.response.docs;
    return docs.map(item => ({
      agencyId: item['holdingsitem.agencyId'],
      branch: item['holdingsitem.branch'],
      collectionId: item['holdingsitem.collectionId'],
      bibliographicRecordId: item['holdingsitem.bibliographicRecordId'],
      department: item['holdingsitem.department'],
      location: item['holdingsitem.location'],
      subLocation: item['holdingsitem.subLocation'],
      onShelf: item['holdingsitem.status'].includes('OnShelf'),
      notForLoan: item['holdingsitem.status'].includes('NotForLoan')
    }));
  }

  async getHoldings(query) {
    try {
      const result = await request.get(this.config.holdings.url).query(query);
      return this.extractHoldingsData(result.body);
    } catch (e) {
      const msg = _.get(e, 'response.body.value') || 'Internal server error';
      this.logger.log.error({
        source: 'holdings',
        error: msg
      });
      throw new Error(msg);
    }
  }
  async testingConnection() {
    await request.get(this.config.holdings.url);
    return this.isOk();
  }
}

module.exports = Holdings;
