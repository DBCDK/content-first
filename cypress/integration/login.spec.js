describe('Login test', function() {
  before(function() {
    // cy.resetDB();
  });

  beforeEach(function() {
    cy.clearSessionStorage();
    cy.clearLocalStorage();
    //cy.clearCookies()
  });

  it('User can login', function() {
    cy.visit('http://localhost:3001/v1/login');
    //  cy.contains('Log ind').click()
    //   cy.get('[data-cy=topbar-login-btn]').click()
    cy.pause();

    cy.get('#libraryname-input').type('Ishøj Bibliotek');
    cy.get('.agency:visible')
      .first()
      .click();
    // cy.contains('Ishøj Bibliotek').click();
    cy.get('#userid-input').type('7183532906');
    cy.get('#pin-input').type('2635');
    // cy.get('[data-name=Ishøj Bibliotek]').click()
    cy.get('#borchk-submit').click();

    //check if success
  });
  it('Can create a new profile', function() {
    /*const userName = 'testUser47';

    cy.login(userName);
    cy.request('http://localhost:3002/v1/test/login/' + userName);
    cy.visit('/profile/opret');
    cy.get('[data-cy=user-form-name]').type(userName);
    cy.get('[data-cy=user-form-acceptedAge]').click();
    cy.get('[data-cy=user-form-acceptedTerms]').click();
    cy.get('[data-cy=user-form-submit]').click();
    cy.visit('/profile');
    cy.get('[data-cy=user-form-name]').should('have.text', userName);*/
  });
});
