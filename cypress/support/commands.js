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
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import faker from "faker";
import "@testing-library/cypress/add-commands";

Cypress.Commands.add("mock", () => {
  // todo: mockConnectedProviders here by passing optional providers?
  cy.intercept("*/symbols*", { fixture: "symbols.json" });
});

Cypress.Commands.add("mockConnectedProviders", (providers) => {
  const connectedProviders = providers.map((p) => ({
    connected: true,
    exchangeInternalId: `Zignaly${faker.random.alphaNumeric(10)}_${faker.random.alphaNumeric(13)}`,
    // exchangeInternalIds: [],
    id: p.id,
    name: p.name,
  }));

  cy.intercept("GET", "*/user/providers*", connectedProviders).as("mockedUserProviders");
});
