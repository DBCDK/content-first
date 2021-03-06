import {debounce} from 'lodash';
import config from './utils/config.js';

const server = config.MATOMO_URL;
const siteId = config.MATOMO_SITE_ID;
const dataSiteId = config.MATOMO_DATA_SITE_ID;
const aid = config.MATOMO_AID;

let matomoEnabled = false;
let currentUrl;
let dataTracker;
let dataEventQueue = [];

let initialize;
let setUserStatus;
let trackEvent;
let trackDataEvent;
let setBranchKey;

if (window.Cypress && window.__stubbed_matomo__) {
  initialize = window.__stubbed_matomo__.initialize;
  setUserStatus = window.__stubbed_matomo__.setUserStatus;
  trackEvent = window.__stubbed_matomo__.trackEvent;
  trackDataEvent = window.__stubbed_matomo__.trackDataEvent;
  setBranchKey = window.__stubbed_matomo__.setBranchKey;
} else {
  /*
   * Initializes Matomo
   */

  initialize = (history, trackingApproved) => {
    if (server && siteId && typeof window !== 'undefined') {
      /* eslint-disable-next-line no-console */
      matomoEnabled = true;
      const _paq = window._paq || [];
      currentUrl = decodeURIComponent(window.location.href);
      window._paq = _paq;
      /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
      if (!trackingApproved) {
        _paq.push(['disableCookies']);
      }
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      _paq.push(['setTrackerUrl', server + 'piwik.php']);
      _paq.push(['setSiteId', siteId]);
      var d = document,
        g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0];
      g.type = 'text/javascript';
      g.async = true;
      g.defer = true;
      g.onload = () => {
        processDataEventQueue();
      };
      g.src = server + 'piwik.js';

      s.parentNode.insertBefore(g, s);

      observeDom();
      connectHistory(history);
    }
  };

  setUserStatus = authenticated => {
    if (matomoEnabled) {
      window._paq.push([
        'setCustomVariable',
        1,
        'userStatus',
        authenticated ? 'AUTHENTICATED' : 'ANONYMOUS',
        'visit'
      ]);
    }
  };
  setBranchKey = branchKey => {
    if (matomoEnabled) {
      window._paq.push([
        'setCustomVariable',
        1,
        'branchKey',
        branchKey,
        'visit'
      ]);
    }
  };

  trackEvent = (category, action, name, numericValue) => {
    if (matomoEnabled) {
      window._paq.push(['trackEvent', category, action, name, numericValue]);
    }
  };

  /*
   * The event will go into a dedicated matomo site
   */
  trackDataEvent = (action, data) => {
    if (matomoEnabled && dataSiteId) {
      dataEventQueue.push({action, data});
      processDataEventQueue();
    }
  };

  const processDataEventQueue = () => {
    if (!window.Piwik) {
      // piwik.js has not loaded yet
      return;
    }
    if (!dataTracker) {
      dataTracker = window.Piwik.getTracker();
      dataTracker.setSiteId(dataSiteId);
    }
    const copy = [...dataEventQueue];
    dataEventQueue = [];
    copy.forEach(entry => {
      dataTracker.trackEvent(
        'data',
        entry.action,
        JSON.stringify({...entry.data, aid})
      );
    });
  };

  /*
   * Create history listener, used for single page application tracking
   * https://developer.matomo.org/guides/spa-tracking
   */
  const connectHistory = history => {
    history.listen(() => {
      const _paq = window._paq;
      _paq.push(['setReferrerUrl', currentUrl]);
      currentUrl = decodeURIComponent(window.location.href);
      _paq.push(['setCustomUrl', currentUrl]);
      // window._paq.push(['setDocumentTitle', 'My New Title']);

      // remove all previously assigned custom variables, requires Matomo (formerly Piwik) 3.0.2
      _paq.push(['deleteCustomVariables', 'page']);
      _paq.push(['setGenerationTimeMs', 0]);
      _paq.push(['trackPageView']);
    });
  };

  /*
   * Sets up a DOM observer which will make Matomo scan asynchronously
   * loaded content for external links etc.
   * https://developer.matomo.org/guides/spa-tracking#making-matomo-aware-of-new-content
   */
  const observeDom = () => {
    const targetNode = document.getElementById('root');
    const observer = new MutationObserver(
      debounce(
        () => {
          window._paq.push(['MediaAnalytics::scanForMedia']);
          window._paq.push(['FormAnalytics::scanForForms']);
          window._paq.push(['trackContentImpressionsWithinNode']);
          window._paq.push(['enableLinkTracking']);
        },
        500,
        {
          trailing: true
        }
      )
    );
    observer.observe(targetNode, {
      attributes: true,
      childList: true,
      subtree: true
    });
  };
}

export {initialize, setUserStatus, setBranchKey, trackEvent, trackDataEvent};
