describe('Test shortlist', function() {
  it('Add element to shortlist', function() {
    cy.clearClientStorage();
    cy.visit('/');
    cy.scrollTo(0, 400);
    cy.wait(1000);

    cy.get('[data-cy=workcard]')
      .first()
      .within(el => {
        cy.get('[data-cy=bookmarkBtn]').click();
      });
    cy.get('[data-cy=workcard-title]')
      .first()
      .invoke('text')
      .then(workTitle => {
        cy.get('[data-cy=topbar-shortlist]').click();
        cy.get('[data-cy=shortlist-element-title]').should(
          'have.text',
          workTitle
        );
      });
  });
});
