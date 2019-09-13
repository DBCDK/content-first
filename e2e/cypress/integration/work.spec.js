import OpenplatormMock from '../util/OpenplatformMock';
let openplatformMock = new OpenplatormMock();

const record = false;

describe('work', function() {
  beforeEach(function() {
    openplatformMock.init({
      record,
      cy
    });
  });

  afterEach(function() {
    openplatformMock.done();
  });

  it(`Should test Tab functionality`, function() {
    const pid = '870970-basis:53410405';
    cy.visit('/v%C3%A6rk/' + pid);
    cy.get('[data-cy=WorkPage__reviews]').scrollIntoView();
    cy.get('[data-cy=WorkPage__reviews]').should('be.visible');
  });

  it(`Should test 'Læseoplevelse' tab`, function() {
    const pid = '870970-basis:53410405';
    cy.visit('/v%C3%A6rk/' + pid);
    cy.get('[data-cy=Læseoplevelse]').click();
    cy.get('[data-cy=tabs-page-Læseoplevelse]').should('be.visible');
    cy.get('[data-cy=Læseoplevelse]').should(
      'have.class',
      'Tabs__pagination-bullet-active'
    );
  });

  it(`Should test 'Anmeldelser' tab`, function() {
    const pid = '870970-basis:53410405';
    cy.visit('/v%C3%A6rk/' + pid);
    cy.get('[data-cy=Anmeldelser]').click();
    cy.get('[data-cy=tabs-page-Anmeldelser]').should('be.visible');
    cy.get('[data-cy=Anmeldelser]').should(
      'have.class',
      'Tabs__pagination-bullet-active'
    );
  });

  it(`Should test 'Se hele Læseoplevelsen' button`, function() {
    const pid = '870970-basis:53410405';
    cy.visit('/v%C3%A6rk/' + pid);
    cy.get('[data-cy=tags-collaps-toggle]').click();
    cy.get('[data-cy=tabs-page-Læseoplevelse]').should('be.visible');

    cy.get('[data-cy=Læseoplevelse]').should(
      'have.class',
      'Tabs__pagination-bullet-active'
    );
  });

  it(`Should test expand button`, function() {
    const pid = '870970-basis:54127774';
    cy.visit('/v%C3%A6rk/' + pid);

    cy.get('[data-cy=WorkPage__reviews]').then($container => {
      const heightBefore = $container.height();
      cy.get('[data-cy=expand-button]').click();
      cy.get('[data-cy=WorkPage__reviews]').then($container => {
        const heightAfter = $container.height();
        expect(heightAfter).to.be.greaterThan(heightBefore);
      });
    });
  });
});
