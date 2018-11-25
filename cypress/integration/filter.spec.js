describe('Filter page test', function() {
  it('Should test "Stemning" filter', function() {
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=stemning]').click();
    cy.get('[data-cy=filosofisk]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.get('[data-cy=workcard0]')
      .first()
      .click();
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();
    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();
    cy.get('[data-cy=tag-filosofisk]').should('have.text', 'filosofisk');
  });

  /* it('Should test "Tempo" filter', function() {//TODO
     
    cy.visit('/')
     
    cy.get('[data-cy=topbar-search-btn]').click()
    cy.get('[data-cy=tempo]').click()
    console.log("cy.get('.slider')",cy.get('.rc-slider-handle-2'))

    cy.get('.rc-slider-handle-2').trigger('mousedown')
    .trigger('mousemove', {clientX: 10, clientY: 0}).trigger('mouseup')
  

    .trigger('mouseup')
    cy.pause();
    cy.get('[data-cy=filterDimmer]').click()
    cy.get('[data-cy=workcard0]').first().click()
    cy.get('[data-cy=tags-collaps-toggle]').first().click()

    cy.get('[data-cy=tag-statisk]').should('have.text', 'statisk')

   })*/

  it('Should test "Længde" filter', function() {
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=længde]').click();
    cy.get('[data-cy=kort]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.get('[data-cy=workcard0]')
      .first()
      .click();
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
    cy.get('[data-cy=workcard0]')
      .first()
      .click();
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();
    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();

    cy.get('[data-cy=tag-realistisk]').should('have.text', 'realistisk');
  });

  it('Should test "Fortællerstemme" filter', function() {
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=fortællerstemme]').click();
    cy.get('[data-cy=jeg-fortæller]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.get('[data-cy=workcard0]')
      .first()
      .click();
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();
    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();

    cy.get('[data-cy=tag-jeg-fortæller]').should('have.text', 'jeg-fortæller');
  });

  it('Should test "Sprog" filter', function() {
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=sprog]').click();
    cy.get('[data-cy=slang]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.get('[data-cy=workcard0]')
      .first()
      .click();
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();
    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();

    cy.get('[data-cy=tag-slang]').should('have.text', 'slang');
  });

  it('Should test "Skrivestil" filter', function() {
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=skrivestil]').click();
    cy.get('[data-cy=bevidsthedsstrøm]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.get('[data-cy=workcard0]')
      .first()
      .click();
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();
    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();

    cy.get('[data-cy=tag-bevidsthedsstrøm]').should(
      'have.text',
      'bevidsthedsstrøm'
    );
  });

  it('Should test "Handlingens tid" filter', function() {
    cy.visit('/');

    cy.get('[data-cy=topbar-search-btn]').click();
    cy.get('[data-cy=handlingens-tid]').click();
    cy.get('[data-cy=oldtiden]').click();
    cy.get('[data-cy=filterDimmer]').click();
    cy.get('[data-cy=workcard0]')
      .first()
      .click();
    cy.get('[data-cy=workpreviewCard]')
      .first()
      .click();
    cy.get('[data-cy=tags-collaps-toggle]')
      .first()
      .click();

    cy.get('[data-cy=tag-oldtiden]').should('have.text', 'oldtiden');
  });
});
