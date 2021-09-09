/// <reference types="cypress" />

import { makeServer } from "utils/mirage/server";
import initialAuthData from "../fixtures/authState";
import { makeFakeUser } from "../factories/user";
import { makeProvider, makeProviderOptions } from "../factories/provider";
// import { IUser } from "src/pages/newYorkInfo";

/**
 * @typedef {import('miragejs/server').Server} Server
 */

describe("Trading Terminal", () => {
  /**
   * @type {Server}
   */
  let server;

  beforeEach(() => {
    // server = makeServer({ environment: "test" });
    // const user = server.create("user");
    // const provider = server.create("provider");

    // cy.intercept("POST", "/users").as("signup");
    // cy.intercept("GET", "/user/exchanges/:exchangeInternalId/providers_option", {
    //   fixture: "providers_option.json",
    // }).as("mockedProviderOptions");

    const provider = makeProvider();
    const providerOptions = makeProviderOptions([provider]);
    // cy.intercept("*/symbols*", { fixture: "symbols.json" });

    cy.intercept("GET", "*/user/exchanges/*/providers_option*", providerOptions).as(
      "mockedProviderOptions",
    );

    cy.mock({ providers: [provider] });

    const user = makeFakeUser({
      // deleted: true,
    });

    cy.visit("/tradingTerminal", {
      onBeforeLoad: (win) => {
        win.initialState = initialAuthData(user);
      },
    });
  });

  afterEach(() => {
    // server.shutdown();
  });

  it("renders trading panels with submit button", () => {
    cy.get("button[type='submit']", { timeout: 20000 }).should("be.visible");
  });
});
