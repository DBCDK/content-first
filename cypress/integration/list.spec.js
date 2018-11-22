

describe('List test', function() {

    it('Can create a new list', function() {

        const listName = "new list";
        const listDescribtion ="List description";
        
        cy.createUser('testListUser');

        cy.get('[data-cy=topbar-lists]').click()
        cy.get('[data-cy=lists-dropdown-new-list]').click()
        cy.get('[data-cy=listinfo-title-input]').type(listName)
        cy.get('[data-cy=listinfo-description-input]').type(listDescribtion)
        cy.get('[data-cy=stickyPanel-submit]').click()

        cy.get('[data-cy=listinfo-title]').should('have.text', listName);
        cy.get('[data-cy=listinfo-description]').should('have.text', listDescribtion);

    })
  })

