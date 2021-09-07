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
    const user = server.create("user");

    cy.visit("/tradingTerminal", {
      onBeforeLoad: (win) => {
        win.initialState = initialAuthData(user.attrs);
      },
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("renders trading panels with disabled button", () => {
    cy.get("button[type='submit']").should("be.disabled");
  });
});
