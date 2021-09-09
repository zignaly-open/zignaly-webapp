/// <reference types="cypress" />

import { makeServer } from "utils/mirage/server";
import { makeFakeUser } from "../factories/user";
import dayjs from "dayjs";
import { makeProvider } from "../factories/provider";

/**
 * @typedef {import('miragejs/server').Server} Server
 */

describe("Login", () => {
  /**
   * @type {Server}
   */
  let server;

  let user;

  beforeEach(() => {
    // server = makeServer({ environment: "test" });
    user = makeFakeUser({ email: "joe@example.com", password: "password123" });
    cy.visit("/");
    cy.intercept("POST", "*/login", (req) => {
      // req.continue((res) => {
      const { email, password } = req.body;
      if (email === user.email && password === user.password) {
        req.reply(200, { token: Cypress.env("token") });
      } else {
        req.reply(400, { error: { code: 8 } });
      }
      // });
    });
  });

  afterEach(() => {
    // server.shutdown();
  });

  it("requires password", () => {
    cy.get("[name=email]").type("joe@example.com{enter}");
    cy.get(".errorText").should("contain", "Password cannot be empty");
  });

  it("requires valid username/password", () => {
    cy.get("[name=email]").type("joe@example.com");
    cy.get("[name=password]").type("invalid{enter}");
    cy.get(".errorAlert").should("contain", "Wrong credentials");
  });

  it("redirects if correct login", () => {
    // server.create("user", { email: "joe@example.com", password: "password123" });
    cy.mock({ enableStubbedCheck: false });
    cy.mockSession(user);
    cy.intercept("GET", "*/user/exchanges/*/positions?type=open", []);

    cy.get("[name=email]").type("joe@example.com");
    cy.get("[name=password]").type("password123");
    cy.get("form").contains("Login").click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/dashboard");
  });
});
