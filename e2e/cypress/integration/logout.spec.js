describe('Logout test', function() {
  it.only('Can start to login and cancel', function() {
    const userName = 'testUser' + Math.floor(Math.random() * 1000);
    cy.cprlogin(userName, '1');
    cy.visit('/');
    cy.get('[data-cy=user-form-over13]');
    cy.get('[data-cy=profile-cancel-btn]').click();
    cy.get('[data-cy=topbar-login-btn] > span').contains('Log ind');
  });
});
