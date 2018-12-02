describe('Order ', function() {
  beforeEach(function() {
    cy.clearClientStorage();
    cy.clearCookies();
    cy.createUser();
    cy.wait(1000);
  });
  it('Can order a work', function() {
    const pid = '870970-basis:54154313';

    cy.visit('/værk/' + pid);
    // cy.fetchAvability(pid);
    cy.wait(3000);

    //cy.get('[data-cy=order-btn]').click()
  });
});
