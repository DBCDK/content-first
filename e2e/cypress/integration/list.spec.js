describe('List test', function() {
  beforeEach(function() {
    cy.request('/v1/test/delete/listowner');

    cy.createUser('listowner');
    cy.wait(1000);
  });

  const gotoListByName = listName => {
    cy.get('[data-cy=topbar-lists]').click();
    cy.get(`[data-cy="list-overview-element-${listName}"]`).click();
    cy.get('[data-cy=topbar-lists]').click();
  };

  const waitForListsLoaded = listName => {
    cy.get('[data-cy=topbar-lists]').click();
    cy.contains('Har læst');
    cy.get('[data-cy=topbar-lists]').click();
  };

  it('Can create a new list', function() {
    const listName = 'superduperlist-' + Math.floor(Math.random() * 1000);
    const listDescription = 'List description';
    cy.wait(1000);
    cy.get('[data-cy=topbar-lists]').click();
    cy.get('[data-cy=lists-dropdown-new-list]').click();
    cy.wait(1000);
    cy.get('[data-cy=listinfo-title-input]').clear();
    cy.get('[data-cy=listinfo-title-input]').type(listName);
    cy.get('[data-cy=listinfo-description-input]')
      .clear()
      .type(listDescription);
    cy.get('[data-cy=modal-done-btn]').click();

    gotoListByName(listName);

    cy.reload();

    cy.get('[data-cy=banner-title]').contains(listName);
    cy.get('[data-cy=listinfo-description]').contains(listDescription);
  });

  it('Can add, edit and remove list element', function() {
    cy.request('POST', '/v1/object', {
      type: 'CUSTOM_LIST',
      title: 'Privat liste',
      description: 'masser af de gode',
      list: [],
      _type: 'list',
      _public: false
    }).then(response => {
      const id = response.body.data._id;
      cy.visit(`/lister/${id}`);

      const firstElement = 'Krig og fred';
      const newDescription = 'hello new description';
      cy.get('[data-cy=listview-add-element-input]')
        .clear()
        .type(firstElement);
      cy.get(`[data-cy="suggestion-row-${firstElement}"]`)
        .first()
        .click();
      cy.reload();
      cy.get('[data-cy=element-context-menu]').click();
      cy.get('[data-cy=context-action-edit-element]').click();
      cy.get('[data-cy=element-description-input]')
        .first()
        .clear()
        .type(newDescription);
      cy.get('#comment-submit').click();
      cy.reload();
      cy.contains(newDescription);

      cy.get('[data-cy=element-context-menu]').click();
      cy.get('[data-cy=context-action-remove-element]').click();
      cy.reload();
      cy.contains('Privat liste');
      cy.get('[data-cy=list-element]').should('not.exist');
    });
  });

  it('Can be viewed only by owner when it is private', function() {
    cy.request('POST', '/v1/object', {
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
    cy.request('POST', '/v1/object', {
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

  it('Can follow and unfollow public lists', function() {
    cy.request('POST', '/v1/object', {
      type: 'CUSTOM_LIST',
      title: 'Offentlig liste',
      description: 'masser af de gode',
      list: [],
      _type: 'list',
      _public: true
    }).then(response => {
      const id = response.body.data._id;
      cy.visit(`/lister/${id}`);
      cy.createUser('otheruser');
      cy.get('[data-cy=follow-btn]').contains('Følg liste');
      cy.get('[data-cy=follow-btn]').click();
      cy.wait(500);
      cy.get('[data-cy=follow-btn]').contains('Følger liste');
      cy.get('[data-cy=follow-btn]').click();
      cy.wait(500);
      cy.get('[data-cy=follow-btn]').contains('Følg liste');
      cy.get('[data-cy=follow-btn]').click();
      cy.wait(500);
      cy.get('[data-cy=follow-btn]').contains('Følger liste');
      cy.get('[data-cy=follow-btn]').click();
      cy.wait(500);
      cy.get('[data-cy=follow-btn]').contains('Følg liste');
      cy.get('[data-cy=follow-btn]').click();
      cy.wait(500);
      cy.get('[data-cy=follow-btn]').contains('Følger liste');
      cy.reload();
      cy.get('[data-cy=follow-btn]').contains('Følger liste');
    });
  });

  it('Can add element to open list, when not owner', function() {
    waitForListsLoaded();
    cy.wait(1000);
    cy.request('POST', '/v1/object', {
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
      waitForListsLoaded();
      cy.get('[data-cy=listview-add-element-input]').type('a');
      cy.get('.suggestion-row')
        .first()
        .click();
      cy.get('[data-cy=element-context-menu]').click();
      cy.get('[data-cy=context-action-remove-element]').should('exist');
      cy.get('[data-cy=context-action-edit-element]').should('exist');
      cy.get('[data-cy=list-element]').contains('otheruser');
      cy.login('listowner');
      waitForListsLoaded();
      cy.get('[data-cy=list-element]');
      cy.get('[data-cy=list-element]').contains('otheruser');
      cy.get('[data-cy=element-context-menu]').click();
      cy.get('[data-cy=context-action-remove-element]').should('exist');
      cy.get('[data-cy=context-action-edit-element]').should('not.exist');
    });
  });

  it('Can add with addToListButton to public list', function() {
    cy.visit(`/v%C3%A6rk/870970-basis:25775481`);
    waitForListsLoaded();
    cy.wait(1000);
    cy.request('/v1/initial-state').then(resp => {
      expect(Object.values(resp.body.data.listReducer.lists)).to.have.length(2);
    });
    cy.get('[data-cy=add-to-list-btn]').click();
    cy.get('[data-cy=add-to-new-list]').click();
    cy.wait(1000);
    cy.server()
      .route('POST', '/v1/object/')
      .as('postList');

    cy.get('[data-cy=modal-done-btn]').click();
    const waitForListPost = () => {
      cy.wait('@postList').then(xhr => {
        if (xhr.request.body._type !== 'list') {
          // this was not a posted list object, wait again

          waitForListPost();
        }
      });
    };
    waitForListPost();
    cy.wait(3000);
    cy.request('/v1/initial-state').then(resp => {
      expect(Object.values(resp.body.data.listReducer.lists)).to.have.length(3);
    });
  });

  it('Can move elements from shortlist to an other list', function() {
    cy.fixture('shortlist.json').as('shortlist');
    cy.server();
    cy.route('GET', '/v1/shortlist', '@shortlist').as('shortlistRequest');
    cy.visit('/huskeliste');
    cy.wait('@shortlistRequest');
    cy.get('[data-cy=add-all-to-list]').click();
    cy.get(
      '[data-cy=add-all-to-list] [data-cy="add-to-list-button-Har læst"]'
    ).click();
    cy.get('[data-cy=topbar-lists]').click();
    cy.get('[data-cy="list-overview-element-Har læst"]').click();
    cy.request('/v1/initial-state').then(initState => {
      const didRead = Object.values(
        initState.body.data.listReducer.lists
      ).filter(l => l.title === 'Har læst')[0];

      expect(didRead.list).to.have.length(20);
    });
  });

  it('Can change element order in a list', function() {
    const firstElement = 'Krig og fred';
    const secondElement = 'Idioten';
    const thirdElement = 'En vild fårejagt';

    cy.request('POST', '/v1/object', {
      type: 'CUSTOM_LIST',
      title: 'Privat liste',
      description: 'masser af de gode',
      list: [],
      _type: 'list',
      _public: false
    }).then(response => {
      const id = response.body.data._id;
      cy.visit(`/lister/${id}`);
      waitForListsLoaded();

      //add elements
      cy.get('[data-cy=listview-add-element-input]')
        .clear()
        .type(firstElement);
      cy.get(`[data-cy="suggestion-row-${firstElement}"]`)
        .first()
        .click();

      cy.get('[data-cy=listview-add-element-input]')
        .clear()
        .type(secondElement);
      cy.get(`[data-cy="suggestion-row-${secondElement}"]`)
        .first()
        .click();

      cy.get('[data-cy=listview-add-element-input]')
        .clear()
        .type(thirdElement);
      cy.get(`[data-cy="suggestion-row-${thirdElement}"]`)
        .first()
        .click();

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

      cy.get('[data-cy=modal-done-btn').click();
      cy.wait(1000);
      cy.reload();

      //assert change
      cy.get('[data-cy=list-element-work-title]').contains(secondElement);
      cy.get('[data-cy=list-element-work-title]')
        .first()
        .invoke('text')
        .then(sortedListFirstElement => {
          expect(secondElement).to.eq(sortedListFirstElement);
        });
    });
  });

  it('Will not show followed list, when list is gone', function() {
    waitForListsLoaded();
    const list = {
      type: 'CUSTOM_LIST',
      title: 'Offentlig liste',
      description: 'masser af de gode',
      list: [],
      open: true,
      _type: 'list',
      _public: true
    };
    cy.wait(1000);
    cy.request('POST', '/v1/object', list).then(response => {
      const id = response.body.data._id;
      cy.visit(`/lister/${id}`);
      cy.createUser('otheruser');
      waitForListsLoaded();
      cy.get('[data-cy=follow-btn]').click();

      cy.wait(1000);

      cy.login('listowner');

      cy.wait(1000);

      cy.request('POST', '/v1/object', {...list, _id: id, _public: false}).then(
        response => {
          cy.login('otheruser');
          waitForListsLoaded();
          cy.get('[data-cy=topbar-lists]').click();
          cy.contains('Har læst');
          cy.get('.top-bar-dropdown-list-element')
            .its('length')
            .should('eq', 2);
        }
      );
    });
  });

  it('Can show lists containing deprecated "id" field', function() {
    cy.fixture('initialstate/deprecated_list_id.json').as('initialstate');
    cy.server();
    cy.route('GET', '/v1/initial-state', '@initialstate').as('listRequest');
    cy.visit('/');
    cy.wait('@listRequest');
    cy.get('[data-cy=topbar-lists]').click();
    cy.contains('Har læst');
    cy.contains('Vil læse');
  });

  it('Cleans up duplicate system lists', function() {
    // the initial state will create system lists
    cy.request('/v1/initial-state');

    // but we create an extra system list
    // and also a custom list
    cy.request('POST', '/v1/object', {
      type: 'SYSTEM_LIST',
      title: 'Vil læse',
      description: '',
      list: [],
      _type: 'list'
    }).then(systemListRes => {
      const systemListId = systemListRes.body.data._id;
      cy.request('POST', '/v1/object', {
        type: 'CUSTOM_LIST',
        title: 'Offentlig liste',
        description: 'masser af de gode',
        list: [],
        open: true,
        _type: 'list',
        _public: true
      }).then(customListRes => {
        const customListId = customListRes.body.data._id;

        // the newly created system list should not be part of the initial state
        // but the custom list shall

        cy.request('/v1/initial-state').then(initState => {
          expect(
            Object.values(initState.body.data.listReducer.lists)
          ).to.have.length(3);
          expect(initState.body.data.listReducer.lists[customListId]).to.not.be
            .null;

          cy.request({
            url: `/v1/object/${systemListId}`,
            failOnStatusCode: false
          }).then(systemListResAfter => {
            expect(systemListResAfter.status).to.eq(404);
          });
        });
      });
    });
  });
});
