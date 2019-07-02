describe('Test shortlist', function() {
  beforeEach(function() {
    cy.initStorage();
    cy.clearClientStorage();
    cy.clearCookies();
    cy.wait(1000);
  });

  it('Add element to shortlist', function() {
    cy.visit('/');
    cy.get('[data-cy=workcard]')
      .first()
      .within(() => {
        cy.get('[data-cy=bookmarkBtn]').click();
      });
    cy.get('[data-cy=workcard-title]')
      .first()
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
