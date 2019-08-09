const PID_REGEX = /^pid:\d+-\w+:\d+/;
const PID_REGEX_2 = /^\d+-\w+:\d+/;

describe('Matomo test', function() {
  beforeEach(function() {
    cy.clearClientStorage();
    cy.clearCookies();
  });

  const testBelt = (endpoint, beltDataCy, expectedName, expectRid = true) => {
    let tracked = {};
    let trackedData = {};
    cy.visitWithMatomoMocks(endpoint, {
      trackEvent: (category, action, name) => {
        tracked.category = category;
        tracked.action = action;
        tracked.name = name;
      },
      trackDataEvent: (action, data) => {
        trackedData.action = action;
        trackedData.data = data;
      }
    });
    cy.get(beltDataCy).scrollIntoView();
    cy.get(`${beltDataCy} [data-cy="workcard"]`)
      .first()
      .click()
      .then(() => {
        expect(tracked.category).to.equal(expectedName);
        expect(tracked.action).to.equal('beltExpandWork');
        expect(tracked.name).to.match(PID_REGEX);

        expect(trackedData.action).to.equal('preview');
        expect(trackedData.data.pid).to.match(PID_REGEX_2);
        if (expectRid) {
          expect(trackedData.data.rid).to.be.a('string');
        }
      });
    cy.get(`${beltDataCy} [data-cy="WC-more-like-this"]`)
      .first()
      .click()
      .then(() => {
        expect(tracked.category).to.equal(expectedName);
        expect(tracked.action).to.equal('beltMoreLikeThis');
        expect(tracked.name).to.match(PID_REGEX);
      });

    cy.get(`${beltDataCy} [data-cy="next-btn"]`)
      .first()
      .click()
      .then(() => {
        expect(tracked.category).to.equal(expectedName);
        expect(tracked.action).to.equal('beltSwipe');
        expect(tracked.name).to.equal('position');
      });
    return tracked;
  };

  it('Can track tags belt events', function() {
    const tracked = testBelt(
      '/',
      '[data-cy="tagsbelt-Familiens skyggesider"]',
      'belt:Familiens skyggesider'
    );

    cy.get(
      '[data-cy="tagsbelt-Familiens skyggesider"] [data-cy="tag-psykologisk"]'
    )
      .click()
      .then(() => {
        expect(tracked.category).to.equal('belt:Familiens skyggesider');
        expect(tracked.action).to.equal('beltTagClick');
        expect(tracked.name).to.equal('tag:psykologisk');
      });
    cy.go('back');

    cy.get('[data-cy="tagsbelt-Familiens skyggesider"] h1')
      .first()
      .click()
      .then(() => {
        expect(tracked.category).to.equal('belt:Familiens skyggesider');
        expect(tracked.action).to.equal('beltTitleClick');
      });
  });

  it('Can track remindsOf belt events', function() {
    testBelt(
      '/værk/870970-basis:27206344',
      '[data-cy="similarBelt"]',
      'belt:Minder om Skyggen'
    );
  });

  it('Can track creator belt events', function() {
    testBelt(
      '/find?tags=Stephen King (f. 1947)',
      '[data-cy="creator-belt"]',
      'belt:Fra søgning på forfatter Stephen King (f. 1947)',
      false
    );
  });

  it('Can track personal belt events without leaking username', function() {
    cy.initStorage();
    cy.createUser('someuser');
    // make interaction such that personal recommendations belt appears
    cy.visit('/værk/870970-basis:27206344');
    testBelt(
      '/',
      '[data-cy="interactions-belt"]',
      'belt:personalRecommendations'
    );
  });
});
