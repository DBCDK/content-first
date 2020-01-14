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

  it('creates a tag, clicks it to make it a must-have tag', function() {
    const searchWord1 = 'lang';

    cy.visit('/');
    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord1);

    cy.wait(1000);

    cy.get('[data-cy=suggestion-element]')
      .contains('Lang')
      .first()
      .click();
    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > [data-cy] > :nth-child(1) > span'
    ).click();
    cy.wait(500);
    cy.get(
      ':nth-child(2) > [data-cy=workcard-0] > .work-card__content > [data-cy=book-cover-loaded] > .hover-details-fade'
    ).click();
    cy.get('[data-cy=pages-count]')
      .invoke('text')
      .then(value => {
        expect(value).to.be.greaterThan(350);
      });
  });
  it('creates 4 tags, clicks them to get an assorted selection', function() {
    const searchWord2 = 'kort';
    const searchWord3 = 'mysterier';
    const searchWord4 = 'slang';
    const searchWord5 = 'familien';
    //kort minus
    cy.visit('/');
    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord2);

    cy.wait(1000);

    cy.get('[data-cy=suggestion-element]')
      .contains('Kort')
      .first()
      .click();
    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > [data-cy] > :nth-child(1) > span'
    );

    //mysterien
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord3);

    cy.wait(1000);

    cy.get('[data-cy=suggestion-element]')
      .contains('mysterier')
      .first()
      .click();
    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > :nth-child(2) > :nth-child(1) > span'
    )
      .click()
      .click();

    //slang
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord4);

    cy.wait(1000);

    cy.get('[data-cy=suggestion-element]')
      .contains('slang')
      .first()
      .click();
    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > :nth-child(3) > :nth-child(1) > span'
    ).click();

    //familien
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord5);

    cy.wait(1000);

    cy.get('[data-cy=suggestion-element]')
      .contains('familien')
      .first()
      .click();
    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > :nth-child(4) > :nth-child(1) > span'
    )
      .click()
      .click();

    cy.get(
      ':nth-child(1) > [data-cy=workcard-0] > .work-card__content > [data-cy=book-cover-loaded] > .hover-details-fade'
    ).click();

    cy.get(
      '.work-preview__prio-tags > :nth-child(8) > [data-cy=tag-vred] > span'
    )
      .invoke('text')
      .then(value => {
        expect({name: value}).to.eql({name: 'vred'});
      });
  });
});
