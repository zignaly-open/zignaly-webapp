/// <reference types="cypress" />

type mockOptions = {
  connectedProviders: Array;
  enableStubbedCheck: Boolean;
};

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to mock common endpoints, such as exchanges, connected providers, etc.
     * Also includes a check to warn if any api request is not stubbed. (needs to be called before any ohter `cy.intercept`)
     */
    mock(options?: mockOptions): Chainable<void>;
  }
}
