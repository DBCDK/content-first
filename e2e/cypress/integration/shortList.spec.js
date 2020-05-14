describe('Test shortlist', function() {
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

  it('Order-all button is hidden for faeror users', function() {
    const user = 'faeroe-user' + Math.floor(Math.random() * 1000);
    cy.createUser(user, null, true);

    cy.visit('/');
    cy.get('[data-cy=workcard]')
      .first()
      .within(() => {
        cy.get('[data-cy=bookmarkBtn]').click();
      });

    cy.visit('/huskeliste');

    cy.get('[data-cy=orderAllButton]').should('not.be.visible');
  });
});
