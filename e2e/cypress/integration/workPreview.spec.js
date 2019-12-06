describe('Work Preview', function() {
  it(`Test that there is a 'Close' button, and it is functional`, function() {
    cy.visit('/');
    cy.get('[data-cy=workcard]')
      .eq(0)
      .click();
    cy.get('[data-cy=close-work-preview-button]').should('exist');
    cy.get('[data-cy=close-work-preview-button]').click();
    cy.get('[data-cy=close-work-preview-button]').should('not.exist');
  });

  it(`Test that the Arrow Down icon also works as a close button`, function() {
    cy.visit('/');
    cy.get('[data-cy=workcard]')
      .eq(0)
      .click();
    cy.get('[data-cy=expand-work-preview]')
      .eq(0)
      .click();
    cy.get('[data-cy=close-work-preview-button]').should('not.exist');
  });
});
