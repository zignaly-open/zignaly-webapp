/// <reference types="cypress" />

import { makeServer } from "utils/mirage/server";
import initialAuthData from "../fixtures/authState";

/**
 * @typedef {import('miragejs/server').Server} Server
 */

describe("Connect to a Provider", () => {
  /**
   * @type {Server}
   */
  let server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
    server.create("user");
    const provider = server.create("provider");

    cy.visit(`/profitSharing/${provider.id}`, {
      onBeforeLoad: (win) => {
        win.initialState = initialAuthData;
      },
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("can connect to a service", () => {
    cy.get("button")
      .contains(/Copy this trader/i)
      .click();
    cy.get("button")
      .contains(/Go to My Exchange Accounts/i)
      .should("exist");
  });
});
