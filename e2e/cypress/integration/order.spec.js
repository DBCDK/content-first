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

  it('Order available books', function() {
    cy.fixture('/order/shortlist.json').as('shortlist');
    cy.server();
    cy.route('GET', '/v1/shortlist', '@shortlist').as('shortlistRequest');
    cy.visit('/huskeliste');
    cy.get('.orderAllBtn').click();
    cy.contains('Kan ikke bestilles til dit bibliotek');
    cy.contains('Kan bestilles');
    cy.get('[data-cy=modal-done-btn]').click();
    cy.get('[data-cy=order-status]').should('have.text', '1 bog er bestilt');
  });

  it('Fails gracefully when no pickup libraries are available', function() {
    const pid = '870970-basis:54154313';
    cy.visit('/v%C3%A6rk/' + pid);
    cy.get('[data-cy=order-btn]').click();
    cy.contains('Kan ikke bestilles til dit bibliotek');
    cy.contains('er bestilt').should('not.exist');
  });

  it('Shows notification modal when agency is unsupported', function() {
    cy.fixture('/order/initialState_unsupportedMunicipality.json').as(
      'initialState'
    );
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState');
    const pid = '870970-basis:54154313';
    cy.visit('/v%C3%A6rk/' + pid);
    cy.get('[data-cy=order-btn]').click();
    cy.contains('Bestilling kan ikke gennemføres');
  });
});
