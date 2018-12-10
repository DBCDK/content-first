describe('Login test', function() {
  beforeEach(function() {
    cy.clearClientStorage();
    cy.clearCookies();
  });
  it('Can create a new profile', function() {
    const userName = 'testUser' + Math.floor(Math.random() * 1000);

    cy.login(userName);
    cy.visit('/profile/opret');
    cy.get('[data-cy=user-form-name]').type(userName);
    cy.get('[data-cy=user-form-acceptedAge]').click();
    cy.get('[data-cy=user-form-acceptedTerms]').click();
    cy.get('[data-cy=user-form-submit]').click();
    cy.visit('/profile');

    cy.get('[data-cy=user-form-name]').should('have.text', userName);
  });

  it('Can login through Adgangsplatformen', function() {
    cy.visit('http://localhost:3001/v1/login');

    cy.get('#libraryname-input').type('Ishøj Bibliotek');
    cy.get('.agency:visible')
      .first()
      .click();
    cy.get('#userid-input').type('7183532906');
    cy.get('#pin-input').type('2635');
    cy.get('#borchk-submit').click();

    cy.url().should('include', 'localhost');
  });
});
