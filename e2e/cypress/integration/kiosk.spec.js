const initSearchTest = holdings => {
  cy.fixture('kiosk/initialStateKioskEnabledWithClientId.json').as(
    'initialState'
  );
  cy.fixture('kiosk/kioskConfiguration.json').as('kioskConfiguration');
  cy.fixture('kiosk/searchStephenKingResponse.json').as('stephenKingResponse');
  cy.server();
  cy.route('GET', '/v1/initial-state', '@initialState');
  cy.route('POST', '/v1/kiosk', '@kioskConfiguration');

  cy.route(
    'GET',
    'http://localhost:3000/v1/searcher?query="Stephen King (f. 1947)"*',
    '@stephenKingResponse'
  );
  cy.route(
    'GET',
    'http://localhost:3000/v1/holdings?pid=870970-basis:50746798&pid=870970-basis:51578031&branch=Hovedbiblioteket&agencyId=710100',
    () => {
      return holdings;
    }
  );
};

describe('kiosk', function() {
  it(`Should redirect to kiosk settings when not configured`, function() {
    cy.fixture('kiosk/initialStateKioskEnabled.json').as('initialState');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState');
    cy.visit('/');
    cy.url().should('include', '/kiosk');
  });

  it(`Should show error when not configured properly`, function() {
    cy.fixture('kiosk/initialStateKioskEnabled.json').as('initialState');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState');
    cy.visit('/kiosk');

    cy.get('[data-cy="kiosk-settings-submit"]').should('be.disabled');
    const clientId = 'some-client-id';
    const clientSecret = 'some-client-secret';
    cy.get('[data-cy="input-client-id"]').type(clientId);
    cy.get('[data-cy="input-client-secret"]').type(clientSecret);
    cy.get('[data-cy="kiosk-settings-submit"]').click();
    cy.get('[data-cy="kiosk-error-msg"]').should('be.visible');
  });

  it(`Should be able to configure and start kiosk mode`, function() {
    cy.fixture('kiosk/initialStateKioskEnabled.json').as('initialState');
    cy.fixture('kiosk/kioskConfiguration.json').as('kioskConfiguration');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState');
    cy.route('POST', '/v1/kiosk', '@kioskConfiguration');
    cy.visit('/kiosk');
    const clientId = 'some-client-id';
    const clientSecret = 'some-client-secret';
    cy.get('[data-cy="input-client-id"]').type(clientId);
    cy.get('[data-cy="input-client-secret"]').type(clientSecret);
    cy.get('[data-cy="kiosk-settings-submit"]').click();
    cy.reload();
    cy.get('[data-cy="input-client-id"]').should('have.value', clientId);
    cy.get('[data-cy="input-client-secret"]').should(
      'have.value',
      clientSecret
    );
    cy.get('[data-cy="kiosk-error-msg"]').should('not.exist');
    cy.get('[data-cy="kiosk-start-btn"]').click();
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/');
    });
  });

  it(`Should hide login button in kiosk mode`, function() {
    cy.fixture('kiosk/initialStateKioskEnabledWithClientId.json').as(
      'initialState'
    );
    cy.fixture('kiosk/kioskConfiguration.json').as('kioskConfiguration');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState');
    cy.route('POST', '/v1/kiosk', '@kioskConfiguration');
    cy.visit('/');
    cy.get('[data-cy="topbar-login-btn"]').should('not.exist');
    cy.url().should('not.include', '/kiosk');
  });

  it(`Should be able to navigate from bottom Navigation`, function() {
    cy.fixture('kiosk/initialStateKioskEnabledWithClientId.json').as(
      'initialState'
    );
    cy.fixture('kiosk/kioskConfiguration.json').as('kioskConfiguration');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState');
    cy.route('POST', '/v1/kiosk', '@kioskConfiguration');
    cy.visit('/');

    cy.get('[data-cy=navActionFind]').click();
    cy.location('pathname').should('eq', '/find');

    cy.get('[data-cy=navActionShort]').click();
    cy.location('pathname').should('eq', '/huskeliste');

    cy.get('[data-cy=navActionHome]').click();
    cy.location('pathname').should('eq', '/');

    // Forward-/back- buttons
    cy.get('[data-cy=navBrowserBack]').click();
    cy.location('pathname').should('eq', '/huskeliste');

    cy.get('[data-cy=navBrowserForward]').click();
    cy.location('pathname').should('eq', '/');
  });

  it(`Should move onShelf books to top of search result`, function() {
    initSearchTest({
      '870970-basis:50746798': [
        {
          onShelf: false,
          type: 'Bog'
        }
      ],
      '870970-basis:51578031': [
        {
          onShelf: true,
          type: 'Bog'
        }
      ]
    });
    cy.visit('/find?tags=Stephen%20King%20(f.%201947)');
    cy.get('[data-cy="workcard-870970-basis:51578031-0"]');
    cy.get('[data-cy="workcard-870970-basis:50746798-1"]');
  });
  it(`Should have order from search result, when no holdings are found`, function() {
    initSearchTest({
      '870970-basis:50746798': [],
      '870970-basis:51578031': []
    });
    cy.visit('/find?tags=Stephen%20King%20(f.%201947)');
    cy.get('[data-cy="workcard-870970-basis:50746798-0"]');
    cy.get('[data-cy="workcard-870970-basis:51578031-1"]');
  });
});
