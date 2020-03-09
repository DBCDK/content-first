const request = require('superagent');
const {throttle} = require('lodash');

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
  constructor(
    matomoUrl,
    siteId,
    applicationId,
    logger,
    debounceWaitMs = 2000,
    siteUrl = 'https://laesekompas.dk'
  ) {
    this.matomoUrl = matomoUrl;
    this.siteId = siteId;
    this.aid = applicationId;
    this.logger = logger;
    this.siteUrl = siteUrl;
    this.queue = [];
    this._postEvents = throttle(this._postEvents, debounceWaitMs, {
      trailing: true
    });

    if (!siteId || !matomoUrl) {
      logger.log.info('Matomo tracking is disabled since it is not configured', {
        source: 'matomo'
      });
      this.trackDataEvent = () => {
      };
    } else {
      logger.log.info('Matomo tracking is enabled', {
        source: 'matomo',
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
    const uri = `?idsite=${this.siteId}&url=${
      this.siteUrl
    }&rec=1&e_c=data&e_a=${action}&e_n=${encodeURIComponent(
      JSON.stringify(Object.assign({}, data, {aid: this.aid}))
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
      this.logger.log.error('POST matomo error', {
        source: 'matomo',
        error,
        events
      });
    }
  }
}

module.exports = MatomoClient;
