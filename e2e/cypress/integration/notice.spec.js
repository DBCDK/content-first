describe('Notice', function() {
  it(`Should show notice`, function() {
    cy.setSessionStorage({key: 'haveReadNotice', value: 0, version: 1});
    cy.visit('/');
    cy.get('[data-cy=modal-content]')
      .should('contain', 'Bibliotekerne åbner for udlån')
      .should(
        'contain',
        'De fleste biblioteker har igen åbent for lån af bøger'
      );
  });

  it.only(`Should only show notice once`, function() {
    cy.setSessionStorage({key: 'haveReadNotice', value: 0, version: 1});
    cy.visit('/');

    cy.get('[data-cy=modal-content]').should('exist');
    cy.get('[data-cy=modal-done-btn]').click();
    cy.get('[data-cy=modal-content]').should('not.exist');

    cy.visit('/');
    cy.get('[data-cy=modal-content]').should('not.exist');
  });
});
