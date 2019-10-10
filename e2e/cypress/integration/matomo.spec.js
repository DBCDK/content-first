const PID_REGEX = /^pid:\d+-\w+:\d+/;
const PID_REGEX_2 = /^\d+-\w+:\d+/;

const createMatomoMock = endpoint => {
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
  return {tracked, trackedData};
};

describe('Matomo test', function() {
  beforeEach(function() {
    cy.clearClientStorage();
    cy.clearCookies();
  });

  const mockInitialState = () => {
    cy.fixture('beltEditor/initialState.json').as('initialState');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState').as(
      'initialStateRequest'
    );
  };

  const testBelt = (
    endpoint,
    beltDataCy,
    cardDataCy,
    expectedName,
    expectRid = true
  ) => {
    const {tracked, trackedData} = createMatomoMock(endpoint);
    cy.get(beltDataCy).scrollIntoView();
    cy.get(`${beltDataCy} ${cardDataCy}`)
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
    mockInitialState();
    const tracked = testBelt(
      '/',
      '[data-cy="tagsbelt-Familiens skyggesider"]',
      '[data-cy="workcard"]',
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
      '[data-cy="workcard"]',
      'belt:Minder om Skyggen'
    );
  });

  it('Can track creator belt events', function() {
    testBelt(
      '/find?tags=Stephen King (f. 1947)',
      '[data-cy="creator-belt"]',
      '[data-cy="workcard"]',
      'belt:Fra søgning på forfatter Stephen King (f. 1947)',
      false
    );
  });

  it('Can track did read belt events', function() {
    cy.createUser('someuser');
    // make interaction such that personal recommendations belt appears
    cy.visit('/v%C3%A6rk/870970-basis:27206344');
    cy.get('[data-cy="add-to-list-btn"]').click();
    cy.get('[data-cy="add-to-list-btn"]')
      .contains('Har læst')
      .click();
    cy.visit('/');

    testBelt(
      '/',
      '[data-cy="did-read-belt"]',
      '[data-cy="workcard"]',
      'belt:Fordi du har læst Skyggen'
    );
  });

  it('Can track list ', function() {
    cy.fixture('listaggregation/recentlists.json').as('recentLists');
    cy.server();
    cy.route('GET', '/v1/object/aggregation**', '@recentLists');
    const expectedMatomoName = 'belt:Nyeste brugerlister';
    const {tracked} = createMatomoMock('/');
    cy.get('[data-cy="lists-belt"]').scrollIntoView();
    cy.get(`[data-cy="list-card-Ny liste1"]`)
      .click()
      .then(() => {
        expect(tracked.category).to.equal(expectedMatomoName);
        expect(tracked.action).to.equal('beltListVisit');
        expect(tracked.name).to.equal(
          'id:eeed6588-8a96-44c5-a72d-cb4f8f0615a1'
        );
      });
    cy.go('back');
    cy.get(`[data-cy="lists-belt"] [data-cy="next-btn"]`)
      .first()
      .click()
      .then(() => {
        expect(tracked.category).to.equal(expectedMatomoName);
        expect(tracked.action).to.equal('beltSwipe');
        expect(tracked.name).to.equal('position');
      });
  });
});
