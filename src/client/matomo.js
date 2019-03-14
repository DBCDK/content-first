import {debounce, get} from 'lodash';

const server = get(window, 'CONFIG.matomo.url');
const siteId = get(window, 'CONFIG.matomo.siteId');
const dataSiteId = get(window, 'CONFIG.matomo.dataSiteId');
const aid = get(window, 'CONFIG.matomo.aid');
let matomoEnabled = false;
let currentUrl;
let dataTracker;
let dataEventQueue = [];

/*
 * Initializes Matomo
 */
export const initialize = history => {
  if (server && siteId && typeof window !== 'undefined') {
    /* eslint-disable-next-line no-console */
    console.log('Matomo enabled');
    matomoEnabled = true;
    const _paq = window._paq || [];
    currentUrl = decodeURIComponent(window.location.href);
    window._paq = _paq;
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
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

export const trackEvent = (category, action, name, numericValue) => {
  if (matomoEnabled) {
    window._paq.push(['trackEvent', category, action, name, numericValue]);
  }
};

/*
 * The event will go into a dedicated matomo site
 */
export const trackDataEvent = (action, data) => {
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
