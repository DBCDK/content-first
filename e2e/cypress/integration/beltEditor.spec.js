describe('Start Belt Editor test', function() {
  beforeEach(function() {
    cy.initStorage();
    cy.clearClientStorage();
    cy.clearCookies();
    cy.createUser('User', '1'); // Create user and log in
  });

  const nthContentRow = n =>
    '.BeltEditor__container [data-cy=sortable-list-container] > [data-cy=reorder-list-element]:nth-child(' +
    n +
    ')';

  const verifyTitleRow = (title, creator) => {
    cy.get('.BeltEditor [data-cy=reorder-list-element] p')
      .eq(0)
      .should('have.text', title);
    cy.get('.BeltEditor [data-cy=reorder-list-element] p')
      .eq(1)
      .should('have.text', creator);
  };

  const verifyContentRow = (number, enabled, title, creator) => {
    const selector = nthContentRow(number);
    const enabledDisabled = enabled ? 'enabled' : 'disabled';
    cy.get(selector)
      .find('div.flex-container i')
      .should($i => {
        expect($i.eq(1)).to.have.class(enabledDisabled);
      });
    cy.get(selector)
      .find('div.flex-container p')
      .should($p => {
        expect($p.eq(0)).to.contain(title);
        expect($p.eq(1)).to.contain(creator);
      });
  };

  const clickEnableDisableButton = number => {
    cy.get(nthContentRow(number))
      .contains('i', 'fiber_manual_record')
      .click();
  };

  const clickSortButton = (row, upDown) => {
    const arrowKey =
      upDown === 'up' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    cy.get(nthContentRow(row))
      .contains('i', arrowKey)
      .click();
  };

  const clickDeleteButton = row => {
    cy.get(nthContentRow(row))
      .contains('i', 'delete')
      .click();
  };

  const clickCreateButton = () => {
    cy.get('[data-cy=create-new-row-button]').click();
  };

  // ======================================================================================

  it('Test Top Bar menu -> Not logged in -> Do not enter "Start Belt Editor" page', function() {
    // First log out (Overrule beforeEach method)
    cy.initStorage();
    cy.clearClientStorage();
    cy.clearCookies();
    cy.wait(1000);
    // Then test
    cy.visit('/');
    cy.get('[data-cy=topbar-login-btn]').click();
    cy.get('[data-cy=edit-start-page] span').should('not.exist');
  });

  // ======================================================================================

  it.skip('Test Top Bar menu -> Logged in -> Do enter "Start Belt Editor" page', function() {
    cy.visit('/');
    cy.get('[data-cy=topbar-logged-in-btn]').click();
    cy.get('[data-cy=edit-start-page] span').click();
    cy.url().should('include', '/redaktionen');
  });

  // ======================================================================================

  it('Test Table contains three elements', function() {
    cy.visit('/redaktionen');
    cy.get(
      '.BeltEditor__container [data-cy=sortable-list-container] > [data-cy=reorder-list-element]'
    ).should('have.length', 3);

    verifyTitleRow('Titel', 'Oprettet af');
    verifyContentRow(1, true, 'Norske superromaner', 'Bibliotekar Sarah');
    verifyContentRow(
      2,
      true,
      'Franske fristelser',
      'Christian Ertmann-Christiansen'
    );
    verifyContentRow(
      3,
      false,
      'Uhygge bag hjemmets fire vægge',
      'Bibliotekar Sarah'
    );
  });

  // ======================================================================================

  it('Test Enable/Disable belt', function() {
    cy.visit('/redaktionen');

    clickEnableDisableButton(1);

    verifyContentRow(1, false, 'Norske superromaner', 'Bibliotekar Sarah');
    verifyContentRow(
      2,
      true,
      'Franske fristelser',
      'Christian Ertmann-Christiansen'
    );
    verifyContentRow(
      3,
      false,
      'Uhygge bag hjemmets fire vægge',
      'Bibliotekar Sarah'
    );

    clickEnableDisableButton(1);

    verifyContentRow(1, true, 'Norske superromaner', 'Bibliotekar Sarah');
    verifyContentRow(
      2,
      true,
      'Franske fristelser',
      'Christian Ertmann-Christiansen'
    );
    verifyContentRow(
      3,
      false,
      'Uhygge bag hjemmets fire vægge',
      'Bibliotekar Sarah'
    );
  });

  // ======================================================================================

  it('Test Sort with arrow keys - inrange', function() {
    cy.visit('/redaktionen');

    clickSortButton(1, 'down');
    verifyContentRow(
      1,
      true,
      'Franske fristelser',
      'Christian Ertmann-Christiansen'
    );
    verifyContentRow(2, true, 'Norske superromaner', 'Bibliotekar Sarah');
    verifyContentRow(
      3,
      false,
      'Uhygge bag hjemmets fire vægge',
      'Bibliotekar Sarah'
    );

    clickSortButton(3, 'up');
    verifyContentRow(
      1,
      true,
      'Franske fristelser',
      'Christian Ertmann-Christiansen'
    );
    verifyContentRow(
      2,
      false,
      'Uhygge bag hjemmets fire vægge',
      'Bibliotekar Sarah'
    );
    verifyContentRow(3, true, 'Norske superromaner', 'Bibliotekar Sarah');
  });

  // ======================================================================================

  it('Test Sort with arrow keys - out of range', function() {
    cy.visit('/redaktionen');

    clickSortButton(1, 'up');
    verifyTitleRow('Titel', 'Oprettet af');
    verifyContentRow(1, true, 'Norske superromaner', 'Bibliotekar Sarah');
    verifyContentRow(
      2,
      true,
      'Franske fristelser',
      'Christian Ertmann-Christiansen'
    );
    verifyContentRow(
      3,
      false,
      'Uhygge bag hjemmets fire vægge',
      'Bibliotekar Sarah'
    );

    clickSortButton(3, 'down');
    verifyTitleRow('Titel', 'Oprettet af');
    verifyContentRow(1, true, 'Norske superromaner', 'Bibliotekar Sarah');
    verifyContentRow(
      2,
      true,
      'Franske fristelser',
      'Christian Ertmann-Christiansen'
    );
    verifyContentRow(
      3,
      false,
      'Uhygge bag hjemmets fire vægge',
      'Bibliotekar Sarah'
    );
  });

  // ======================================================================================

  it('Test delete row', function() {
    cy.visit('/redaktionen');

    clickDeleteButton(2);

    cy.get(
      '.BeltEditor__container [data-cy=sortable-list-container] > [data-cy=reorder-list-element]'
    ).should('have.length', 2);
    verifyTitleRow('Titel', 'Oprettet af');
    verifyContentRow(1, true, 'Norske superromaner', 'Bibliotekar Sarah');
    verifyContentRow(
      2,
      false,
      'Uhygge bag hjemmets fire vægge',
      'Bibliotekar Sarah'
    );
  });

  // ======================================================================================

  it('Test click create new row button', function() {
    cy.visit('/redaktionen');

    clickCreateButton();

    cy.url().should('include', '/redaktionen/opret');
    cy.get('.CreateBelt div.Banner__title [data-cy=banner-title]').contains(
      'Opret nyt bånd'
    );
  });

  // ======================================================================================

  it('Test create new belt page - test disabled Create button', function() {
    const TitleText = 'Title';

    cy.visit('/redaktionen/opret');

    cy.get('[data-cy=create-belt-cancel-button]').should('be.enabled');
    cy.get('[data-cy=create-belt-ok-button]').should('be.disabled');

    cy.get('[data-cy=create-belt-title-input]').type(TitleText);

    cy.get('[data-cy=create-belt-cancel-button]').should('be.enabled');
    cy.get('[data-cy=create-belt-ok-button]').should('be.enabled');
  });

  // ======================================================================================

  it('Test create new belt page - test disabled Publish Today text', function() {
    cy.visit('/redaktionen/opret');

    cy.get('[data-cy=create-belt-publish-today]').should(
      'contain.class',
      'disabled'
    );
    cy.get('[data-cy=create-belt-enabled-radio-button]').click();
    cy.get('[data-cy=create-belt-publish-today]').should(
      'not.contain.class',
      'disabled'
    );
  });

  // ======================================================================================

  it('Test create new belt page - test Title and Description texts', function() {
    const TitleText = 'Title';
    const DescriptionText = 'Description';

    cy.visit('/redaktionen/opret');

    cy.get('[data-cy=create-belt-title-input]').type(TitleText);
    cy.get('[data-cy=create-belt-description-input]').type(DescriptionText);

    cy.get('[data-cy=tagsbelt-' + TitleText + '] h1:first strong').should(
      'have.text',
      TitleText
    );
    cy.get('[data-cy=tagsbelt-' + TitleText + '] h3:first').should(
      'have.text',
      DescriptionText
    );
  });

  // ======================================================================================

  it('Test create new belt page - test Tag selection', function() {
    cy.visit('/redaktionen/opret');

    cy.get('[data-cy=univers]').click();
    cy.get('[data-cy=realistisk]').click();
    cy.get('[data-cy=filterDimmer]').click();

    cy.get('.CreateBelt [data-cy=search-bar-input]').type('fanta');
    cy.get('.CreateBelt [data-cy=suggestion-element]')
      .eq(3)
      .click({force: true});
    cy.get('.CreateBelt .selected-filters .selected-filter span span').should(
      $p => {
        expect($p.eq(0)).to.contain('realistisk');
        expect($p.eq(1)).to.contain('fantasiverdener');
      }
    );
    cy.get('[data-cy=tag-realistisk]').should('have.text', 'realistisk');
    cy.get('[data-cy=tag-fantasiverdener]').should(
      'have.text',
      'fantasiverdener'
    );
  });

  // ======================================================================================
});
