import { makeServer } from "utils/test/mirage";
import type { Server } from "miragejs/server";

describe("My First Test", () => {
  let server: Server;

  beforeEach(() => {
    // cy.visit("http://localhost:3000/");
    server = makeServer({ environment: "test" });
    cy.visit("/");
  });

  afterEach(() => {
    server.shutdown();
  });

  it("Does not do much!", () => {
    expect(true).to.equal(true);
  });

  it("requires valid username/password", () => {
    cy.get("[name=email]").type("joe@example.com");
    cy.get("[name=password]").type("invalid{enter}");
    cy.get(".errorText").should("contain", "invalid");
  });
});
