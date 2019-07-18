describe('Search test', function() {
  it('Shows one suggestion when search word matches several titles', function() {
    const searchWord = 'Min kam';
    cy.visit('/');
    cy.get('[data-cy=topbar-search-btn]').click();

    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord);
    cy.get('[data-cy=suggestion-element]').contains(searchWord);
    cy.get('[data-cy=cat-name]')
      .contains('bog')
      .click();
    cy.get('.WorkCard')
      .not('.invisible')
      .its('length')
      .should('gt', 1);
  });
});
