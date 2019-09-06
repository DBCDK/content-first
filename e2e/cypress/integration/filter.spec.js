describe('Filter page test', function() {
  it('Should test "Stemning" filter', function() {
    cy.visit('/');
    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=stemning]').click();
    cy.get('[data-cy=mystisk]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.reload(); // Because VisibilitySensor does not detect changes under Cypress

    cy.get('[data-cy=container-row]:first > [data-cy=workcard-1]').click('top');
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();
    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();

    cy.get('[data-cy=tag-mystisk]')
      .first()
      .should('have.text', 'mystisk');
  });

  it('Should test "Tempo" filter', function() {
    cy.visit('/find?tags=5633,5634');

    cy.get('[data-cy=container-row]:first > [data-cy=workcard-1]').click('top');
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();

    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();

    cy.get('[data-cy=tag-hæsblæsende]').should('have.text', 'hæsblæsende');
  });

  it('Should test "Længde" filter', function() {
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=længde]').click();
    cy.get('[data-cy=kort]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.reload(); // Because VisibilitySensor does not detect changes under Cypress

    cy.get('[data-cy=container-row]:first > [data-cy=workcard-1]').click('top');
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();

    cy.get('[data-cy=pages-count]').then(elem => {
      let pageCount = elem[0].getAttribute('data-value');
      expect(pageCount).lessThan(151);
    });
  });
  it('Should test "Univers" filter', function() {
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=univers]').click();
    cy.get('[data-cy=realistisk]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.reload(); // Because VisibilitySensor does not detect changes under Cypress

    cy.get('[data-cy=container-row]:first > [data-cy=workcard-1]').click('top');
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();
    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();

    cy.wait(1000);

    cy.get('[data-cy=tag-realistisk]').should('have.text', 'realistisk');
  });

  it('Should test "Fortællerstemme" filter', function() {
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=fortællerstemme]').click();
    cy.get('[data-cy=jeg-fortæller]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.reload(); // Because VisibilitySensor does not detect changes under Cypress

    cy.get('[data-cy=container-row]:first > [data-cy=workcard-1]').click('top');
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();
    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();

    cy.wait(1000);

    cy.get('[data-cy=tag-jeg-fortæller]').should('have.text', 'jeg-fortæller');
  });

  it('Should test "Sprog" filter', function() {
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=sprog]').click();
    cy.get('[data-cy=slang]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.reload(); // Because VisibilitySensor does not detect changes under Cypress

    cy.get('[data-cy=container-row]:first > [data-cy=workcard-1]').click('top');
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();
    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();

    cy.wait(1000);

    cy.get('[data-cy=tag-slang]').should('have.text', 'slang');
  });

  it('Should test "Skrivestil" filter', function() {
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=skrivestil]').click();
    cy.get('[data-cy=bevidsthedsstrøm]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.reload(); // Because VisibilitySensor does not detect changes under Cypress

    cy.get('[data-cy=container-row]:first > [data-cy=workcard-1]').click('top');
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();
    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();

    cy.wait(1000);

    cy.get('[data-cy=tag-bevidsthedsstrøm]').should(
      'have.text',
      'bevidsthedsstrøm'
    );
  });

  it('Should test "Handlingens tid" filter', function() {
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=handlingens-tid]').click();
    cy.get('[data-cy="den 2. verdenskrig"]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.reload(); // Because VisibilitySensor does not detect changes under Cypress

    cy.get('[data-cy=container-row]:first > [data-cy=workcard-0]').click('top');
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();
    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();

    cy.wait(1000);

    cy.get('[data-cy="tag-den 2. verdenskrig"]').should(
      'have.text',
      'den 2. verdenskrig'
    );
  });

  it('Should give suggestions on author search', function() {
    const authorName = 'Haruki Murakami';
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(authorName);

    cy.get('[data-cy=suggestion-element]')
      .its('length')
      .should('be.gte', 1);
    cy.get('[data-cy=suggestion-element]')
      .first()
      .get('u')
      .should('have.text', authorName);

    cy.get('[data-cy=search-bar-input]')
      .first()
      .type('{enter}');

    cy.get('[data-cy=workcard]')
      .its('length')
      .should('be.gte', 0);
  });

  it('Shows "More like this"-belt', function() {
    cy.visit('/find?tags=5634');
    cy.wait(1000);

    cy.get('[data-cy=WC-more-like-this]')
      .first()
      .click();

    cy.get('[data-cy=similarBelt]').within(el => {
      cy.get('[data-cy=workcard]')
        .its('length')
        .should('be.gte', 0);
    });
  });

  it('Should give one result on work search', function() {
    const workTitle = 'Kafka på stranden';
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=search-bar-input]')
      .first()
      .type(workTitle);

    cy.get('[data-cy=suggestion-element]')
      .its('length')
      .should('be.gte', 1);
    cy.get('[data-cy=suggestion-element]')
      .get('u')
      .contains(workTitle)
      .click();

    cy.get('[data-cy=workcard-0]')
      .its('length')
      .should('eq', 1);
  });
});
