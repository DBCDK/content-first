const assertLoggedIn = (loggedIn = true) =>
  loggedIn
    ? cy.get('[data-cy=topbar-login-btn]>span').should('not.contain', 'Log ind')
    : cy.get('[data-cy=topbar-login-btn]>span').should('contain', 'Log ind');

describe('Logout Endpoint', function() {
  it('Assert logged out', function() {
    cy.visit('/');
    assertLoggedIn(false);
  });

  it('Test logout success', function() {
    cy.visit('/');
    const userName = 'testUser' + Math.floor(Math.random() * 1000);
    cy.createUser(userName);
    assertLoggedIn(true);
    cy.request('GET', '/v1/logout');
    cy.visit('/');
    assertLoggedIn(false);
  });

  it('Test endpoint response data', function() {
    cy.visit('/');
    cy.createUser('userName');
    cy.request('GET', '/v1/logout').then(response => {
      expect(response.headers['x-frame-options']).to.equal(
        'ALLOW-FROM https://login.bib.dk/'
      );
      expect(response.body.statusCode).to.equal(200);
    });
  });
});
