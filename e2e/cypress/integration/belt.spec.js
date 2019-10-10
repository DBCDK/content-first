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
    cy.visit('/lister/some-list-id');
    cy.wait('@listRequest');
    cy.wait('@listElementRequest');
    cy.get('.Topbar__logo').click();
    cy.get('[data-cy="did-read-belt"]').should('not.exist');
  });
});
