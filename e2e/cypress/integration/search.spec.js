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
  it('creates 2 tags, clicks them to get an assorted selection and checks they are formatted correctly', function() {
    const searchWord1 = 'positiv';
    const searchWord2 = 'humor';

    cy.visit('/');
    cy.createUser(null, null, true);
    cy.get('[data-cy=topbar-search-btn]').click();

    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord1);

    waitForSuggestions(searchWord1);

    cy.get('[data-cy=suggestion-element]')
      .contains(searchWord1)
      .first()
      .click();
    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > :nth-child(1) > :nth-child(1) > span'
    )
      .click()
      .click()
      .invoke('attr', 'style')
      .should('contain', 'text-decoration: line-through');

    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord2);

    waitForSuggestions(searchWord2);

    cy.get('[data-cy=suggestion-element]')
      .contains(searchWord2)
      .first()
      .click();
    cy.get(
      '.topbar__search-bar--wrap > #selected-filters-wrap > #selectedFilters > :nth-child(2) > :nth-child(1) > span'
    )
      .click()
      .invoke('attr', 'style')
      .should('contain', 'text-decoration: underline');
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

        expect(Number(value)).to.be.greaterThan(350);
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

  it('Should show and select ebog and lydbog filters at the same time', function() {
    const searchWord1 = 'positiv';

    cy.visit('/');
    cy.createUser(null, null, true);
    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(searchWord1);

    waitForSuggestions(searchWord1);

    cy.get('[data-cy=suggestion-element]')
      .contains(searchWord1)
      .first()
      .click();
    cy.get('#Ebog').click();
    cy.wait(500);

    cy.get('#Ebog').click();
    cy.get('#Lydbog\\ \\(net\\)').click();
    cy.wait(500);

    cy.get('#Ebog').click();
    cy.get('#Ebog').should('have.class', 'filter-selected');
    cy.get('#Lydbog\\ \\(net\\)').should('have.class', 'filter-selected');
  });
});
