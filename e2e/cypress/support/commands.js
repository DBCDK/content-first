// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * Dispatches an action
 */
Cypress.Commands.add('dispatch', action => {
  cy.window()
    .its('__store__')
    .then(store => {
      store.dispatch(action);
    });
});

/**
 * Clears session- and localestorage
 */
Cypress.Commands.add('clearClientStorage', () => {
  cy.window().then(win => {
    win.sessionStorage.clear();
  });
  cy.clearLocalStorage();
});

/**
 * Creates a new user and logs in
 */
Cypress.Commands.add('createUser', (userName, role, premium = false) => {
  if (!userName) userName = 'user' + Math.floor(Math.random() * 1000);
  cy.request('/v1/test/delete/' + userName);
  if (role) {
    cy.visit(
      '/v1/test/create/' +
        userName +
        '?' +
        role +
        '=true' +
        '&premium=' +
        premium
    );
  } else {
    cy.visit('/v1/test/create/' + userName + '?premium=' + premium);
  }
  cy.get('[data-cy=topbar-profile-img]');
});

/**
 * Logs in without creating a user
 */
Cypress.Commands.add('login', userName => {
  cy.visit('/v1/test/login/' + userName);
  cy.get('[data-cy=topbar-profile-img]');
});

/**
 * Logs in with a CPR number
 */
Cypress.Commands.add('cprlogin', (userName, overBool) => {
  if (!userName) userName = 'user' + Math.floor(Math.random() * 1000);
  cy.visit('/v1/test/cprlogin/' + userName + '/' + overBool);
  cy.get('[data-cy=topbar-profile-img]');
});

/**
 * Adds 'count' elements to the shortlist
 */
Cypress.Commands.add('addElementsToShortlist', count => {
  cy.fixture('works').then(elements => {
    count = count > elements.length ? elements.length : count;

    const works = elements.slice(0, count);
    works.map(work => {
      cy.dispatch({
        type: 'ON_SHORTLIST_TOGGLE_ELEMENT',
        element: work,
        origin: 'Fra "Familiens skyggesider"'
      });
    });
  });
});

/**
 * Visits an url with added openplatform mocks
 */
Cypress.Commands.add('visitWithOpenPlatformMocks', (url, mocks) => {
  cy.visit(url, {
    onBeforeLoad: window => {
      window.__stubbed_openplatform__ = mocks;
    }
  });
});

/**
 * Visits an url with added matomo mocks
 */
Cypress.Commands.add('visitWithMatomoMocks', (url, matomo) => {
  cy.visit(url, {
    onBeforeLoad: window => {
      window.__stubbed_matomo__ = {
        initialize: matomo.initialize ? matomo.initialize : () => {},
        setUserStatus: matomo.setUserStatus ? matomo.setUserStatus : () => {},
        trackEvent: matomo.trackEvent ? matomo.trackEvent : () => {},
        trackDataEvent: matomo.trackDataEvent ? matomo.trackDataEvent : () => {}
      };
    }
  });
});

/**
 * Runs in kiosk mode
 */
Cypress.Commands.add('setKioskMode', () => {
  cy.viewport(1080, 1920);
  cy.fixture('kiosk/initialStateKioskEnabledWithClientId.json').as(
    'initialState'
  );
  cy.fixture('kiosk/kioskConfiguration.json').as('kioskConfiguration');
  cy.server();
  cy.route('GET', '/v1/initial-state', '@initialState');
  cy.route('POST', '/v1/kiosk', '@kioskConfiguration');
  cy.visit('/kiosk?kiosk=some-key');
});

/**
 * Mocks recompass response
 */
Cypress.Commands.add('mockRecompass', () => {
  cy.server();
  cy.fixture('recompass/simple.json').as('recompassResponse');
  cy.route('GET', '/v1/recompass*', '@recompassResponse');
});
