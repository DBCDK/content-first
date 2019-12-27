describe('Search test', function() {
  it('Shows one suggestion when search word matches several titles', function() {
    const searchWord = 'Min kamp';
    cy.visit('/');
    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord);

    cy.wait(1000);

    cy.get('[data-cy=suggestion-element]').contains(searchWord);
    cy.get('[data-cy=cat-name]')
      .contains('bog')
      .click();
    cy.get('[data-cy=workcard-title]')
      .first()
      .should('have.text', 'Min kamp');
  });
});
