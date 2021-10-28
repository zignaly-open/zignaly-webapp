/// <reference types="cypress" />

import { readyException } from "cypress/types/jquery";
import { setSelectedExchange } from "../../src/store/actions/settings";
import { makeProvider } from "../factories/provider";
import { makeFakeUser } from "../factories/user";
import initialAuthData from "../fixtures/authState";
import dispatch from "../utils/dispatch";

const mockEditProvider = (provider: Provider) => {
  cy.intercept("POST", "**/user/providers/*", (req) => {
    // Update provider object
    provider = {
      ...provider,
      ...req.body,
    };

    // Return new provider although currently we reload the page
    req.reply(provider);
    return provider;
  })
    .as("editProvider")
    .intercept("GET", "**/user/providers/*", (req) => {
      // Mock updated provider
      req.reply(provider);
    })
    .as("getProvider");
};

const saveData = () => {
  cy.get("button")
    .contains(/Save Data/i)
    .click();
  cy.get("button")
    .contains(/Accept/i)
    .click();
};

describe("Provider Profile", () => {
  describe("Has exchange accounts", () => {
    let user: User;
    let provider: Provider;

    beforeEach(() => {
      user = makeFakeUser();
      provider = makeProvider({ userId: user.id });
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

    it("should ask to deposit if exchange account is not activated", () => {
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
      cy.findByPlaceholderText(/amount/i).type("0");
      cy.get("button[type='submit']").should("be.disabled");

      cy.findByPlaceholderText(/amount/i).clear();
      cy.findByPlaceholderText(/amount/i).type("100");
      cy.contains(/you do not have enough/i).should("exist");
      cy.get("button[type='submit']").should("be.disabled");
    });

    it("should check max balance before copying a provider", () => {
      provider.allocatedBalance = 90;
      provider.maxAllocatedBalance = 100;
      cy.intercept("GET", "**/user/providers/*", provider).as("mockedProvider");

      cy.visit(`/profitSharing/${provider.id}`, {
        onBeforeLoad: (win: any) => {
          win.initialState = initialAuthData(user);
        },
      });

      cy.get("button")
        .contains(/Copy this trader/i)
        .click();
      cy.findByPlaceholderText(/amount/i).type("20");
      cy.contains(/The maximum allocated balance/i).should("exist");
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
      const user = makeFakeUser({ exchanges: [] });
      const provider = makeProvider();
      cy.mock();
      cy.intercept("GET", "**/user/providers/*", provider).as("mockedProvider");
      cy.intercept("GET", "**/user/*/providers", []).as("mockedOtherProviders");

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
      const user = makeFakeUser();
      const provider = makeProvider();
      cy.mock({ connectedProviders: [provider] });
      cy.intercept("GET", "*/user/providers/*", { ...provider, disable: false }).as(
        "mockedUserProvider",
      );
      cy.intercept("GET", "**/user/*/providers", []).as("mockedOtherProviders");

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

  const setupEdit = (user: User, provider: Provider) => {
    cy.mock();
    cy.intercept("GET", "**/user/providers/*", provider).as("getProvider");
    mockEditProvider(provider);

    cy.visit(`/profitSharing/${provider.id}/edit`, {
      onBeforeLoad: (win: any) => {
        win.initialState = initialAuthData(user);
      },
    });
  };

  describe("Edit provider", () => {
    let provider: Provider;

    beforeEach(() => {
      const user = makeFakeUser({ isAdmin: false });
      provider = makeProvider({ isAdmin: true, maxDrawdown: null });
      setupEdit(user, provider);
    });

    it("can edit", () => {
      // Accept set drawdown modal
      cy.contains(/Set Maximum Drawdown/i)
        .parents(".MuiDialog-root")
        .contains(/Confirm/i)
        .click();

      // Fill form
      cy.get("input[name='profitsShare']").clear().type("6");
      cy.get("input[name='maxDrawdown']").type("-30");
      cy.get("input[name='maxAllocatedBalance']").clear().type("20000");
      cy.get("input[name='maxPositions']").type("100");

      // Cannot list in marketplace
      cy.contains(/listed in marketplace/i).click();
      cy.contains(/these requirements/i)
        .parents(".MuiDialog-root")
        .contains(/Confirm/i)
        .click();

      cy.contains(/listed in profile/i).click();

      saveData();

      // Assert page
      cy.get("input[name='profitsShare']").should("have.value", 6);
      cy.get("input[name='maxDrawdown']").should("have.value", -30);
      cy.get("input[name='maxAllocatedBalance']").should("have.value", 20000);
      cy.get("input[name='maxPositions']").should("have.value", 100);
      cy.contains(/listed in profile/i).should("have.class", "MuiSlider-markLabelActive");
    });
  });

  describe("Edit provider as support", () => {
    let provider: Provider;

    beforeEach(() => {
      const user = makeFakeUser({ isAdmin: true });
      provider = makeProvider({ isAdmin: true });
      setupEdit(user, provider);
    });

    it("support can list to marketplace", () => {
      // Fill form
      cy.get("input[name='profitsShare']").clear().type("6");

      // Check maxDrawdown can only be reduced
      cy.get("input[name='maxDrawdown']").clear().type("-80");
      cy.contains(/Maximun drawdown can only be reduced/i);
      cy.get("input[name='maxDrawdown']").clear().type("-10");

      cy.get("input[name='maxAllocatedBalance']").clear().type("20000");
      cy.get("input[name='maxPositions']").type("100");

      cy.contains("span", /listed in profile/i).click();

      // Hack to select last slider option, clicking on it causes error:
      // Cannot read properties of null (reading 'getBoundingClientRect')
      cy.contains("span", /listed in marketplace/i)
        .parent()
        .trigger("keydown", { keyCode: 39 });
      cy.get("body").trigger("keyup", { keyCode: 39 });

      saveData();

      // Assert page
      cy.get("input[name='profitsShare']").should("have.value", 6);
      cy.get("input[name='maxDrawdown']").should("have.value", -10);
      cy.get("input[name='maxAllocatedBalance']").should("have.value", 20000);
      cy.get("input[name='maxPositions']").should("have.value", 100);
      cy.contains(/listed in marketplace/i).should("have.class", "MuiSlider-markLabelActive");
    });
  });

  describe("Listed provider", () => {
    let provider: Provider;

    beforeEach(() => {
      const user = makeFakeUser();
      provider = makeProvider({ isAdmin: true, privacy: "listed_profile" });
      setupEdit(user, provider);
    });

    it("can't be unlisted", () => {
      cy.contains(/unlisted/i).click();
      saveData();
      cy.contains(/listed in profile/i).should("have.class", "MuiSlider-markLabelActive");
    });
  });

  describe("Listed provider with support user", () => {
    let provider: Provider;

    beforeEach(() => {
      const user = makeFakeUser({ isAdmin: true });
      provider = makeProvider({ isAdmin: true, privacy: "listed_profile" });
      setupEdit(user, provider);
    });

    it("can be unlisted", () => {
      cy.contains(/unlisted/i).click();
      saveData();
      cy.contains(/unlisted/i)
        .parent()
        .should("have.class", "MuiSlider-markLabelActive");
    });
  });
});
