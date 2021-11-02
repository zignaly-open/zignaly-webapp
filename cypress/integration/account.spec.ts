/// <reference types="cypress" />

import { makeProvider } from "../factories/provider";
import { makeExchange, makeFakeUser } from "../factories/user";
import initialAuthData from "../fixtures/authState";

describe("User Account", () => {
  const mockNoFunds = () => {
    cy.intercept("GET", "*/user/exchanges/*/balance*", {
      "1BTC": 0,
      "1USDT": 0,
      totalFreeBTC: 0,
      totalFreeUSDT: 0,
      totalLockedBTC: 0,
      totalLockedUSDT: 0,
      totalPnlBTC: 0,
      totalPnlUSDT: 0,
    }).as("mockedBalance");
  };

  describe("Default exchange account with no funds and no providers connected", () => {
    beforeEach(() => {
      cy.mock({ connectedProviders: [] });
      mockNoFunds();
      cy.intercept("GET", "*/user/exchanges/*/positions?type=open", []);

      const user = makeFakeUser({
        exchanges: [makeExchange()],
      });
      cy.visit("/", {
        onBeforeLoad: (win: any) => {
          win.initialState = initialAuthData(user);
        },
      });
    });

    it("renders Add Funds button, no balance", () => {
      cy.contains("a", /Add Funds/i).should("exist");
      cy.get(".header")
        .contains(/Balance/i)
        .should("not.exist");
    });

    // it("renders Add Funds button, no balance on mobile", () => {
    //   cy.viewport("iphone-8");
    //   cy.contains("a", /Add Funds/i).should("exist");
    //   cy.get(".header")
    //     .contains(/Balance/i)
    //     .should("not.exist");
    // });
  });

  describe("Default exchange account with funds but no providers connected", () => {
    beforeEach(() => {
      cy.mock({ connectedProviders: [] });
      cy.intercept("GET", "*/user/exchanges/*/positions?type=open", []);

      const user = makeFakeUser({
        exchanges: [makeExchange()],
      });
      cy.visit("/", {
        onBeforeLoad: (win: any) => {
          win.initialState = initialAuthData(user);
        },
      });
    });

    it("render Find Traders button, balance", () => {
      cy.contains("a", /Find traders/i).should("exist");
      cy.contains(".header", /Balance/i).should("exist");
      cy.contains("a", /Add Funds/i).should("not.exist");
    });
  });

  describe("Default exchange account with no funds but providers connected", () => {
    beforeEach(() => {
      const exchange = makeExchange();

      const provider = makeProvider();
      cy.mock({ connectedProviders: [provider], exchangeInternalId: exchange.internalId });
      mockNoFunds();
      cy.intercept("GET", "*/user/exchanges/*/positions?type=open", []);

      const user = makeFakeUser({
        exchanges: [exchange],
      });
      cy.visit("/", {
        onBeforeLoad: (win: any) => {
          win.initialState = initialAuthData(user);
        },
      });
    });

    it("doesn't render Add Funds button, render balance", () => {
      // cy.wait("@mockedBalance");
      cy.contains(".header", /Balance/i).should("exist");
      cy.contains("a", /Add Funds/i).should("not.exist");
    });
  });

  describe("No exchange account", () => {
    beforeEach(() => {
      cy.mock();

      const user = makeFakeUser({ exchanges: [] });
      cy.visit("/", {
        onBeforeLoad: (win: any) => {
          win.initialState = initialAuthData(user);
        },
      });
    });

    it("renders Connect Account", () => {
      cy.contains("a", /Connect Account/i).should("exist");
      cy.contains("a", /Add Funds/i).should("not.exist");
      cy.contains(".header", /Balance/i).should("not.exist");
    });
  });

  describe("One binance account", () => {
    beforeEach(() => {
      cy.mock();
      cy.intercept("GET", "*/user/exchanges/*/positions?type=open", []);

      const user = makeFakeUser({
        exchanges: [makeExchange({ exchangeName: "Binance", internalName: "Binance" })],
      });
      cy.visit("/", {
        onBeforeLoad: (win: any) => {
          win.initialState = initialAuthData(user);
        },
      });
    });

    it("renders Start with PS button and balance", () => {
      cy.contains("a", /Start with Profit Sharing/i).should("exist");
      cy.contains(".header", /Balance/i).should("exist");
    });
  });

  describe("Multiple exchange accounts", () => {
    beforeEach(() => {
      cy.mock();
      cy.intercept("GET", "*/user/exchanges/*/positions?type=open", []);

      const user = makeFakeUser();
      cy.visit("/", {
        onBeforeLoad: (win: any) => {
          win.initialState = initialAuthData(user);
        },
      });
    });

    it("renders balance, Find Traders button", () => {
      cy.contains(".header", /Balance/i).should("exist");
      // cy.get(".linksContainer a").should("not.exist");
      cy.contains("a", /Find traders/i).should("exist");
    });
  });
});
