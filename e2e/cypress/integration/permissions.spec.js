import OpenplatormMock from '../util/OpenplatformMock';
let openplatformMock = new OpenplatormMock();

// Set this to true if you want to record openplatform responses
const record = false;

describe('Permissions ', function() {
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

  it('Order: If user is not logged-in - propt user with a login modal', function() {
    const pid = '870970-basis:54154313';
    cy.visit('/v%C3%A6rk/' + pid);

    cy.get('[data-cy=order-btn]').click();
    cy.get('.modal-window.login-modal').should('be.visible');
  });

  it('Order: If user is logged-in but dont have premium access - propt user with a premium-required modal', function() {
    cy.createUser();
    const pid = '870970-basis:54154313';
    cy.visit('/v%C3%A6rk/' + pid);

    cy.get('[data-cy=order-btn]').click();
    cy.get('.modal-window.premium-modal').should('be.visible');
  });

  it('Order: If user is logged-in and has premium access - promp user with a order modal', function() {
    cy.createUser(null, null, true);
    const pid = '870970-basis:54154313';
    cy.visit('/v%C3%A6rk/' + pid);

    cy.get('[data-cy=order-btn]').click();
    cy.get('.modal-window.order-modal').should('be.visible');
  });
});
