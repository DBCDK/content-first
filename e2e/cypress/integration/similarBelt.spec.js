describe('Similar Belt', function() {
  const assertWorkPreviewVisible = visible => {
    cy.get('[data-cy=close-work-preview-button]').should(
      visible ? 'exist' : 'not.exist'
    );
  };
  const assertSimilarBeltVisible = visible => {
    cy.get('[data-cy=close-similar-belt-button]').should(
      visible ? 'exist' : 'not.exist'
    );
  };
  const clickFirstWorkCard = () => {
    cy.get('[data-cy=workcard]')
      .eq(0)
      .click();
  };
  const clickMoreLikeThisOnWorkCard = () => {
    cy.get('[data-cy=WC-more-like-this]')
      .eq(0)
      .click();
  };
  const clickMoreLikeThisOnPreview = () => {
    cy.get('[data-cy=work-preview] [data-cy=RO-more-like-this]')
      .eq(0)
      .click();
  };
  const clickCloseButtonOnSimilarBelt = () => {
    cy.get('[data-cy=close-similar-belt-button]').click();
  };
  const clickArrowDownKeyOnWorkCard = () => {
    cy.get('[data-cy=workcard] .expand-more-wrapper')
      .eq(0)
      .click();
  };
  const clickArrowDownKeyOnWorkPreview = () => {
    cy.get('.work-preview__arrow')
      .eq(0)
      .click();
  };

  // ---------------------------------------------------------------------------------------------------------------

  it(`'Similar Belt' button on Belt: Test that there is a 'Close' button, and it is functional`, function() {
    cy.visit('/');
    assertWorkPreviewVisible(false);
    assertSimilarBeltVisible(false);
    clickMoreLikeThisOnWorkCard();
    assertWorkPreviewVisible(false);
    assertSimilarBeltVisible(true);
    clickCloseButtonOnSimilarBelt();
    assertWorkPreviewVisible(false);
    assertSimilarBeltVisible(false);
  });

  it(`'Similar Belt' button on Belt: Test that the Arrow Down icon also works as a close button`, function() {
    cy.visit('/');
    assertWorkPreviewVisible(false);
    assertSimilarBeltVisible(false);
    clickMoreLikeThisOnWorkCard();
    assertWorkPreviewVisible(false);
    assertSimilarBeltVisible(true);
    clickArrowDownKeyOnWorkCard();
    assertWorkPreviewVisible(true);
    assertSimilarBeltVisible(false);
  });

  it(`'Similar Belt' button on Preview: Test that there is a 'Close' button, and it is functional`, function() {
    cy.visit('/');
    assertWorkPreviewVisible(false);
    assertSimilarBeltVisible(false);
    clickFirstWorkCard();
    clickMoreLikeThisOnPreview();
    assertWorkPreviewVisible(true);
    assertSimilarBeltVisible(true);
    clickCloseButtonOnSimilarBelt();
    assertWorkPreviewVisible(true);
    assertSimilarBeltVisible(false);
  });

  it(`'Similar Belt' button on Preview: Test that the Arrow Down icon also works as a close button`, function() {
    cy.visit('/');
    assertWorkPreviewVisible(false);
    assertSimilarBeltVisible(false);
    clickFirstWorkCard();
    clickMoreLikeThisOnPreview();
    assertWorkPreviewVisible(true);
    assertSimilarBeltVisible(true);
    clickArrowDownKeyOnWorkPreview();
    assertWorkPreviewVisible(true);
    assertSimilarBeltVisible(false);
  });
});
