/// <reference types="cypress" />

import { makeServer } from "utils/mirage/server";
import { makeProvider } from "../factories/provider";
import { makeFakeUser } from "../factories/user";
import initialAuthData from "../fixtures/authState";

/**
 * @typedef {import('miragejs/server').Server} Server
 */

describe("List Providers", () => {
  /**
   * @type {Server}
   */
  let server;

  let providers;

  beforeEach(() => {
    // server = makeServer({ environment: "test" });
    // server.create("user");
    // server.createList("provider", 10);
    providers = [...Array(10)].map(() => makeProvider({}, { type: "profitSharing" }));
    cy.mock({ connectedProviders: providers.slice(0, 2) });
    cy.mockProviders(providers);

    // cy.window()
    //   .its("store")
    //   .invoke("dispatch", { type: "SET_USER_DATA_ACTION", payload: { email: user.email } });

    const user = makeFakeUser();
    cy.visit("/profitSharing", {
      onBeforeLoad: (win) => {
        win.initialState = initialAuthData(user);
      },
    });
  });

  afterEach(() => {
    // server.shutdown();
  });

  it("renders all services", () => {
    cy.get(".traderCard").should("have.length", 10);
  });

  it("navigates to service profile", () => {
    cy.intercept("GET", "*/user/providers/*", providers[0]).as("mockedUserProvider");
    cy.get(".traderCard")
      .contains(/View Trader/i)
      .click();
    // const provider = server.db.providers.where({})[0];
    cy.get("h1").contains(`${providers[0].name}`).should("exist");
  });
});
