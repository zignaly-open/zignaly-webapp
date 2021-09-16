/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to mock common endpoints, such as exchanges, connected providers, etc.
     * Also includes a check to warn if any api request is not stubbed. (needs to be called before any ohter `cy.intercept`)
     */
    mock(options?: MockOptions): Chainable<void>;

    mockSession(user?: User): Chainable<void>;
    mockProviders(providers?: Provider[]): Chainable<void>;
  }
}
