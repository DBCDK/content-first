describe('Order ', function() {
  beforeEach(function() {
    cy.initStorage();
    cy.clearClientStorage();
    cy.clearCookies();
    cy.createUser();
    cy.wait(1000);
  });

  it('Can order a work', function() {
    const pid = '870970-basis:54154313';

    cy.visitWithOpenPlatformMocks('/værk/' + pid, {
      order: () => {
        return {};
      }
    });
    cy.get('[data-cy=order-btn]').click();
    cy.fixture('orderActions').then(actions => {
      cy.dispatch(actions.pickupBranches);
      cy.get('[data-cy=modal-done-btn]').click();
      cy.get('[data-cy=order-status]').should('have.text', '1 bog er bestilt');
    });
  });
});
