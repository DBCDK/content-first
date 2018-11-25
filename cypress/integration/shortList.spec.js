describe('Test shortlist', function() {
  it('Add to shortlist', function() {
    cy.clearSessionStorage();
    cy.visit('/');
    cy.scrollTo(0, 400);
    cy.get('[data-cy=workcard0]').within(el => {
      cy.get('[data-cy=bookmarkBtn]').click();
    });
    cy.get('[data-cy=workcard-title0]')
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
