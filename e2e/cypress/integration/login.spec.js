describe('Login test', function() {
  beforeEach(function() {
    cy.initStorage();
    cy.clearClientStorage();
    cy.clearCookies();
  });

  it('Can log in with name from CPR data and knows you are OVER 13 year old', function() {
    const userName = 'testUser' + Math.floor(Math.random() * 1000);
    cy.cprlogin(userName, '1');
    cy.visit('/');
    cy.get('[data-cy=user-form-over13]');
  });

  it('Shows login when UNDER 13 year old', function() {
    const userName = 'testUser' + Math.floor(Math.random() * 1000);
    cy.cprlogin(userName, '0');
    cy.visit('/');
    cy.get('[data-cy=user-form-under13]');
  });

  it('Can edit a profile', function() {
    const userName = 'testUser' + Math.floor(Math.random() * 1000);
    const userNameEdited = userName + 'edited';
    cy.createUser(userName);
    cy.visit('/profil/rediger');
    cy.get('[data-cy=user-form-name]')
      .clear()
      .type(userNameEdited);
    cy.get('[data-cy=user-form-submit]').click();
    cy.wait(1000);
    cy.visit('/profil/rediger');
    cy.get('[data-cy=user-form-name]').should('have.value', userNameEdited);
  });

  it('Can undo edit of profile', function() {
    const userName = 'testUser' + Math.floor(Math.random() * 1000);
    const userNameEdited = userName + 'edited';
    cy.createUser(userName);
    cy.visit('/profil/rediger');
    cy.get('[data-cy=user-form-name]')
      .clear()
      .type(userNameEdited);
    cy.get('[data-cy=user-form-cancel]').click();
    cy.visit('/profil/rediger');
    cy.get('[data-cy=user-form-name]').should('have.value', userName);
  });

  it.skip('Can login through Adgangsplatformen', function() {
    cy.visit('/v1/auth/login');

    cy.get('[data-cy=libraryname-input]:visible').type('Ishø');
    cy.get('[data-cy=dropdown-container]').within($dropdown => {
      cy.get('li:visible')
        .contains('Ishøj')
        .click();
    });
    cy.get('[data-cy=userid-input]:visible').type('7183532906');
    cy.get('[data-cy=pin-input]:visible').type('2635');
    cy.get('[data-cy=borchk-submit]:visible').click();
    cy.url().should('include', 'localhost');
  });
});
