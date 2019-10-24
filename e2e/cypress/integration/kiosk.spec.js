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
    cy.url().should('eq', 'http://localhost:3000/');
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
});
