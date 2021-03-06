describe('kiosk', function() {
  const pid = '870970-basis:51897080';
  const work = {
    book: {
      pid: '870970-basis:51897080',
      unit_id: 'unit:2044196',
      work_id: 'work:1636485',
      bibliographic_record_id: -1,
      creator: 'Klaus Høeck',
      title: 'Legacy',
      title_full: 'Legacy',
      pages: 585,
      type: 'Bog',
      work_type: 'book',
      language: 'Dansk',
      items: 69,
      libraries: 65,
      subject: 'Gud, eksistentialisme, systemdigtning',
      genre: 'Skønlitteratur',
      first_edition_year: 2015,
      literary_form: '',
      taxonomy_description: 'Realistisk erindringer om systemdigtning',
      description:
        'Systemdigte, der bevæger sig mellem sproget og virkeligheden i en søgen efter sig selv og forfatterens jeg',
      loans: 90
    }
  };

  const setKioskMode = () => {
    cy.viewport(1080, 1920);
    cy.setKioskMode();
  };

  const mockRecompas = entries => {
    cy.route('GET', '/v1/recompass*', {
      response: entries,
      rid: 'some-rid'
    });
  };

  const mockHoldings = (pid, status) => {
    const mockedHoldings = {
      [pid]: [
        {
          onShelf: false,
          notForLoan: false,
          onLoan: false
        }
      ].concat(Array.isArray(status) ? status : [status])
    };
    cy.route('GET', '/v1/holdings?*', () => mockedHoldings).as(
      'getStatusHoldings'
    );
  };

  const assertHomeStatus = status => {
    const statusText = {
      onShelf: 'På hylden',
      notForLoan: 'Kan ikke lånes',
      onLoan: 'Udlånt',
      notAvailable: 'Haves ikke'
    };
    const statusColor = {
      onShelf: 'green',
      notForLoan: 'yellow',
      onLoan: 'red',
      notAvailable: 'red'
    };
    if (status === 'non-kiosk') {
      cy.get('[data-cy=home-status-indicator]').should('not.exist');
      return;
    }
    cy.get('[data-cy=home-status-indicator] p:first').should(
      'have.text',
      statusText[status]
    );
    cy.get('[data-cy=home-status-indicator] i:first').should(
      'have.class',
      statusColor[status]
    );
  };

  const assertHomeStatusOnWorkCard = status => {
    cy.get('.scroll-to-component:first').scrollIntoView();
    assertHomeStatus(status);
  };

  const clickFirstBook = () => {
    cy.get('.scroll-to-component:first').scrollIntoView();
    cy.get('[data-cy="book-cover-loaded"]:first').click();
  };

  const clickFirstBooksBookmark = () => {
    cy.get('.scroll-to-component:first').scrollIntoView();
    cy.get('.material-icons-bookmark_outline:first').click();
  };

  const clickShortListButtonInKioskMode = () => {
    cy.get('[data-cy=navActionShort]').click();
  };

  const clickShortListButtonInNonKioskMode = () => {
    cy.get('[data-cy=topbar-shortlist]').click();
    cy.get('[data-cy=shortlist-dropdown-visit-shortlist]').click();
  };

  const clickClearShortlistButton = () => {
    cy.get('.shortlist__item .remove-btn').click();
  };

  const assertFindBookButton = enabled => {
    cy.get(
      '[data-cy=find-book-button-container] .find-book-button span'
    ).should('have.text', 'Find bogen');
    cy.get('[data-cy=find-book-button-container] .find-book-button').should(
      enabled ? 'be.enabled' : 'be.disabled'
    );
  };

  const assertNoFindBookButton = () => {
    cy.get('[data-cy=find-book-button-container]').should('not.exist');
  };

  const clickFindBookButton = () => {
    cy.get('[data-cy=find-book-button-container] .find-book-button').click();
  };

  const assertFindBookModal = location => {
    const locations = Array.isArray(location) ? location : [location];
    cy.get('[data-cy=wayfinder-modal] .Title').then(elements => {
      cy.wrap(elements).should('have.length', locations.length);
      cy.wrap(elements).each((text, i) => {
        cy.wrap(text).should('have.text', locations[i]);
      });
    });
  };

  // --------------------------------------------------------------------------
  // Test Home Status on WorkCard page
  // --------------------------------------------------------------------------

  it('On Shelf status on WorkCard', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {onShelf: true});
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    assertHomeStatusOnWorkCard('onShelf');
  });

  it('Not For Loan status on WorkCard', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {notForLoan: true});
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    assertHomeStatusOnWorkCard('notForLoan');
  });

  it('On Loan status on WorkCard', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {onLoan: true});
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    assertHomeStatusOnWorkCard('onLoan');
  });

  it('Not Available status on WorkCard', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {});
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    assertHomeStatusOnWorkCard('notAvailable');
  });

  // --------------------------------------------------------------------------
  // Test Home Status on ShortList page
  // --------------------------------------------------------------------------

  it('Home Status on ShortList', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {onShelf: true});
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    clickFirstBooksBookmark();
    clickShortListButtonInKioskMode();
    assertHomeStatus('onShelf');
    clickClearShortlistButton();
  });

  // --------------------------------------------------------------------------
  // Test Find Book button on WorkCard page
  // --------------------------------------------------------------------------

  it('Find Book button on Kiosk Workpage - book onShelf', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {onShelf: true});
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    clickFirstBook();
    assertHomeStatus('onShelf');
    assertFindBookButton(true);
  });

  it('Find Book button on Kiosk Workpage - book notForLoan', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {notForLoan: true});
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    clickFirstBook();
    assertHomeStatus('notForLoan');
    assertFindBookButton(true);
  });

  it('Find Book button on Kiosk Workpage - book onLoan', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {onLoan: true});
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    clickFirstBook();
    assertHomeStatus('onLoan');
    assertFindBookButton(false);
  });

  it('Find Book button on Kiosk Workpage - book notAvailable', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {});
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    clickFirstBook();
    assertHomeStatus('notAvailable');
    assertFindBookButton(false);
  });

  // --------------------------------------------------------------------------
  // Test Find Book button - open Location Modal window
  // --------------------------------------------------------------------------

  it('Click Find Book button - One single location - onShelf', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {
      onShelf: true,
      department: 'Department',
      location: 'Location',
      subLocation: 'Sublocation'
    });
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    clickFirstBook();
    clickFindBookButton();
    assertFindBookModal('Department > Location > Sublocation');
  });

  it('Click Find Book button - One single location - notForLoan', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {
      notForLoan: true,
      department: 'Department',
      location: 'Location',
      subLocation: 'Sublocation'
    });
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    clickFirstBook();
    clickFindBookButton();
    assertFindBookModal('Department > Location > Sublocation');
  });

  it('Click Find Book button - Multiple locations with duplicates', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, [
      {
        onShelf: true,
        department: 'Department',
        location: 'Location',
        subLocation: 'Sublocation'
      },
      {
        onShelf: true,
        department: 'Department 2',
        location: 'Location 2',
        subLocation: 'Sublocation 2'
      },
      {
        onShelf: true,
        department: 'Department',
        location: 'Location',
        subLocation: 'Sublocation'
      }
    ]);
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    clickFirstBook();
    clickFindBookButton();
    assertFindBookModal([
      'Department > Location > Sublocation',
      'Department 2 > Location 2 > Sublocation 2'
    ]);
  });

  it('Click Find Book button - Multiple locations with duplicates - but only one available', function() {
    setKioskMode();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, [
      {
        department: 'Department',
        location: 'Location',
        subLocation: 'Sublocation'
      },
      {
        onShelf: true,
        department: 'Department 2',
        location: 'Location 2',
        subLocation: 'Sublocation 2'
      },
      {
        onLoan: true,
        department: 'Department',
        location: 'Location',
        subLocation: 'Sublocation'
      }
    ]);
    cy.visit('/');
    cy.wait('@kioskConfigurationRequest');
    clickFirstBook();
    clickFindBookButton();
    assertFindBookModal('Department 2 > Location 2 > Sublocation 2');
  });

  // --------------------------------------------------------------------------
  // Test Non Kiosk mode - neither  Home Status nor Find Book button
  // --------------------------------------------------------------------------

  it('Non-Kiosk mode - Home Status in WorkCard', function() {
    cy.server();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {onShelf: true});
    cy.visit('/');
    assertHomeStatusOnWorkCard('non-kiosk');
  });

  it('Non-Kiosk mode - Home Status in ShortList', function() {
    cy.server();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {onShelf: true});
    cy.visit('/');
    clickFirstBooksBookmark();
    clickShortListButtonInNonKioskMode();
    assertHomeStatus('non-kiosk');
    clickClearShortlistButton();
  });

  it('Non-Kiosk mode - Find Book button on Kiosk Workpage - book onShelf', function() {
    cy.server();
    mockRecompas([{pid, value: 3, work}]);
    mockHoldings(pid, {onShelf: true});
    cy.visit('/');
    clickFirstBook();
    assertHomeStatus('non-kiosk');
    assertNoFindBookButton();
  });
});
