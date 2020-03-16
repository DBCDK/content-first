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
  });

  afterEach(function() {
    openplatformMock.done();
  });

  it('Can order a work', function() {
    cy.createUser(null, null, true);
    const pid = '870970-basis:54154313';
    cy.visit('/v%C3%A6rk/' + pid);

    cy.get('[data-cy=order-btn]').click();
    cy.contains('Kan bestilles');
    cy.get('[data-cy=modal-done-btn]').click();
    cy.get('[data-cy=order-status]').should('have.text', '1 bog er bestilt');
  });

  it('Can order a work as Faeroe user', function() {
    const user = 'faeroe-user' + Math.floor(Math.random() * 1000);
    cy.createUser(user, null, true);
    const pid = '870970-basis:54154313';

    cy.visit(`/v%C3%A6rk/${pid}`, {
      onBeforeLoad(win) {
        cy.stub(win, 'open').as('windowOpen');
      }
    });

    cy.get('[data-cy=order-btn]').click();

    cy.window()
      .its('open')
      .should('be.called');

    cy.get('@windowOpen').should(
      'be.calledWith',
      'https://www.bbs.fo/fo/search/ting/' + pid
    );
  });

  it('Order button disabled while loading user', function() {
    cy.createUser(null, null, true);
    const pid = '870970-basis:54154313';
    cy.visit('/v%C3%A6rk/' + pid);
    cy.get('[data-cy=order-btn]').click();

    // ensure availability is loaded
    cy.contains('Kan bestilles');

    cy.get('[data-cy=modal-done-btn] > button').should('be.disabled');
  });

  it('Order button disabled while loading availability', function() {
    cy.createUser(null, null, true);
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
    cy.createUser(null, null, true);
    cy.fixture('/order/shortlist.json').as('shortlist');
    cy.server();
    cy.route('GET', '/v1/shortlist', '@shortlist').as('shortlistRequest');
    cy.visit('/huskeliste');
    cy.get('[data-cy=orderAllButton]').click();
    cy.contains('Kan ikke bestilles til dit bibliotek');
    cy.contains('Kan bestilles');
    cy.get('[data-cy=modal-done-btn]').click();
    cy.get('[data-cy=order-status]').should('have.text', '1 bog er bestilt');
  });

  it('fails to "order all" from shortlist page for non-premium user', function() {
    cy.createUser(null, null, false);
    cy.fixture('/order/shortlist.json').as('shortlist');
    cy.server();
    cy.route('GET', '/v1/shortlist', '@shortlist').as('shortlistRequest');
    cy.visit('/huskeliste');
    cy.wait('@shortlistRequest');
    cy.get('[data-cy=orderAllButton]').click();
    cy.contains('Dit bibliotek abonnerer ikke på Læsekompas.dk');
  });

  it('fails to "order all" from shortlist dropdown for non-premium user', function() {
    cy.createUser(null, null, false);
    cy.fixture('/order/shortlist.json').as('shortlist');
    cy.server();
    cy.route('GET', '/v1/shortlist', '@shortlist').as('shortlistRequest');
    cy.visit('/huskeliste');
    cy.wait('@shortlistRequest');
    cy.get('[data-cy=topbar-shortlist]').click();
    cy.get('[data-cy=shortlist-dropdown-order-all').click();
    cy.contains('Dit bibliotek abonnerer ikke på Læsekompas.dk');
  });

  it('Fails gracefully when no pickup libraries are available', function() {
    cy.createUser(null, null, true);
    const pid = '870970-basis:54154313';
    cy.visit('/v%C3%A6rk/' + pid);
    cy.get('[data-cy=order-btn]').click();
    cy.contains('Kan ikke bestilles til dit bibliotek');
    cy.contains('er bestilt').should('not.exist');
  });
});
