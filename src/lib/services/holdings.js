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
      notForLoan: item['holdingsitem.status'].includes('NotForLoan'),
      onLoan: item['holdingsitem.status'].includes('OnLoan')
    }));
  }

  getRecordId(pid) {
    const pidSplit = pid.split(':');
    if (pidSplit.length > 1) {
      return pidSplit[1];
    }
    return pid;
  }

  createQuery(agencyId, branch, recordIds) {
    return `holdingsitem.agencyId:${agencyId} AND holdingsitem.branch:${branch} AND (${recordIds
      .map(recordId => `holdingsitem.bibliographicRecordId:${recordId}`)
      .join(' OR ')})`;
  }

  async getHoldings(agencyId, branch, pids) {
    try {
      const recordIds = pids.map(pid => this.getRecordId(pid));
      const q = this.createQuery(agencyId, branch, recordIds);
      const result = await request.get(this.config.holdings.url).query({q});
      const holdingsData = this.extractHoldingsData(result.body);
      const recordIdToHoldingsMap = holdingsData.reduce(
        (map, holding) => ({...map, [holding.bibliographicRecordId]: holding}),
        {}
      );
      const pidToHoldingMap = pids.reduce((map, pid) => {
        const recordId = this.getRecordId(pid);
        return {
          ...map,
          [pid]: recordIdToHoldingsMap[recordId]
        };
      }, {});
      return pidToHoldingMap;
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
