describe('Start Belt Form test', function() {
  beforeEach(function() {
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
      return {};
    }).as('postBelt');
    cy.route('DELETE', '/v1/object/*', () => {
      return {};
    }).as('deleteBelt');
    cy.route('GET', '/v1/user/didrik', () => ({
      data: {
        name: 'Didrik Didriksen',
        openplatformId: 'Didrik Didriksen'
      }
    })).as('getUserSarah');
  };

  const enterTitle = title => {
    cy.get('[data-cy=belt-form-title-input]').type(title);
  };
  const enterDescription = description => {
    cy.get('[data-cy=belt-form-description-input]').type(description);
  };

  const verifyTitleBelowTagsBelt = title => {
    cy.get('[data-cy=tagsbelt-' + title + '] h1:first strong').should(
      'have.text',
      title
    );
  };

  const verifyDescriptionBelowTagsBelt = (title, description) => {
    cy.get('[data-cy=tagsbelt-' + title + '] h3:first').should(
      'have.text',
      description
    );
  };

  const enablePublishing = enable => {
    if (enable) {
      cy.get('[data-cy=belt-form-enabled-radio-button]').click();
    } else {
      cy.get('[data-cy=belt-form-disabled-radio-button]').click();
    }
  };

  const selectTag = (group, tag) => {
    cy.get('[data-cy=' + group + ']').click();
    cy.get('[data-cy=' + tag + ']').click();
    cy.get('[data-cy=filterDimmer]').click();
  };

  const verifyInputField = (dataCy, expectedValue) => {
    cy.get('[data-cy=' + dataCy + ']')
      .invoke('val')
      .then(value => expect(value).to.equal(expectedValue));
  };

  const verifyBeltEnabled = enabled => {
    if (enabled) {
      cy.get('[data-cy=belt-form-disabled-radio-button] input').should(
        'not.be.checked'
      );
      cy.get('[data-cy=belt-form-enabled-radio-button] input').should(
        'be.checked'
      );
    } else {
      cy.get('[data-cy=belt-form-disabled-radio-button] input').should(
        'be.checked'
      );
      cy.get('[data-cy=belt-form-enabled-radio-button] input').should(
        'not.be.checked'
      );
    }
  };

  const verifyTags = tags => {
    cy.get('.BeltForm .selected-filters .selected-filter span span').should(
      $p => {
        let i = 0;
        tags.forEach(tag => expect($p.eq(i++)).to.contain(tag));
      }
    );
    tags.forEach(tag =>
      cy.get('[data-cy=tag-' + tag + ']').should('have.text', tag)
    );
  };

  const verifyErrorNotification = error => {
    cy.get('[data-cy=notification-container]').should('exist');
    cy.get(
      '[data-cy=notification-container] p.Notification__container-text'
    ).should(text => expect(text).to.contain(error));
  };

  // ======================================================================================

  it('Test create new belt page - test disabled Create button', function() {
    mockStorage();
    const TitleText = 'Title';

    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen/opret');

    cy.get('[data-cy=belt-form-cancel-button]').should('be.enabled');
    cy.get('[data-cy=belt-form-ok-button]').should('be.disabled');

    enterTitle(TitleText);

    cy.get('[data-cy=belt-form-cancel-button]').should('be.enabled');
    cy.get('[data-cy=belt-form-ok-button]').should('be.enabled');
  });

  // ======================================================================================

  it('Test create new belt page - test disabled Publish Today text', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen/opret');

    cy.get('[data-cy=belt-form-publish-today]').should(
      'contain.class',
      'disabled'
    );

    enablePublishing(true);

    cy.get('[data-cy=belt-form-publish-today]').should(
      'not.contain.class',
      'disabled'
    );
  });

  // ======================================================================================

  it('Test create new belt page - test Title and Description texts', function() {
    mockStorage();
    const TitleText = 'Title';
    const DescriptionText = 'Description';

    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen/opret');

    enterTitle(TitleText);
    enterDescription(DescriptionText);

    verifyTitleBelowTagsBelt(TitleText);
    verifyDescriptionBelowTagsBelt(TitleText, DescriptionText);
  });

  // ======================================================================================

  it('Test create new belt page - test Tag selection', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen/opret');

    selectTag('univers', 'realistisk');

    cy.get('.BeltForm [data-cy=search-bar-input]').type('v');
    cy.wait(200);
    cy.get('.BeltForm [data-cy=search-bar-input]').type('a');
    cy.get('.BeltForm li.react-autosuggest__suggestion:first').click({
      force: true
    });
    verifyTags(['realistisk', 'vaccination']);
  });

  // ======================================================================================

  it('Test create new belt page - test succesful save', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen/opret');

    enterTitle('-Title-');
    enterDescription('-Description-');
    enablePublishing(true);
    selectTag('univers', 'realistisk');
    selectTag('stemning', 'positiv');
    selectTag('sprog', 'slang');

    cy.get('[data-cy=belt-form-ok-button]').click();
    cy.wait('@postBelt').then(xhr => {
      expect(xhr.request.body.createdBy).to.equal('didrik');
      expect(xhr.request.body.name).to.equal('-Title-');
      expect(xhr.request.body.subtext).to.equal('-Description-');
      // eslint-disable-next-line no-unused-expressions
      expect(xhr.request.body.onFrontPage).to.be.true;
      expect(xhr.request.body.tags[0].id).to.equal(5731);
      expect(xhr.request.body.tags[1].id).to.equal(5640);
      expect(xhr.request.body.tags[2].id).to.equal(5617);
      // eslint-disable-next-line no-unused-expressions
      expect(xhr.request.body._public).to.be.true;
      expect(xhr.request.body._type).to.equal('belt');
      // eslint-disable-next-line no-unused-expressions
      expect(xhr.request.body._id).to.equal(''); // Empty id means save and not update
    });
  });

  // ======================================================================================

  it('Test create new belt page - test unsuccesful save', function() {
    mockStorage();
    cy.route({
      method: 'POST',
      url: '/v1/object/?role=*',
      status: 404,
      response: {}
    }).as('postBelt404');
    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen/opret');

    enterTitle('-Title-');
    enterDescription('-Description-');
    enablePublishing(true);
    selectTag('univers', 'realistisk');
    selectTag('stemning', 'positiv');
    selectTag('sprog', 'slang');

    cy.get('[data-cy=belt-form-ok-button]').click();
    cy.wait('@postBelt404').then(xhr => {
      verifyErrorNotification(
        'Der opstod en fejl under forsøg på at oprette et bånd'
      );
    });
  });

  // ======================================================================================

  it('Test edit belt page - test disabled Published/Created text', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit('/redaktionen/rediger');

    cy.get('[data-cy=belt-form-publish-today]').should(
      'contain.class',
      'disabled'
    );

    enablePublishing(true);

    cy.get('[data-cy=belt-form-publish-today]').should(
      'not.contain.class',
      'disabled'
    );
  });

  // ======================================================================================

  it('Test edit belt page - test all fields are pre-entered', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit(
      '/redaktionen/rediger?title=Fantastiske%20historier&description=De%20mest%20fantastiske%20historier&' +
        'enabled=true&tags=5726,5730&createdBy=didrik&created=1570026656&id=bba1bc1a-7fb8-4f5a-a86e-8221dafc77ca'
    );

    verifyInputField('belt-form-title-input', 'Fantastiske historier');
    verifyInputField(
      'belt-form-description-input',
      'De mest fantastiske historier'
    );
    verifyBeltEnabled(true);
    cy.get('[data-cy=belt-form-publish-today] p:nth-child(2)').should(
      'have.text',
      '2. okt 2019, Didrik Didriksen'
    );
    verifyTags(['fantastisk', 'overnaturligt']);
  });

  // ======================================================================================

  it('Test edit belt page - test that data is being saved (updated) - successful', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit(
      '/redaktionen/rediger?title=Fantastiske%20historier&description=De%20mest%20fantastiske%20historier&' +
        'enabled=true&tags=5726,5730&createdBy=didrik&created=1570026656&id=bba1bc1a-7fb8-4f5a-a86e-8221dafc77ca'
    );

    enterTitle(' - nyt');

    cy.get('[data-cy=belt-form-ok-button]').click();
    cy.wait('@postBelt').then(xhr => {
      expect(xhr.request.body.createdBy).to.equal('didrik');
      expect(xhr.request.body.name).to.equal('Fantastiske historier - nyt');
      expect(xhr.request.body.subtext).to.equal(
        'De mest fantastiske historier'
      );
      // eslint-disable-next-line no-unused-expressions
      expect(xhr.request.body.onFrontPage).to.be.true;
      expect(xhr.request.body.tags[0].id).to.equal(5726);
      expect(xhr.request.body.tags[1].id).to.equal(5730);
      // eslint-disable-next-line no-unused-expressions
      expect(xhr.request.body._public).to.be.true;
      expect(xhr.request.body._type).to.equal('belt');
      expect(xhr.request.body._id).to.equal(
        'bba1bc1a-7fb8-4f5a-a86e-8221dafc77ca' // Defined id means update and not save
      );
    });
  });

  // ======================================================================================

  it('Test edit belt page - test that data is being saved (updated) - unsuccessful', function() {
    mockStorage();
    cy.route({
      method: 'POST',
      url: '/v1/object/?role=*',
      status: 404,
      response: {}
    }).as('postBelt404');
    cy.createUser('EditorUser', 'editor');
    cy.visit(
      '/redaktionen/rediger?title=Fantastiske%20historier&description=De%20mest%20fantastiske%20historier&' +
        'enabled=true&tags=5726,5730&createdBy=didrik&created=1570026656&id=bba1bc1a-7fb8-4f5a-a86e-8221dafc77ca'
    );

    enterTitle(' - nyt');

    cy.get('[data-cy=belt-form-ok-button]').click();
    cy.wait('@postBelt404').then(xhr => {
      expect(xhr.request.body._id).to.equal(
        'bba1bc1a-7fb8-4f5a-a86e-8221dafc77ca' // Defined id means update and not save
      );
      verifyErrorNotification(
        'Der opstod en fejl under forsøg på at opdatere et bånd'
      );
    });
  });

  // ======================================================================================

  it('Test edit belt page - test delete button - successful', function() {
    mockStorage();
    cy.createUser('EditorUser', 'editor');
    cy.visit(
      '/redaktionen/rediger?title=Fantastiske%20historier&description=De%20mest%20fantastiske%20historier&' +
        'enabled=true&tags=5726,5730&createdBy=didrik&created=1570026656&id=bba1bc1a-7fb8-4f5a-a86e-8221dafc77ca'
    );

    cy.get('[data-cy=belt-form-delete-button]').click();
    cy.wait('@deleteBelt').then(xhr => {
      expect(xhr.xhr.method).to.equal('DELETE');
      expect(xhr.xhr.url).to.contain(
        '/v1/object/bba1bc1a-7fb8-4f5a-a86e-8221dafc77ca?role=12345678-1234-1234-1234-123456789012'
      );
    });
  });

  // ======================================================================================

  it('Test edit belt page - test delete button - unsuccessful', function() {
    mockStorage();
    cy.route({
      method: 'DELETE',
      url: '/v1/object/*',
      status: 404,
      response: {}
    }).as('deleteBelt404');
    cy.createUser('EditorUser', 'editor');
    cy.visit(
      '/redaktionen/rediger?title=Fantastiske%20historier&description=De%20mest%20fantastiske%20historier&' +
        'enabled=true&tags=5726,5730&createdBy=didrik&created=1570026656&id=bba1bc1a-7fb8-4f5a-a86e-8221dafc77ca'
    );

    cy.get('[data-cy=belt-form-delete-button]').click();
    cy.wait('@deleteBelt404').then(xhr => {
      expect(xhr.xhr.method).to.equal('DELETE');
      expect(xhr.status).to.equal(404);
      expect(xhr.xhr.url).to.contain(
        '/v1/object/bba1bc1a-7fb8-4f5a-a86e-8221dafc77ca?role=12345678-1234-1234-1234-123456789012'
      );
      verifyErrorNotification(
        'Der opstod en fejl under forsøg på at slette et bånd'
      );
    });
  });

  // ======================================================================================
});
