describe('Logout from a variety of places', function() {
  it('Can start to login and cancel', function() {
    const userName = 'testUser' + Math.floor(Math.random() * 1000);
    cy.cprlogin(userName, '1');
    cy.wait(1000);
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-cy=user-form-over13]');
    cy.get('[data-cy=profile-cancel-btn]').click();
    cy.get('[data-cy=topbar-login-btn] > span').contains('Log ind');
  });

  it('Logout from profile dropdown', function() {
    const userName = 'testUser' + Math.floor(Math.random() * 1000);
    cy.cprlogin(userName, '1');
    cy.wait(1000);
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-cy=user-form-over13]');
    cy.get('[data-cy=user-form-submit]').click();
    cy.get('[data-cy=topbar-logged-in-btn]').click();
    cy.get('[data-cy=logout-btn]').click();
    cy.get('[data-cy=topbar-login-btn] > span').contains('Log ind');
  });

  it('Can delete profile from profile page', function() {
    const userName = 'testUser' + Math.floor(Math.random() * 1000);
    cy.cprlogin(userName, '1');
    cy.wait(1000);
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-cy=user-form-over13]');
    cy.get('[data-cy=user-form-submit]').click();
    cy.get('[data-cy=topbar-logged-in-btn]').click();
    cy.get('[data-cy=profile-btn] > span').click();
    cy.get('[data-cy=delete-profile] > a').click();
    cy.get('[data-cy=modal-done-btn] > [data-cy]').click();
    cy.get('[data-cy=topbar-login-btn] > span').contains('Log ind');
  });
});
