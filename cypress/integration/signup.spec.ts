/// <reference types="cypress" />

import { makeServer } from "utils/mirage/server";
import { makeProvider } from "../factories/provider";
import { makeFakeUser } from "../factories/user";

/**
 * @typedef {import('miragejs/server').Server} Server
 */

describe("Signup", () => {
  /**
   * @type {Server}
   */
  // let server;

  beforeEach(() => {
    // server = makeServer({ environment: "test" });
    cy.intercept("POST", "*/signup", { token: Cypress.env("token") });

    cy.visit("/signup");
  });

  afterEach(() => {
    // server.shutdown();
  });

  it("requires valid email", () => {
    cy.get("[name=email]").type("@example.com{enter}");
    cy.get("form").contains("Register").click();
    cy.get(".errorText").should("contain", "Email should be valid");
  });

  it("requires password", () => {
    cy.get("[name=email]").type("joe@example.com");
    cy.get("form").contains("Register").click();
    cy.get(".errorText").should("contain", "Enter a password");
  });

  it("requires strong password", () => {
    cy.get("[name=password]").type("password123");
    cy.get("form").contains("Register").click();
    cy.get(".errorText").should("contain", "password is weak");
  });

  it("requires same password twice", () => {
    cy.get("[name=email]").type("joe@example.com");
    cy.get("[name=password]").type("Pa839.rd#@?873");
    cy.get("[name=repeatPassword]").type("Pa839{enter}");
    cy.get(".errorText").should("contain", "do not match");
  });

  it("redirects after signup", () => {
    // server.createList("provider", 5);
    const email = "joe@example.com";
    const password = "Pa839.rd#@?873";
    const firstName = "Joe";
    cy.get("[name=firstName]").type(firstName);
    cy.get("[name=email]").type(email);
    cy.get("[name=password]").type(password);
    cy.get("[name=repeatPassword]").type(`${password}{enter}`);

    const user = makeFakeUser({ email, firstName });
    cy.mockSession(user);
    cy.mock();

    const providers = [...Array(10)].map(() => makeProvider({}, { type: "profitSharing" }));
    cy.mockProviders(providers);

    cy.url().should("eq", Cypress.config("baseUrl") + "/profitSharing");
  });

  it("asks for verification code", () => {
    const email = "joe@example.com";
    const password = "Pa839.rd#@?873";
    const firstName = "Joe";

    const user = makeFakeUser({ email, firstName });
    cy.intercept("POST", "*/user/verify_code/verify_email", "true");
    cy.mockSession(user);
    cy.mock();

    cy.get("[name=firstName]").type(firstName);
    cy.get("[name=email]").type(email);
    cy.get("[name=password]").type(password);
    cy.get("[name=repeatPassword]").type(`${password}{enter}`);

    cy.get(".MuiDialog-root").focused().type("000000");

    const providers = [...Array(10)].map(() => makeProvider({}, { type: "profitSharing" }));
    cy.mockProviders(providers);

    cy.url().should("eq", Cypress.config("baseUrl") + "/profitSharing");
  });
});
