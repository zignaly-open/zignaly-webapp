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
    const provider = makeProvider();
    cy.mock({ connectedProviders: [provider] });
    const user = makeFakeUser();

    // Stub provider options
    const providerOptions = makeProviderOptions([provider]);
    cy.intercept("GET", "*/user/exchanges/*/providers_option*", providerOptions).as(
      "mockedProviderOptions",
    );
    // Stub create position
    cy.intercept("POST", "*/user/exchanges/*/positions", "true");

    cy.visit("/tradingTerminal", {
      onBeforeLoad: (win: any) => {
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

  it("check for correct values", () => {
    cy.get("input").type("100");
    cy.get("button[type='submit']").click();

    cy.get("input[name='positionSize']").parent().should("have.class", "Mui-error");
    cy.contains(/Position size value is required/i).should("exist");
  });
});
