import { makeServer } from "utils/test/mirage";
import type { Server } from "miragejs/server";

describe("Login", () => {
  let server: Server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
    cy.visit("/");
  });

  afterEach(() => {
    server.shutdown();
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
    server.create("user", { id: 1, email: "joe@example.com" });

    cy.get("[name=email]").type("joe@example.com");
    cy.get("[name=password]").type("password123");
    cy.get("form").contains("Login").click();
    cy.hash().should("eq", "/dashboard");
  });
});
