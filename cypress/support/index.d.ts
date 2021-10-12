/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to mock common endpoints, such as exchanges, connected providers, etc.
     * Also includes a check to warn if any api request is not stubbed. (Careful, it needs to be called before any other
     * `cy.intercept` or it will throw false positive error)
     */
    mock(options?: MockOptions): Chainable<void>;

    mockSession(user?: User): Chainable<void>;
    mockProviders(providers?: Provider[]): Chainable<void>;
  }
}
