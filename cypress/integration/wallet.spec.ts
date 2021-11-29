/// <reference types="cypress" />

import { makeFakeUser } from "../factories/user";
import { makeOffers } from "../factories/wallet";
import initialAuthData from "../fixtures/authState";

describe("Wallet", () => {
  beforeEach(() => {
    cy.mock();
    cy.intercept("GET", "*/user/exchanges/*/positions?type=open", []);
    cy.intercept("GET", "**/api/get-balance", (req) => {
      req.reply(200, {
        ZIG: {
          total: { balance: 12000, availableBalance: 12000 },
          BSC: { balance: 12000, availableBalance: 12000 },
        },
      } as WalletBalance);
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
          usdPrice: 0.03083,
        },
      } as WalletCoins);
    });
    cy.intercept("GET", "**/api/get-operations", (req) => {
      req.reply(200, []);
    });
    // cy.intercept("POST", "**/zig/convert-preview", (req) => {
    //   req.reply(200, {
    //     side: "sell",
    //     lastPrice: 0.03083,
    //     bridge: "USDT",
    //     estimatedAmount: 0.03083,
    //   });
    // });

    const offers = makeOffers();
    cy.intercept("GET", "**/api/get-programs/active", (req) => {
      req.reply(200, offers);
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

  it("renders vault", () => {
    cy.get("a").contains(/ZIG/i).parent().contains("12,000").click();
    cy.contains(/Earn ZIG on balances over 10 ZIG/i);
    cy.get("a").contains(/All 3 vault offers/i);
  });
});
