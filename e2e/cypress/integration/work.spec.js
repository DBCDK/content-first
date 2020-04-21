import OpenplatormMock from '../util/OpenplatformMock';
let openplatformMock = new OpenplatormMock();

const record = false;

describe('Work Page', function() {
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
    cy.get('[data-cy=work-preview-tabs]').scrollIntoView();
    cy.get('[data-cy=work-preview-tabs]').should('be.visible');
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

  it(`Should show no review message`, function() {
    const pid = '870970-basis:47346177';
    cy.visit('/v%C3%A6rk/' + pid);
    cy.get('[data-cy=Anmeldelser]').click();
    cy.contains('Vi har ikke nogen anmeldelser af bogen');
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

  it.skip(`Should test expand button`, function() {
    const pid = '870970-basis:54127774';
    cy.visit('/v%C3%A6rk/' + pid);

    cy.get('[data-cy=tabs-page-Anmeldelser]').then($container => {
      const heightBefore = $container.height();
      cy.get('[data-cy=expand-button]').click();
      cy.get('[data-cy=tabs-page-Anmeldelser]').then($container => {
        const heightAfter = $container.height();
        expect(heightAfter).to.be.greaterThan(heightBefore);
      });
    });
  });

  it(`Should test that there is no 'Close' button`, function() {
    const pid = '870970-basis:53410405';
    cy.visit('/v%C3%A6rk/' + pid);
    cy.get('[data-cy=close-work-preview-button]').should('not.exist');
  });

  describe('Series', function() {
    it(`Simple series`, function() {
      cy.visit('/værk/870970-basis:28249799');

      // check belt is there
      cy.contains('i samme serie');

      // simple series should not have bind info
      cy.get('[data-cy=title-bind-info]').should('not.exist');

      // wait for belt to be loaded
      cy.contains('1. del - Graffitimordene');

      // check the order
      cy.get('[data-cy=seriesBelt] .work-card__tax-description')
        .children()
        .eq(0)
        .should('have.text', '1. del - Graffitimordene');
    });

    it(`Simple multivolume is converted to a series`, function() {
      // pid is an ebook
      cy.visit('/v%C3%A6rk/870970-basis:28329490');

      // check belt is there
      cy.contains('i samme serie');

      // When multivolume is converted to a series
      // we do not show 'bind' in the title
      cy.get('[data-cy=title-bind-info]').should('not.exist');

      // wait for belt to be loaded
      cy.contains('1. del - Min kamp');

      // the first part should not be described as
      // 1. del - Min kamp (bind 1 af 6) but just
      // 1. del - Min kamp
      cy.get('[data-cy=seriesBelt] .work-card__tax-description')
        .children()
        .eq(0)
        .should('have.text', '1. del - Min kamp');
    });

    it(`Series where some parts are multivolumes`, function() {
      // pid is an ebook
      cy.visit('/v%C3%A6rk/870970-basis:52021731');

      // check series description is there
      cy.contains('1. del af serien');

      // check belt is there
      cy.contains('i samme serie');

      // the ebook is not a speficic volume,
      // but we use volume 1 as the physical volume to represent
      cy.get('[data-cy=title-bind-info]').should('exist');
      cy.get('.work-preview__title').contains('bind 1 af 2');

      // the series belt need to display both volumes of the first part
      cy.get('[data-cy=seriesBelt]').contains(
        '1. del - Vejen til Swann (bind 1 af 2)'
      );
      cy.get('[data-cy=seriesBelt]').contains(
        '1. del - Vejen til Swann (bind 2 af 2)'
      );
    });
  });
});
