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
    cy.get('[data-cy=reorder-list-element] p')
      .eq(0)
      .should('have.text', title);
    cy.get('[data-cy=reorder-list-element] p')
      .eq(1)
      .should('have.text', creator);
  };

  const verifyContentRow = (number, enabled, title, creator) => {
    const selector = nthContentRow(number + 1);
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
    cy.get(nthContentRow(number + 1))
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

  const verifyBeltSave = (
    xhr,
    createdBy,
    index,
    name,
    description,
    enabled,
    tags,
    id,
    owner
  ) => {
    expect(xhr.request.body.createdBy).to.equal(createdBy);
    expect(xhr.request.body.index).to.equal(index);
    expect(xhr.request.body.key).to.equal(name);
    expect(xhr.request.body.name).to.equal(name);
    if (enabled) {
      // eslint-disable-next-line no-unused-expressions
      expect(xhr.request.body.onFrontPage).to.be.true;
    } else {
      // eslint-disable-next-line no-unused-expressions
      expect(xhr.request.body.onFrontPage).to.be.false;
    }
    expect(xhr.request.body.subtext).to.equal('Description');
    expect(xhr.request.body.tags.length).to.equal(tags.length);
    if (tags.length) {
      for (let i = 0; i < tags.length; i++) {
        expect(xhr.request.body.tags[i].id).to.equal(tags[i]);
        expect(xhr.request.body.tags[i].weight).to.equal(1);
      }
    }
    expect(xhr.request.body._id).to.equal(id);
    expect(xhr.request.body._owner).to.equal(owner);
    expect(xhr.request.body._public).to.equal(true);
    expect(xhr.request.body._type).to.equal('belt');
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
    verifyContentRow(1, true, 'Norske superromaner', '');
    verifyContentRow(
      2,
      true,
      'Franske fristelser',
      ''
    );
    verifyContentRow(
      3,
      false,
      'Uhygge bag hjemmets fire vægge',
      ''
    );
  });

  // ======================================================================================

  it('Test Enable/Disable belt', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen');

    const verifyEnableDisableContent = firstEnabled => {
      verifyContentRow(1, firstEnabled, 'Norske superromaner', '');
      verifyContentRow(2, true, 'Franske fristelser', '');
      verifyContentRow(3, false, 'Uhygge bag hjemmets fire vægge', '');
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
    cy.wait('@postBelt').then(xhr => {
      verifyBeltSave(
        xhr,
        'didrik',
        0,
        'Franske fristelser',
        'Description',
        true,
        [],
        '0af2f486-4163-4eea-b41e-73ad0dee5cdd',
        '06ad8729-1216-428c-911c-de4a73c83042'
      );
    });
    cy.wait('@postBelt').then(xhr => {
      verifyBeltSave(
        xhr,
        'didrik',
        1,
        'Norske superromaner',
        'Description',
        true,
        [],
        '715b24c5-8bce-47f9-87f0-d3d40e299430',
        '12345678-1234-1234-1234-123456789012'
      );
    });
    cy.wait('@postBelt').then(xhr => {
      verifyBeltSave(
        xhr,
        'didrik',
        2,
        'Uhygge bag hjemmets fire vægge',
        'Description',
        false,
        [4044, 4895, 5149],
        '5143f91b-597a-4880-a817-d60f8a84635b',
        '06ad8729-1216-428c-911c-de4a73c83042'
      );
    });
    verifyContentRow(
      1,
      true,
      'Franske fristelser',
      ''
    );
    verifyContentRow(2, true, 'Norske superromaner', '');
    verifyContentRow(
      3,
      false,
      'Uhygge bag hjemmets fire vægge',
      ''
    );

    clickSortButton(3, 'up');
    cy.wait('@postBelt').then(xhr => {
      verifyBeltSave(
        xhr,
        'didrik',
        0,
        'Franske fristelser',
        'Description',
        true,
        [],
        '0af2f486-4163-4eea-b41e-73ad0dee5cdd',
        '06ad8729-1216-428c-911c-de4a73c83042'
      );
    });
    cy.wait('@postBelt').then(xhr => {
      verifyBeltSave(
        xhr,
        'didrik',
        1,
        'Uhygge bag hjemmets fire vægge',
        'Description',
        false,
        [4044, 4895, 5149],
        '5143f91b-597a-4880-a817-d60f8a84635b',
        '06ad8729-1216-428c-911c-de4a73c83042'
      );
    });
    cy.wait('@postBelt').then(xhr => {
      verifyBeltSave(
        xhr,
        'didrik',
        2,
        'Norske superromaner',
        'Description',
        true,
        [],
        '715b24c5-8bce-47f9-87f0-d3d40e299430',
        '12345678-1234-1234-1234-123456789012'
      );
    });
    verifyContentRow(
      1,
      true,
      'Franske fristelser',
      ''
    );
    verifyContentRow(
      2,
      false,
      'Uhygge bag hjemmets fire vægge',
      ''
    );
    verifyContentRow(3, true, 'Norske superromaner', '');
  });

  // ======================================================================================

  it('Test Sort with arrow keys - out of range', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen');

    clickSortButton(1, 'up');
    verifyTitleRow('Titel', 'Oprettet af');
    verifyContentRow(1, true, 'Norske superromaner', '');
    verifyContentRow(2, true, 'Franske fristelser', '');
    verifyContentRow(3, false, 'Uhygge bag hjemmets fire vægge', '');

    clickSortButton(3, 'down');
    verifyTitleRow('Titel', 'Oprettet af');
    verifyContentRow(1, true, 'Norske superromaner', '');
    verifyContentRow(2, true, 'Franske fristelser', '');
    verifyContentRow(3, false, 'Uhygge bag hjemmets fire vægge', '');
  });

  // ======================================================================================

  it('Test delete row', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen');

    clickDeleteButton(2);
    cy.wait('@deleteBelt').then(xhr => {
      expect(xhr.xhr.method).to.equal('DELETE');
      expect(xhr.xhr.url).to.contain(
        '/v1/object/0af2f486-4163-4eea-b41e-73ad0dee5cdd?role=12345678-1234-1234-1234-123456789012'
      );
    });

    cy.get(
      '.BeltEditor__container [data-cy=sortable-list-container] > [data-cy=reorder-list-element]'
    ).should('have.length', 2);
    verifyTitleRow('Titel', 'Oprettet af');
    verifyContentRow(1, true, 'Norske superromaner', '');
    verifyContentRow(
      2,
      false,
      'Uhygge bag hjemmets fire vægge',
      ''
    );
  });

  // ======================================================================================

  it('Test click create new row button', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen');

    clickCreateButton();

    cy.url().should('include', '/redaktionen/opret');
    cy.get('.BeltForm div.Banner__title [data-cy=banner-title]').contains(
      'Opret nyt bånd'
    );
  });

  // ======================================================================================

  it('Test spinner when loading table', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.route(
      // The purpose of this route is to delay the GET in order to display the spinner
      {
        method: 'GET',
        url:
          '/v1/object/find?type=belt&owner=12345678-1234-1234-1234-123456789012',
        delay: 1000,
        response: '@defaultBelts'
      },
      '@defaultBelts'
    ).as('defaultDelayedBeltsRequest');

    cy.visit('/redaktionen');

    // Verify, that the Spinner is shown, and no data is shown
    cy.get('[data-cy=belt-editor-spinner]').should('exist');
    cy.get(
      '.BeltEditor__container [data-cy=sortable-list-container] > [data-cy=reorder-list-element]'
    ).should('not.exist');

    // Verify, that after data has been loaded, it is shown
    verifyTitleRow('Titel', 'Oprettet af');
    verifyContentRow(0, true, 'Norske superromaner', 'Bibliotekar Sarah');
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
  });

  // ======================================================================================
});
