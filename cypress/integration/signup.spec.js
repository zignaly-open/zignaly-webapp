/// <reference types="cypress" />

import { makeServer } from "utils/mirage/server";

/**
 * @typedef {import('miragejs/server').Server} Server
 */

describe("Signup", () => {
  /**
   * @type {Server}
   */
  let server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
    cy.visit("/signup");
  });

  afterEach(() => {
    server.shutdown();
  });

  it("requires valid email", () => {
    cy.get("[name=email]").type("@example.com{enter}");
    cy.get("form").contains("Sign Up").click();
    cy.get(".errorText").should("contain", "Email should be valid");
  });

  it("requires password", () => {
    cy.get("[name=email]").type("joe@example.com");
    cy.get("form").contains("Sign Up").click();
    cy.get(".errorText").should("contain", "Enter a password");
  });

  it("requires strong password", () => {
    cy.get("[name=password]").type("password123");
    cy.get("form").contains("Sign Up").click();
    cy.get(".errorText").should("contain", "password is weak");
  });

  it("requires same password twice", () => {
    cy.get("[name=email]").type("joe@example.com");
    cy.get("[name=password]").type("Pa839.rd#@?873");
    cy.get("[name=repeatPassword]").type("Pa839{enter}");
    cy.get(".errorText").should("contain", "do not match");
  });

  it("redirects after signup", () => {
    cy.get("[name=firstName]").type("Joe");
    cy.get("[name=email]").type("joe@example.com");
    cy.get("[name=password]").type("Pa839.rd#@?873");
    cy.get("[name=repeatPassword]").type("Pa839.rd#@?873{enter}");
    cy.url().should("eq", Cypress.config("baseUrl") + "/copyTraders");
  });
});
