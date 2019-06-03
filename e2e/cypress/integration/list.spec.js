describe('List test', function() {
  beforeEach(function() {
    cy.initStorage();
    cy.clearClientStorage();
    cy.clearCookies();
    cy.createUser('listowner');
    cy.wait(1000);
  });

  it('Can create a new list', function() {
    const listName = 'New list';
    const listDescription = 'List description';

    cy.get('[data-cy=topbar-lists]').click();
    cy.get('[data-cy=lists-dropdown-new-list]').click();

    cy.get('[data-cy=listinfo-title-input]')
      .clear()
      .type(listName);
    cy.get('[data-cy=listinfo-description-input]')
      .clear()
      .type(listDescription);
    cy.get('[data-cy=modal-done-btn]').click();

    cy.get('[data-cy=watch-new-list-link]').click();
    cy.reload();

    cy.get('[data-cy=banner-title]').contains(listName);
    cy.get('[data-cy=listinfo-description]').contains(listDescription);
  });

  it('Can be viewed only by owner when it is private', function() {
    cy.request('POST', 'http://localhost:3000/v1/object', {
      type: 'CUSTOM_LIST',
      title: 'Privat liste',
      description: 'masser af de gode',
      list: [],
      _type: 'list',
      _public: false
    }).then(response => {
      const id = response.body.data._id;
      cy.visit(`/lister/${id}`);
      cy.get('[data-cy=banner-title]').contains('Privat liste');
      cy.get('[data-cy=context-menu-list]').should('exist');
      cy.createUser('otheruser');
      cy.get('[data-cy=list-error]').contains('Listen kunne ikke hentes');
    });
  });

  it('Can be viewed by others when it is public', function() {
    cy.request('POST', 'http://localhost:3000/v1/object', {
      type: 'CUSTOM_LIST',
      title: 'Offentlig liste',
      description: 'masser af de gode',
      list: [],
      _type: 'list',
      _public: true
    }).then(response => {
      const id = response.body.data._id;
      cy.visit(`/lister/${id}`);
      cy.get('[data-cy=context-menu-list]').should('exist');
      cy.get('[data-cy=banner-title]').contains('Offentlig liste');
      cy.get('[data-cy=listview-add-element-input]').should('exist');

      cy.createUser('otheruser');
      cy.get('[data-cy=banner-title]').contains('Offentlig liste');
      cy.get('[data-cy=context-menu-list]').should('not.exist');
      cy.get('[data-cy=listview-add-element-input]').should('not.exist');
    });
  });

  it('Can add element to open list, when not owner', function() {
    cy.request('POST', 'http://localhost:3000/v1/object', {
      type: 'CUSTOM_LIST',
      title: 'Offentlig liste',
      description: 'masser af de gode',
      list: [],
      open: true,
      _type: 'list',
      _public: true
    }).then(response => {
      const id = response.body.data._id;
      cy.visit(`/lister/${id}`);
      cy.createUser('otheruser');
      cy.get('[data-cy=listview-add-element-input]').type('a');
      cy.get('.suggestion-row')
        .first()
        .click();
      cy.get('[data-cy=element-context-menu]').click();
      cy.get('[data-cy=context-action-remove-element]').should('exist');
      cy.get('[data-cy=context-action-edit-element]').should('exist');

      cy.login('listowner');
      cy.get('[data-cy=list-element]');
      cy.get('[data-cy=element-context-menu]').click();
      cy.get('[data-cy=context-action-remove-element]').should('exist');
      cy.get('[data-cy=context-action-edit-element]').should('not.exist');
    });
  });

  it('Can add with addToListButton to public list', function() {
    cy.visit(`/værk/870970-basis:25775481`);
    cy.get('[data-cy=add-to-list-btn]').click();
    cy.get('[data-cy=add-to-new-list]').click();
    cy.get('[data-cy=public-radio-btn]').click();
    cy.get('[data-cy=modal-done-btn]').click();
    cy.get('[data-cy=watch-new-list-link]').click();
    cy.reload();
    cy.get('.list-container')
      .find('.listElement')
      .its('length')
      .should('eq', 1);
  });

  it('Can move elements from shortlist to an other list', function() {
    cy.visit('/huskeliste');
    cy.addElementsToShortlist(3);
    cy.get('[data-cy=add-all-to-list]').click();
    cy.get('[data-cy=add-all-to-list] [data-cy=add-to-list-button]')
      .first()
      .click();
    cy.contains('3 bøger tilføjet til listen');
  });

  it('Can change element order in a list', function() {
    const firstElement = 'Krig og fred';
    const secondElement = 'Idioten';
    const thirdElement = 'En vild fårejagt';

    cy.request('POST', 'http://localhost:3000/v1/object', {
      type: 'CUSTOM_LIST',
      title: 'Privat liste',
      description: 'masser af de gode',
      list: [],
      _type: 'list',
      _public: false
    }).then(response => {
      const id = response.body.data._id;
      cy.visit(`/lister/${id}`);

      //add elements
      cy.get('[data-cy=listview-add-element-input]')
        .clear()
        .type(firstElement);
      cy.get('[data-cy=listview-add-element-input]').type('{enter}');

      cy.get('[data-cy=listview-add-element-input]')
        .clear()
        .type(secondElement);
      cy.get('[data-cy=listview-add-element-input]').type('{enter}');

      cy.get('[data-cy=listview-add-element-input]')
        .clear()
        .type(thirdElement);
      cy.get('[data-cy=listview-add-element-input]').type('{enter}');

      //Change elements order
      cy.get('[data-cy=context-menu-list]')
        .first()
        .click()
        .within(el => {
          cy.get('[data-cy=context-menu-action]')
            .eq(1)
            .click();
        });
      cy.get('[data-cy=reorder-list-element]')
        .eq(1)
        .within(el => {
          cy.get('[data-cy=order-list-element-moveup]').click();
        });

      cy.get('[data-cy= modal-done-btn').click();
      cy.reload();

      //assert change
      cy.get('[data-cy=list-element-work-title]')
        .first()
        .invoke('text')
        .then(sortedListFirstElement => {
          expect(secondElement).to.eq(sortedListFirstElement);
        });
    });
  });
});
