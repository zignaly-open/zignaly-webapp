/// <reference types="cypress" />

import { makeServer } from "utils/mirage/server";
import { setSelectedExchange } from "../../src/store/actions/settings";
import initialAuthData from "../fixtures/authState";

const dispatch = (action) => cy.window().its("store").invoke("dispatch", action);

/**
 * @typedef {import('miragejs/server').Server} Server
 */

describe("Connect to a Provider", () => {
  /**
   * @type {Server}
   */
  let server;

  let user;

  describe("Test connection", () => {
    describe("Has exchange accounts", () => {
      beforeEach(() => {
        server = makeServer({ environment: "test" });
        const provider = server.create("provider");
        user = server.create("user");
        // server.create("providerConnection", { user, provider });

        cy.visit(`/profitSharing/${provider.id}`, {
          onBeforeLoad: (win) => {
            win.initialState = initialAuthData(user.attrs);
          },
        });
      });

      it("should asks to deposit if exchange account is not activated", () => {
        const exchangeNotActivated = user.exchanges.find((e) => !e.activated);
        dispatch(setSelectedExchange(exchangeNotActivated));

        cy.get("button")
          .contains(/Copy this trader/i)
          .click();
        cy.get("button")
          .contains(/Deposit/i)
          .should("exist");
      });

      it("should warn about wrong exchange account type", () => {
        const exchangeSpot = user.exchanges.find((e) => e.exchangeType === "spot");
        dispatch(setSelectedExchange(exchangeSpot));

        cy.get("button")
          .contains(/Copy this trader/i)
          .click();
        cy.get("h3")
          .contains(/Wrong Exchange/i)
          .should("exist");
      });
    });

    describe("No exchange accounts", () => {
      beforeEach(() => {
        server = makeServer({ environment: "test" });
        const provider = server.create("provider");
        user = server.create("user");
        user.update({
          exchanges: [],
        });

        cy.visit(`/profitSharing/${provider.id}`, {
          onBeforeLoad: (win) => {
            win.initialState = initialAuthData(user.attrs);
          },
        });
      });

      it("should ask to add exchange account", () => {
        cy.findByText(/Copy this trader/i).click();
        cy.findByText(/Go to My Exchange Accounts/i).should("exist");
      });
    });
  });

  // describe("Already connected", () => {
  //   it("can disconnect to a service", () => {
  //     cy.get("button")
  //       .contains(/Copy this trader/i)
  //       .click();
  //     cy.get("button")
  //       .contains(/Go to My Exchange Accounts/i)
  //       .should("exist");
  //   });
  // });

  afterEach(() => {
    server.shutdown();
  });
});
