const waitForSuggestions = query => {
  return cy.get(
    `.query-${query.replace(/ /g, '-')} [data-cy=suggestion-element]`
  );
};

describe('Search test', function() {
  it('Shows one suggestion when search word matches several titles', function() {
    const searchWord = 'Min kamp';
    cy.visit('/');
    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord);

    waitForSuggestions(searchWord);

    cy.get('[data-cy=suggestion-element]').contains(searchWord);
    cy.get('[data-cy=cat-name]')
      .contains('bog')
      .click();
    cy.get('[data-cy=workcard-title]')
      .first()
      .should('have.text', 'Min kamp');
  });
  it('creates 4 tags, clicks them to get an assorted selection and checks they are formatted correctly', function() {
    const searchWord2 = 'kort';
    const searchWord3 = 'krævende sprog';
    const searchWord4 = 'humor';
    const searchWord5 = 'familien';
    //kort minus
    cy.visit('/');
    cy.createUser(null, null, true);
    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord2);

    waitForSuggestions(searchWord2);

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

    waitForSuggestions(searchWord3);

    cy.get('[data-cy=suggestion-element]')
      .contains(searchWord3)
      .first()
      .click();
    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > :nth-child(2) > :nth-child(1) > span'
    )
      .click()
      .click()
      .invoke('attr', 'style')
      .should('contain', 'text-decoration: line-through');

    //humor
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord4);

    waitForSuggestions(searchWord4);

    cy.get('[data-cy=suggestion-element]')
      .contains(searchWord4)
      .first()
      .click();
    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > :nth-child(3) > :nth-child(1) > span'
    )
      .click()
      .invoke('attr', 'style')
      .should('contain', 'text-decoration: underline');

    //familien
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord5);

    waitForSuggestions(searchWord5);

    cy.get('[data-cy=suggestion-element]')
      .contains(searchWord5)
      .first()
      .click();
    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > :nth-child(4) > :nth-child(1) > span'
    )
      .click()
      .invoke('attr', 'style')
      .should('contain', 'text-decoration: underline');

    cy.get(
      ':nth-child(1) > [data-cy=workcard-0] > .work-card__content > [data-cy=book-cover-loaded] > .hover-details-fade'
    ).click();

    cy.get('.work-preview__title > [data-cy]')
      .invoke('text')
      .then(value => {
        assert.isNotNull(value, 'is not null');
      });
  });
  it('creates a tag *lang* , then chooses the first book in the list and confirms that it is a long book', function() {
    const searchWord1 = 'lang';

    cy.visit('/');
    cy.createUser(null, null, true);
    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord1);

    waitForSuggestions(searchWord1);

    cy.get('[data-cy=suggestion-element]')
      .contains('Lang')
      .first()
      .click();
    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > [data-cy] > :nth-child(1) > span'
    )
      .click()
      .invoke('attr', 'style')
      .should('contain', 'text-decoration: underline');
    cy.wait(500);
    cy.get(
      ':nth-child(1) > [data-cy=workcard-1] > .work-card__content > [data-cy=book-cover-loaded] > .hover-details-fade'
    ).click();
    cy.get('[data-cy=pages-count]')
      .invoke('text')
      .then(value => {
        if (value === '') {
          return;
        }
        expect(value).to.be.greaterThan(350);
      });
  });
  it('chooses a range and another tag. clicking other tag does not effect the range', function() {
    const searchWord2 = 'lang';

    cy.visit('/');
    cy.createUser(null, null, true);

    //choose range
    cy.visit('/find?tags=5631:5633');

    // choose lang tag
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord2);
    waitForSuggestions(searchWord2);
    cy.get('[data-cy=suggestion-element]')
      .contains('Lang')
      .first()
      .click();
    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > :nth-child(2) > :nth-child(1) > span'
    )
      .click()
      .click();

    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > :nth-child(1) > :nth-child(1) > span'
    )
      .invoke('text')
      .should('contain', 'fremadskridende - hæsblæsende');
  });
});
