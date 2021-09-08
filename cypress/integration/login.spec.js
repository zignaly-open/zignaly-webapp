/// <reference types="cypress" />

import { makeServer } from "utils/mirage/server";
import { makeFakeUser } from "../factories/user";
import dayjs from "dayjs";

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
      req.continue((res) => {
        const { email, password } = req.body;
        if (email === user.email && password === user.password) {
          res.send(200, { token: Cypress.env("token") });
        } else {
          res.send(400, { error: { code: 8 } });
        }
      });
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

  it.only("redirects if correct login", () => {
    // server.create("user", { email: "joe@example.com", password: "password123" });
    cy.intercept("GET", "*/user/session", { validUntil: dayjs().add(2, "h").valueOf() });
    cy.intercept("GET", "*/user", user);
    cy.intercept("GET", "*/user/exchanges/*/positions?type=open", []);
    cy.intercept("GET", "*/user/providers*", []);

    cy.get("[name=email]").type("joe@example.com");
    cy.get("[name=password]").type("password123");
    cy.get("form").contains("Login").click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/dashboard");
  });
});
