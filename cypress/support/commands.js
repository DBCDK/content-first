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

Cypress.Commands.add('dispatch', action => {
  cy.window()
    .its('__store__')
    .then(store => {
      store.dispatch(action);
    });
});
/**
 * Clears session- and localestorage
 */
Cypress.Commands.add('clearClientStorage', () => {
  cy.window().then(win => {
    win.sessionStorage.clear();
  });
  cy.clearLocalStorage();
});
/**
 * creates a new user and logs in
 */
Cypress.Commands.add('createUser', userName => {
  if (!userName) userName = 'user' + Math.floor(Math.random() * 1000);
  cy.visit('http://localhost:3002/v1/test/create/' + userName);
});
/**
 * logs in without creating a user
 */
Cypress.Commands.add('login', userName => {
  cy.request('http://localhost:3002/v1/test/login/' + userName);
});

Cypress.Commands.add('cprlogin', (userName, overBool) => {
    if (!userName) userName = 'user' + Math.floor(Math.random() * 1000);
    cy.visit('http://localhost:3002/v1/test/cprlogin/' + userName+"/"+overBool);
});



/**
 *Adds 'count' elements to the shortlist
 */
Cypress.Commands.add('addElementsToShortlist', count => {
  cy.fixture('works').then(elements => {
    count = count > elements.length ? elements.length : count;

    const works = elements.slice(0, count);
    works.map(work => {
      cy.dispatch({
        type: 'ON_SHORTLIST_TOGGLE_ELEMENT',
        element: work,
        origin: 'Fra "Familiens skyggesider"'
      });
    });
  });
});
