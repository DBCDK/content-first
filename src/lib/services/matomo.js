const request = require('superagent');
const {debounce} = require('lodash');

/**
 * MatomoClient make use of the "bulk tracking" API of Matomo to track events.
 * https://developer.matomo.org/api-reference/tracking-api
 *
 * This API allow for large events, which would otherwise result in a HTTP error
 * 415 URI too long. Furthermore, we can use debounce to reduce the number
 * of HTTP requests to Matomo.
 *
 * The Matomo event has four components; category, action, name, value (number only).
 * We need to store more complex events, hence we use the name attribute
 * to store a stringified JSON.
 */
class MatomoClient {
  constructor(matomoUrl, siteId, logger, debounceWaitMs = 2000) {
    this.matomoUrl = matomoUrl;
    this.siteId = siteId;
    this.logger = logger;
    this.queue = [];
    this._postEvents = debounce(this._postEvents, debounceWaitMs, {
      trailing: true
    });

    if (!siteId || !matomoUrl) {
      logger.log.info({
        source: 'matomo',
        msg: 'Matomo tracking is disabled since it is not configured'
      });
      this.trackDataEvent = () => {};
    } else {
      logger.log.info({
        source: 'matomo',
        msg: `Matomo tracking is enabled`,
        matomoUrl,
        siteId
      });
    }
  }

  /**
   * trackDataEvent - will track a data event
   *
   * @param  {string} action name of the action
   * @param  {Object} data   data object
   * @return {void}
   */
  trackDataEvent(action, data) {
    const uri = `?idsite=${
      this.siteId
    }&rec=1&e_c=data&e_a=${action}&e_n=${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    this.queue.push(uri);
    this._postEvents();
  }

  async _postEvents() {
    const events = this.queue;
    this.queue = [];
    try {
      await request.post(this.matomoUrl + '/piwik.php').send({
        requests: events
      });
    } catch (error) {
      this.logger.log.error({
        source: 'matomo',
        error,
        events
      });
    }
  }
}
module.exports = MatomoClient;
