describe('belt', function() {
  beforeEach(function() {
    cy.clearClientStorage();
    cy.clearCookies();
  });

  it(`Should not use public list from other user as basis for personal belt`, function() {
    cy.createUser('someuser');
    cy.fixture('lists/publiclist.json').as('publiclist');
    cy.fixture('lists/publiclist_element.json').as('publiclist_element');
    cy.server();
    cy.route('GET', '/v1/object/some-list-id', '@publiclist').as('listRequest');
    cy.route('GET', '/v1/object/find**', '@publiclist_element').as(
      'listElementRequest'
    );
    cy.createUser('someotheruser');
    cy.visit('/lister/some-list-id');
    cy.wait('@listRequest');
    cy.wait('@listElementRequest');
    cy.get('.topbar__logo').click();
    cy.get('[data-cy="did-read-belt"]').should('not.exist');
  });

  it(`Should show plus minus tags on tags belt`, function() {
    cy.fixture('belt/initialState_plus_minus.json').as('initialState');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState').as(
      'initialStateRequest'
    );
    cy.visit('/');
    cy.get('[data-cy="tag-poetisk sprog"] button')
      .should('have.css', 'text-decoration') // yields 'sans-serif'
      .and('match', /underline/);

    cy.get('[data-cy="tag-eksperimenterende sprog"] button')
      .should('have.css', 'text-decoration') // yields 'sans-serif'
      .and('match', /line-through/);
  });

  it(`Should redirect to find page with a plus tag`, function() {
    cy.fixture('belt/initialState_plus_minus.json').as('initialState');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState').as(
      'initialStateRequest'
    );
    cy.visit('/');
    cy.get('[data-cy="tag-poetisk sprog"] button').click();
    cy.url().should('include', 'find?tags=5615&plus=5615');
  });

  it(`Should redirect to find page with plus and minus tags when clicking on title`, function() {
    cy.fixture('belt/initialState_plus_minus.json').as('initialState');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState').as(
      'initialStateRequest'
    );
    cy.visit('/');
    cy.get('.belt-tags__title').click();
    cy.url().should('include', 'find?tags=5615,5614&plus=5615&minus=5614');
  });

  it(`Should show message when recompass response is empty`, function() {
    cy.fixture('belt/initialState_plus_minus.json').as('initialState');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState').as(
      'initialStateRequest'
    );
    cy.route('GET', '/v1/recompass*', {
      response: [],
      rid: 'some-rid'
    });
    cy.visit('/');
    cy.contains('Der er endnu ikke nok data');
  });
});
