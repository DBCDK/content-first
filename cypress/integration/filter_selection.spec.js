describe('Filter page test', function() {
    it('Fetches correct tag', function() {
     
     cy.visit('/')

     cy.contains('Søg').click()
     cy.contains('Stemning').click()
     cy.contains('filosofisk').click()
     cy.get('.Filters__dimmer-show').click()
     cy.get('.WorkCard').first().click()
     cy.contains('Se alle tags').click()

     cy.get('button').contains('filosofisk').should('have.text', 'filosofisk')
     // cy.login();
    })
  })

