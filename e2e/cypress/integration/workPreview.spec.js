describe('Work Preview', function() {
  const assertWorkPreviewVisible = visible => {
    cy.get('[data-cy=close-work-preview-button]').should(
      visible ? 'exist' : 'not.exist'
    );
  };
  const clickFirstWorkCard = () => {
    cy.get('[data-cy=workcard]')
      .eq(0)
      .click();
  };
  const clickExpandWorkPreview = () => {
    cy.get('[data-cy=expand-work-preview]')
      .eq(0)
      .click();
  };
  const clickCloseButtonOnWorkPreview = () => {
    cy.get('[data-cy=close-work-preview-button]').click();
  };

  // ---------------------------------------------------------------------------------------------------------------

  it(`Test that there is a 'Close' button, and it is functional`, function() {
    cy.visit('/');
    assertWorkPreviewVisible(false);
    clickFirstWorkCard();
    assertWorkPreviewVisible(true);
    clickCloseButtonOnWorkPreview();
    assertWorkPreviewVisible(false);
  });

  it(`Test that the Arrow Down icon also works as a close button`, function() {
    cy.visit('/');
    assertWorkPreviewVisible(false);
    clickFirstWorkCard();
    assertWorkPreviewVisible(true);
    clickExpandWorkPreview();
    assertWorkPreviewVisible(false);
  });
});
