/// <reference types="cypress" />

import { makeFakeUser } from "../factories/user";
import initialAuthData from "../fixtures/authState";

describe("Wallet", () => {
  beforeEach(() => {
    cy.mock();
    cy.intercept("GET", "*/user/exchanges/*/positions?type=open", []);
    cy.intercept("GET", "**/api/get-balance", (req) => {
      req.reply(200, {
        ZIG: {
          total: 12000,
          BSC: 12000,
        },
      });
    });
    cy.intercept("GET", "**/api/get-currencies", (req) => {
      req.reply(200, {
        ZIG: {
          name: "ZIG",
          decimals: 18,
          networks: [
            {
              name: "BEP20 (BSC)",
              network: "BSC",
              addressRegex: "",
              memoRegex: "",
              isDefault: false,
              depositEnable: true,
              withdrawEnable: true,
              integerMultiple: "",
            },
          ],
        },
      });
    });
    cy.intercept("GET", "**/api/get-operations", (req) => {
      req.reply(200, []);
    });
    cy.intercept("POST", "**/zig/convert-preview", (req) => {
      req.reply(200, {
        side: "sell",
        lastPrice: 0.03083,
        bridge: "USDT",
        estimatedAmount: 0.03083,
      });
    });

    const user = makeFakeUser();
    cy.visit("/#wallet", {
      onBeforeLoad: (win: any) => {
        win.initialState = initialAuthData(user);
      },
    });
  });

  it("renders wallet", () => {
    cy.get("a").contains(/ZIG/i).parent().contains("12,000").click();
    cy.get("[data-test-id='total-balance']").contains("12,000");
    cy.get("[data-test-id='total-balance-usd']").contains("369.96");
  });
});
