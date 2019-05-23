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

    cy.visit('/værk/' + pid);
    cy.get('[data-cy=order-btn]').click();
    cy.fixture('orderActions').then(actions => {
      cy.dispatch(actions.picupBranches);
      cy.get('[data-cy=modal-done-btn]').click();
      cy.dispatch({type: 'ORDER_SUCCESS', pid: pid});

      cy.get('[data-cy=order-status]').should(
        'have.text',
        ' 1 bog er bestilt.'
      );
    });
  });
});
