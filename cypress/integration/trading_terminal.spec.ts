/// <reference types="cypress" />

import initialAuthData from "../fixtures/authState";
import { makeFakeUser } from "../factories/user";
import { makeProvider, makeProviderOptions } from "../factories/provider";
import dispatch from "../utils/dispatch";
import { setSelectedExchange } from "../../src/store/actions/settings";
import { makeOpenPosition } from "../factories/position";

describe("Trading Terminal", () => {
  let user: User;

  beforeEach(() => {
    const provider = makeProvider();
    cy.mock({ connectedProviders: [provider] });

    user = makeFakeUser();

    // Stub provider options
    const providerOptions = makeProviderOptions([provider]);
    cy.intercept("GET", "*/user/exchanges/*/providers_option*", providerOptions).as(
      "mockedProviderOptions",
    );

    cy.visit("/tradingTerminal", {
      onBeforeLoad: (win: any) => {
        win.initialState = initialAuthData(user);
      },
    });
  });

  it("should render trading panels with submit button", () => {
    cy.get("button[type='submit']").should("be.visible");
  });

  describe("Strategy Panel", () => {
    it("should check for correct values", () => {
      cy.get("input").type("100");
      cy.get("button[type='submit']").click();

      cy.get("input[name='positionSize']").parent().should("have.class", "Mui-error");
      cy.contains(/Position size value is required/i).should("exist");
    });

    it("should fill proper values", () => {
      const exchangeFutures = user.exchanges.find((e) => e.exchangeType === "futures");
      dispatch(setSelectedExchange(exchangeFutures.internalId));
      const positionSize = 50;
      const price = 50010;
      cy.get("input[name='positionSize']").type(positionSize.toString());

      // Price filled automatically
      cy.get("input[name='price']").should("be.ok");

      // Set leverage to x2
      cy.get("button").contains("1x").click();
      cy.get("button").contains("+").click();
      cy.get("button").contains("Confirm").click();

      // Units updated on position size change
      cy.get("input[name='price']").clear();
      cy.get("input[name='price']").type(price.toString());
      cy.get("input[name='units']").should("have.value", "0.00199960");

      // Position size updated on units change
      cy.get("input[name='units']").clear();
      cy.get("input[name='units']").type("0.00229911");
      cy.get("input[name='positionSize']").should("have.value", "114.97849110");
      cy.get("input[name='realInvestment']").should("have.value", "57.48924555");

      // Real investment updates Position Size and Units
      cy.get("input[name='realInvestment']").clear();
      cy.get("input[name='realInvestment']").type("50");
      cy.get("input[name='positionSize']").should("have.value", "100");
      cy.get("input[name='units']").should("have.value", "0.00199960");
    });
  });

  describe("Take Profit Panel", () => {
    beforeEach(() => {
      cy.get(".takeProfitPanel").find("span").first().click();
    });

    it("should fill proper values", () => {
      cy.get("input[name='takeProfitTargetPricePercentage1']").type("10");
      cy.get("input[name='takeProfitTargetPrice1']").should("be.ok");
      cy.get("input[name='takeProfitExitUnitsPercentage1']").type("50");
      cy.get("input[name='takeProfitExitUnits1']").should("be.ok");

      cy.get("button.addTarget").click();
      cy.get(".targetGroup").should("have.length", 2);

      cy.get("button.removeTarget").click();
      cy.get(".targetGroup").should("have.length", 1);
    });
  });

  describe("DCA", () => {
    beforeEach(() => {
      cy.get(".dcaPanel").find("span").first().click();
    });

    it("should fill proper values", () => {
      cy.get("input[name='dcaTargetPricePercentage1']").type("10");
      cy.get("input[name='dcaRebuyPercentage1']").type("50");

      cy.get(".dcaPanel button.addTarget").click();
      cy.get(".dcaPanel .targetGroup").should("have.length", 2);

      cy.get(".dcaPanel button.removeTarget").then(($option) => {
        $option.get(1).click();
      });
      cy.get(".dcaPanel .targetGroup").should("have.length", 1);
    });
  });

  describe("Stop Loss", () => {
    beforeEach(() => {
      cy.get(".stopLossPanel").find("span").first().click();
    });

    it("should fill proper values", () => {
      cy.get("input[name='stopLossPercentage']").type("-10");
      cy.get("input[name='stopLossPrice']").should("be.ok");
    });
  });

  describe("Trailing Stop Loss", () => {
    beforeEach(() => {
      cy.get(".trailingStopPanel").find("span").first().click();
    });

    it("should fill proper values", () => {
      cy.get("input[name='trailingStopPercentage']").type("10");
      cy.get("input[name='trailingStopDistance']").type("-5");
      cy.get("input[name='trailingStopPrice']").should("be.ok");
    });
  });

  describe("Create Position", () => {
    // beforeEach(() => {});

    it("should create a position with filled values", () => {
      const position = makeOpenPosition({ positionSizeQuote: 50 });
      // Stub create position
      cy.intercept("POST", "*/user/exchanges/*/positions", JSON.stringify(position.positionId)).as(
        "createManualPosition",
      );

      // Get position
      cy.intercept("GET", `*/user/exchanges/Zignaly*/positions/${position.positionId}`, position);

      // Fill form
      cy.get("input[name='positionSize']").type(position.positionSizeQuote.toString());

      // Submit
      cy.get("button[type='submit']").click();

      // Assert request
      cy.wait("@createManualPosition").its("request.body").should("deep.include", {
        positionSize: 50,
        pair: "BTCUSDT",
        positionSizeQuote: "USDT",
        providerId: 1,
        leverage: 1,
        side: "LONG",
      });

      cy.url().should("eq", `${Cypress.config("baseUrl")}/position/${position.positionId}`);

      // Assert page
      cy.get("button[type='submit']").contains(/Update Position/i);
      cy.get("table").contains("USDT 50.00");
    });
  });
});
