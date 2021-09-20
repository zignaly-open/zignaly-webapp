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

  it("should render trading panels with submit button", () => {
    cy.get("button[type='submit']", { timeout: 20000 }).should("be.visible");
  });

  it("should check for correct values", () => {
    cy.get("input").type("100");
    cy.get("button[type='submit']").click();

    cy.get("input[name='positionSize']").parent().should("have.class", "Mui-error");
    cy.contains(/Position size value is required/i).should("exist");
  });

  describe("Strategy Panel", () => {
    it("should fill proper values", () => {
      const positionSize = 100;
      const price = 50010;
      cy.get("input[name='positionSize']").type(positionSize.toString());

      // Price filled automatically
      cy.get("input[name='price']").should("be.ok");

      // Units updated on position size change
      cy.get("input[name='price']").clear();
      cy.get("input[name='price']").type(price.toString());
      cy.get("input[name='units']").should("have.value", "0.00199960");

      // Position size updated on units change
      cy.get("input[name='units']").clear();
      cy.get("input[name='units']").type("0.00229911");
      cy.get("input[name='positionSize']").should("have.value", "114.97849110");
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
});
