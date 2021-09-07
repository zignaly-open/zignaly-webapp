/// <reference types="cypress" />

import { makeServer } from "utils/mirage/server";
import initialAuthData from "../fixtures/authState";

/**
 * @typedef {import('miragejs/server').Server} Server
 */

describe("List Providers", () => {
  /**
   * @type {Server}
   */
  let server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
    server.create("user");
    server.createList("provider", 10);

    // cy.window()
    //   .its("store")
    //   .invoke("dispatch", { type: "SET_USER_DATA_ACTION", payload: { email: user.email } });

    cy.visit("/profitSharing", {
      onBeforeLoad: (win) => {
        win.initialState = initialAuthData();
      },
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("renders all services", () => {
    cy.get(".traderCard").should("have.length", 10);
  });

  it("navigates to service profile", () => {
    cy.get(".traderCard").contains("View Trader").click();
    const provider = server.db.providers.where({})[0];
    cy.get("h1").contains(`${provider.name}`).should("exist");
  });
});
