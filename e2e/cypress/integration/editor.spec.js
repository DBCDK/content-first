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
    cy.get('div.list-title-row').contains('p', title);
    cy.get('div.list-title-row').contains('p', creator);
  };

  const verifyContentRow = (number, enabled, title, creator) => {
    const selector = nthContentRow(number);
    const enabledDisabled = enabled ? 'enabled' : 'disabled';
    cy.get(selector)
      .contains('i', 'fiber_manual_record')
      .should('have.class', enabledDisabled);
    cy.get(selector).contains('p', title);
    cy.get(selector).contains('p', creator);
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

  it('Test create new row', function() {
    cy.visit('/redaktionen');

    clickCreateButton();

    cy.get(
      '.BeltEditor__container [data-cy=sortable-list-container] > [data-cy=reorder-list-element]'
    ).should('have.length', 4);
    verifyTitleRow('Titel', 'Oprettet af');
    verifyContentRow(1, false, 'Ny titel', 'Ny forfatter');
    verifyContentRow(2, true, 'Norske superromaner', 'Bibliotekar Sarah');
    verifyContentRow(
      3,
      true,
      'Franske fristelser',
      'Christian Ertmann-Christiansen'
    );
    verifyContentRow(
      4,
      false,
      'Uhygge bag hjemmets fire vægge',
      'Bibliotekar Sarah'
    );
  });
});
