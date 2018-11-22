// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import Immutable from 'immutable';


Cypress.Commands.add("resetDB", () => {
    console.log("Reset Database")
})

Cypress.Commands.add("createUser", (userName) => {
 cy.visit('http://localhost:3002/v1/test/create/'+userName)
})


Cypress.Commands.add("login", (userName) => {
 cy.visit('http://localhost:3002/v1/test/login/'+userName)
})


Cypress.Commands.add("fetchAvability", (pid)=>  {
      
   cy.fixture('fetchAvabilityResponse').then((response)  => {
    //response.avabilityResponse.pid = pid

   console.log("resp.book",response);

   cy.window().its('__store__').then(
    store => {
        store.dispatch(response.avabilityResponse)

        store.dispatch({
        type: "ADD_USER_AGENCY",
        agencyName: 'Lyngby-Taarbæk Bibliotekerne'
     })
     store.dispatch({
       type: "ORDER",
       book:  response.book
     })
    store.dispatch(({
        type: response.picupBranches.type,
        branches: JSON.stringify(  response.picupBranches)
    })) 
    }
  );

})

})
   
   