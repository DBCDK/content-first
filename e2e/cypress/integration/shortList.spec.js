describe('Test shortlist', function() {
  beforeEach(function() {
    cy.clearClientStorage();
    cy.clearCookies();
    cy.wait(1000);
  });

  const mockInitialState = () => {
    cy.fixture('beltEditor/initialState.json').as('initialState');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState').as(
      'initialStateRequest'
    );
  };

  it('Add element to shortlist', function() {
    mockInitialState();

    cy.visit('/');
    cy.get('[data-cy=workcard]')
      .first()
      .within(() => {
        cy.get('[data-cy=bookmarkBtn]').click();
        return cy.get('[data-cy=workcard-title]');
      })
      .invoke('text')
      .then(workTitle => {
        cy.get('[data-cy=topbar-shortlist]').click();
        cy.get('[data-cy=shortlist-element-title]')
          .invoke('text')
          .then(title => {
            expect(workTitle).to.contain(title.replace('...', ''));
          });
      });
  });
});
