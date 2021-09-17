/// <reference types="cypress" />

import { setSelectedExchange } from "../../src/store/actions/settings";
import { makeProvider } from "../factories/provider";
import { makeFakeUser } from "../factories/user";
import initialAuthData from "../fixtures/authState";
import dispatch from "../utils/dispatch";

describe("Connect to a Provider", () => {
  let user: User;

  describe("Test connection", () => {
    describe("Has exchange accounts", () => {
      beforeEach(() => {
        user = makeFakeUser();
        const provider = makeProvider({ userId: user.id });
        const provider2 = makeProvider({ userId: user.id });
        cy.mock();
        cy.intercept("GET", "**/user/providers/*", provider).as("mockedProvider");
        cy.intercept("GET", "**/user/*/providers", [provider2]).as("mockedOtherProviders");
        cy.intercept("POST", "**/exchanges/*/providers/*/connect_service", "true");

        cy.visit(`/profitSharing/${provider.id}`, {
          onBeforeLoad: (win: any) => {
            win.initialState = initialAuthData(user);
          },
        });
      });

      it("should asks to deposit if exchange account is not activated", () => {
        const exchangeNotActivated = user.exchanges.find((e) => !e.activated);
        dispatch(setSelectedExchange(exchangeNotActivated.internalId));

        cy.get("button")
          .contains(/Copy this trader/i)
          .click();
        cy.get("a")
          .contains(/Deposit/i)
          .should("exist");
      });

      it("should allow to connect to spot PS with a zignaly futures account", () => {
        const exchangeSpot = user.exchanges.find((e) => e.exchangeType === "spot");
        dispatch(setSelectedExchange(exchangeSpot.internalId));

        cy.get("button")
          .contains(/Copy this trader/i)
          .click();
        cy.findByPlaceholderText(/amount/i).should("exist");
      });

      it("should forbid connecting to spot CT with a zignaly futures account", () => {
        const exchangeFutures = user.exchanges.find((e) => e.exchangeType === "futures");
        dispatch(setSelectedExchange(exchangeFutures.internalId));

        const providerCT = makeProvider({ exchangeType: "spot" }, { type: "copyTrader" });
        cy.intercept("GET", "**/user/providers/*", providerCT).as("mockedProvider");
        cy.visit(`/copyTraders/${providerCT.id}`);

        cy.get("button")
          .contains(/Copy this trader/i)
          .click();

        cy.get("h3")
          .contains(/Wrong Exchange/i)
          .should("exist");
      });

      it("should forbid connecting to PS with a binance account", () => {
        const exchangeBinance = user.exchanges.find(
          (e) => e.exchangeName.toLowerCase() === "binance",
        );
        dispatch(setSelectedExchange(exchangeBinance.internalId));

        cy.get("button")
          .contains(/Copy this trader/i)
          .click();
        cy.get("h3")
          .contains(/Wrong Exchange/i)
          .should("exist");
      });

      it("should connect to a provider", () => {
        cy.get("button")
          .contains(/Copy this trader/i)
          .click();

        // Enter amount and submit
        cy.findByPlaceholderText(/amount/i).type("10");
        cy.get("button[type='submit']").click();

        // Check terms
        cy.get('[type="checkbox"]').check();

        // Type transfer and continue
        cy.get("button[type='submit']").should("be.disabled");
        cy.get("input[name='transfer']").type("transfer");
        cy.get("button[type='submit']").click();

        cy.findByText(/Transfer made/i).should("exist");
      });

      it("should check amount before copying a provider", () => {
        cy.get("button")
          .contains(/Copy this trader/i)
          .click();
        cy.findByPlaceholderText(/amount/i).type("100");
        cy.contains(/you do not have enough/i).should("exist");
        cy.get("button[type='submit']").should("be.disabled");
      });

      it("should agree to terms before submitting", () => {
        cy.get("button")
          .contains(/Copy this trader/i)
          .click();

        // Enter amount and submit
        cy.findByPlaceholderText(/amount/i).type("10");
        cy.get("button[type='submit']").click();

        // Check only first checkbox
        cy.get('[type="checkbox"]').first().check();
        cy.get("input[name='transfer']").type("transfer");

        cy.get("button[type='submit']").should("be.disabled");
      });
    });

    describe("No exchange accounts", () => {
      beforeEach(() => {
        // server = makeServer({ environment: "test" });
        // const provider = server.create("provider");
        // user = server.create("user");
        // user.update({
        //   exchanges: [],
        // });
        user = makeFakeUser({ exchanges: [] });
        const provider = makeProvider();
        cy.mock();
        cy.intercept("GET", "*/user/providers/*", provider).as("mockedUserProvider");

        cy.visit(`/profitSharing/${provider.id}`, {
          onBeforeLoad: (win: any) => {
            win.initialState = initialAuthData(user);
          },
        });
      });

      it("should ask to add exchange account", () => {
        cy.findByText(/Copy this trader/i).click();
        cy.findByText(/Go to My Exchange Accounts/i).should("exist");
      });
    });

    describe("Connected to a provider", () => {
      beforeEach(() => {
        // server = makeServer({ environment: "test" });
        // const provider = server.create("provider");
        // user = server.create("user");
        // server.create("providerConnection", { user, provider });
        user = makeFakeUser();
        const provider = makeProvider();
        cy.mock({ connectedProviders: [provider] });
        cy.intercept("GET", "*/user/providers/*", { ...provider, disable: false }).as(
          "mockedUserProvider",
        );

        cy.visit(`/profitSharing/${provider.id}`, {
          onBeforeLoad: (win: any) => {
            win.initialState = initialAuthData(user);
          },
        });
      });

      it("can disconnect to a service", () => {
        cy.get("button").contains(/Stop/i).should("exist");
      });
    });
  });

  afterEach(() => {
    // server.shutdown();
  });
});
