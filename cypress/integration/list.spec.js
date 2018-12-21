describe('List test', function() {
  beforeEach(function() {
    cy.clearClientStorage();
    cy.clearCookies();
    cy.createUser();
    cy.wait(1000);
  });

  it('Can create a new list', function() {
    const listName = 'New list';
    const listDescription = 'List description';

    cy.get('[data-cy=topbar-lists]').click();
    cy.get('[data-cy=lists-dropdown-new-list]').click();

    cy.get('[data-cy=listinfo-title-input]').type(listName);
    cy.get('[data-cy=listinfo-description-input]').type(listDescription);
    cy.get('[data-cy=stickyPanel-submit]').click();

    cy.get('[data-cy=listinfo-title]').should('have.text', listName);
    cy.get('[data-cy=listinfo-description]').should(
      'have.text',
      listDescription
    );
  });

  it('Can move elements from shortlist to an other list', function() {
    cy.scrollTo(0, 700);

    cy.addElementsToShortlist(3);
    cy.get('[data-cy=topbar-lists]').click(); //TODO: remove and fix issue with system list not appearing in modal
    cy.get('[data-cy=topbar-lists]').click(); //TODO: remove and fix issue with system list not appearing in modal
    cy.get('[data-cy=topbar-shortlist]').click();
    cy.get('[data-cy=shortlist-dropdown-visit-shortlist]').click();
    cy.get('[data-cy=listpage-add-elemts-to-list]').click();
    cy.get('[data-cy=add-to-list-modal-system-lists')
      .first()
      .click();
    cy.get('[data-cy=modal-done-btn').click();

    cy.contains('3 bøger tilføjet til listen');
  });

  it('Can change element order in a list', function() {
    const listName = 'new list' + Math.floor(Math.random() * 1000);
    const listDescription = 'List description';
    const firstElement = 'Krig og fred';
    const secondElement = 'Idioten';
    const thirdElement = 'En vild fårejagt';

    cy.get('[data-cy=topbar-lists]').click();
    cy.get('[data-cy=lists-dropdown-new-list]').click();
    cy.get('[data-cy=listinfo-title-input]').type(listName);
    cy.get('[data-cy=listinfo-description-input]').type(listDescription);
    cy.get('[data-cy=stickyPanel-submit]').click();

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

    //assert change
    cy.get('[data-cy=list-element-work-title]')
      .first()
      .invoke('text')
      .then(sortedListFirstElement => {
        expect(secondElement).to.eq(sortedListFirstElement);
      });
  });
});