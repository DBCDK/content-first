import OpenplatormMock from '../util/OpenplatformMock';
let openplatformMock = new OpenplatormMock();

// Set this to true if you want to record openplatform responses
const record = false;

describe('Order ', function() {
  beforeEach(function() {
    openplatformMock.init({
      record,
      cy
    });
    cy.clearClientStorage();
    cy.createUser(null, null, true);
  });

  afterEach(function() {
    openplatformMock.done();
  });

  it('Can order a work', function() {
    const pid = '870970-basis:54154313';
    cy.visit('/v%C3%A6rk/' + pid);

    cy.get('[data-cy=order-btn]').click();
    cy.contains('Kan bestilles');
    cy.get('[data-cy=modal-done-btn]').click();
    cy.get('[data-cy=order-status]').should('have.text', '1 bog er bestilt');
  });

  it('Order button disabled while loading user', function() {
    const pid = '870970-basis:54154313';
    cy.visit('/v%C3%A6rk/' + pid);
    cy.get('[data-cy=order-btn]').click();

    // ensure availability is loaded
    cy.contains('Kan bestilles');

    cy.get('[data-cy=modal-done-btn] > button').should('be.disabled');
  });

  it('Order button disabled while loading availability', function() {
    const pid = '870970-basis:54154313';
    cy.visit('/v%C3%A6rk/' + pid);
    cy.get('[data-cy=order-btn]').click();

    // ensure pickup branches are loaded
    // and availability is not loaded
    cy.contains('DBCTestBibliotek');
    cy.contains('Tjekker tilgængelighed');

    cy.get('[data-cy=modal-done-btn] > button').should('be.disabled');
  });
});
