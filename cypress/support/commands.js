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
import dayjs from "dayjs";

Cypress.Commands.add("mock", ({ connectedProviders = [], enableStubbedCheck = true } = {}) => {
  if (enableStubbedCheck) {
    // Check that nothing reaches real api
    // We coud use Cypress.Server.defaults if there wasn't a bug: https://github.com/cypress-io/cypress/issues/5289
    // Warning: Not detecting stubbed calls `beforeEach` when called from `it`.
    cy.intercept({ url: `${Cypress.env("GATSBY_TRADEAPI_URL_NEW")}/**` }, (req) => {
      throw new Error(`${req.url} was not stubbed.`);
    });
  }

  // Fixtures
  cy.intercept("GET", "*/exchanges", { fixture: "exchanges.json" });
  cy.intercept("*/symbols*", { fixture: "symbols.json" });

  const connectedProvidersData = connectedProviders.map((p) => ({
    connected: true,
    exchangeInternalId: `Zignaly${faker.random.alphaNumeric(10)}_${faker.random.alphaNumeric(13)}`,
    // exchangeInternalIds: [],
    id: p.id,
    name: p.name,
  }));
  cy.intercept("GET", "*/user/providers*", connectedProvidersData).as("mockedConnectedProviders");
  cy.intercept("GET", "*/user/exchange/*/available_balance", { USDT: 50 });
});

// Cypress.Commands.add("mockConnectedProviders", (providers) => {
//   const connectedProviders = providers.map((p) => ({
//     connected: true,
//     exchangeInternalId: `Zignaly${faker.random.alphaNumeric(10)}_${faker.random.alphaNumeric(13)}`,
//     // exchangeInternalIds: [],
//     id: p.id,
//     name: p.name,
//   }));

//   cy.intercept("GET", "*/user/providers*", connectedProviders).as("mockedUserProviders");
// });

Cypress.Commands.add("mockSession", (user) => {
  cy.intercept("GET", "*/user/session", { validUntil: dayjs().add(2, "h").valueOf() });
  cy.intercept("GET", "*/user", user);
});

Cypress.Commands.add("mockProviders", (providers) => {
  cy.intercept("GET", "*/providers/profit_sharing/*", providers).as("mockedProviders");
});
