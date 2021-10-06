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
    });
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
      cy.get("a")
        .contains(/Add Funds/i)
        .should("exist");
      cy.get(".header")
        .contains(/Balance/i)
        .should("not.exist");
    });
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

    it("render Find Traders button, no balance", () => {
      cy.get("a")
        .contains(/Find traders/i)
        .should("exist");
      cy.get(".header")
        .contains(/Balance/i)
        .should("not.exist");
      cy.get("a")
        .contains(/Add Funds/i)
        .should("not.exist");
    });
  });

  describe("Default exchange account with no funds but providers connected", () => {
    beforeEach(() => {
      const provider = makeProvider();
      cy.mock({ connectedProviders: [provider] });
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

    it("doesn't render Add Funds button, render balance", () => {
      cy.get("a")
        .contains(/Add Funds/i)
        .should("not.exist");
      cy.get(".header")
        .contains(/Balance/i)
        .should("exist");
    });
  });

  describe("No exchange account", () => {
    beforeEach(() => {
      cy.mock();

      const user = makeFakeUser({ exchanges: [] });
      // cy.viewport("iphone-8");
      cy.visit("/", {
        onBeforeLoad: (win: any) => {
          win.initialState = initialAuthData(user);
        },
      });
    });

    it("doesn't render anything in the menu", () => {
      cy.get(".header")
        .contains(/Balance/i)
        .should("not.exist");
      cy.get("a")
        .contains(/Add Funds/i)
        .should("not.exist");
    });
  });

  describe("One binance account", () => {
    beforeEach(() => {
      cy.mock();
      cy.intercept("GET", "*/user/exchanges/*/positions?type=open", []);

      const user = makeFakeUser({ exchanges: [makeExchange({ exchangeName: "Binance" })] });
      cy.visit("/", {
        onBeforeLoad: (win: any) => {
          win.initialState = initialAuthData(user);
        },
      });
    });

    it("render Start with PS button and balance", () => {
      cy.get("a")
        .contains(/Start with Profit Sharing/i)
        .should("exist");
      cy.get(".header")
        .contains(/Balance/i)
        .should("exist");
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

    it("render balance", () => {
      cy.get(".header")
        .contains(/Balance/i)
        .should("exist");
      // No buttons
      cy.get(".linksContainer a").should("not.exist");
    });
  });
});
