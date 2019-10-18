describe('Start Belt Editor test', function() {
  beforeEach(function() {
    cy.initStorage();
    cy.clearClientStorage();
    cy.clearCookies();
  });

  const mockStorage = () => {
    cy.fixture('beltEditor/initialState.json').as('initialState');
    cy.fixture('beltEditor/defaultBelts.json').as('defaultBelts');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialState').as(
      'initialStateRequest'
    );
    cy.route(
      'GET',
      '/v1/object/find?type=belt&owner=12345678-1234-1234-1234-123456789012',
      '@defaultBelts'
    ).as('defaultBeltsRequest');
    cy.route('POST', '/v1/object/?role=*', () => {
      return {data: {_rev: '123'}};
    }).as('postBelt');
    cy.route('DELETE', '/v1/object/*', () => {
      return {data: {_rev: '234'}};
    }).as('deleteBelt');
  };

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
    cy.get('[data-cy=notification-container]').should('not.exist'); // Check that the error modal is not displayed
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
      .click({
        force: true
      });
  };

  const clickSortButton = (row, upDown) => {
    const arrowKey =
      upDown === 'up' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    cy.get(nthContentRow(row))
      .contains('i', arrowKey)
      .click({
        force: true
      });
  };

  const clickDeleteButton = row => {
    cy.get(nthContentRow(row))
      .contains('i', 'delete')
      .click({
        force: true
      });
  };

  const clickCreateButton = () => {
    cy.get('[data-cy=create-new-row-button]').click();
  };

  // ======================================================================================

  it('Test Top Bar menu -> Not logged in -> No access to the "Redaktionen" page', function() {
    cy.visit('/redaktionen');
    cy.get('div.Article__content h3').should('have.text', '404');
  });

  // ======================================================================================

  it('Test Top Bar menu -> Not logged in -> No access to the "Opret nyt bælte" page', function() {
    cy.visit('/redaktionen/opret');
    cy.get('div.Article__content h3').should('have.text', '404');
  });

  // ======================================================================================

  it('Test Top Bar menu -> Logged in as non editor -> Do not enter "Redaktionen" page', function() {
    cy.createUser('User');
    cy.visit('/');
    cy.get('[data-cy=topbar-logged-in-btn]').click();
    cy.get('[data-cy=edit-start-page] span').should('not.exist');
  });

  // ======================================================================================

  it('Test Top Bar menu -> Logged in as non editor -> No access to the "Redaktionen" page', function() {
    cy.createUser('User');
    cy.visit('/redaktionen');
    cy.get('div.Article__content h3').should('have.text', '404');
  });

  // ======================================================================================

  it('Test Top Bar menu -> Logged in as non editor -> No access to the "Opret nyt bælte" page', function() {
    cy.createUser('User');
    cy.visit('/redaktionen/opret');
    cy.get('div.Article__content h3').should('have.text', '404');
  });

  // ======================================================================================

  it('Test Top Bar menu -> Logged in as editor -> Do enter "Redaktionen" page', function() {
    cy.createUser('EditorUser', 'editor');
    cy.visit('/');
    cy.get('[data-cy=topbar-logged-in-btn]').click();
    cy.get('[data-cy=edit-start-page] span').click();
    cy.url().should('include', '/redaktionen');
  });

  // ======================================================================================

  it('Test Table contains three elements', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
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
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen');

    const verifyEnableDisableContent = firstEnabled => {
      verifyContentRow(
        1,
        firstEnabled,
        'Norske superromaner',
        'Bibliotekar Sarah'
      );
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
    };

    clickEnableDisableButton(1);
    cy.wait('@postBelt').then(
      xhr => expect(xhr.request.body.onFrontPage).to.be.false
    );
    verifyEnableDisableContent(false);

    clickEnableDisableButton(1);
    cy.wait('@postBelt').then(
      xhr => expect(xhr.request.body.onFrontPage).to.be.true
    );
    verifyEnableDisableContent(true);
  });

  // ======================================================================================

  it('Test Sort with arrow keys - inrange', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
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
    mockStorage();
    cy.createUser('EditorUser', 'editor');
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
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen');

    clickDeleteButton(2);
    // Still missing: Test, that the DELETE operation succeeded

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
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen');

    clickCreateButton();

    cy.url().should('include', '/redaktionen/opret');
    cy.get('.BeltForm div.banner__title [data-cy=banner-title]').contains(
      'Opret nyt bånd'
    );
  });

  // ======================================================================================
});
