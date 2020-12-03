import { createServer, Model, Factory, RestSerializer, Response } from "miragejs";
import providers from "./fixtures/providers";
import exchanges from "./fixtures/exchanges";
import userExchanges from "./fixtures/userExchanges";
import userData from "./fixtures/userData";
import pairs from "./fixtures/pairs";
import dayjs from "dayjs";

let TRADEAPI_URL = process.env.GATSBY_TRADEAPI_URL;

if (typeof Cypress !== "undefined") {
  TRADEAPI_URL = Cypress.env("GATSBY_TRADEAPI_URL");
}

let ApplicationSerializer = RestSerializer.extend({
  root: false,
  embed: true,
});

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    serializers: {
      application: ApplicationSerializer,
    },

    models: {
      user: Model,
      exchange: Model,
      provider: Model,
      userExchange: Model,
      userData: Model,
      pair: Model,
    },

    fixtures: {
      providers,
      exchanges,
      userExchanges,
      userData,
      pairs,
    },

    factories: {
      provider: Factory.extend({
        // factory properties go here
      }),
      user: Factory.extend({
        firstName: "Test",
        email: "test@test.com",
        token: "xxxx",
        ask2FA: false,
        userId: "5b13fe046c20cd75b5058c32",
        createdAt: "2018-06-03T14:41:08",
        providerEnable: true,
        "2FAEnable": false,
        ref: "seaquake",
        subscribe: true,
        isAdmin: false,
        isSupport: false,
        role: "user",
        binanceConnected: true,
        demoExchangeConnected: true,
        realExchangeConnected: true,
        buysCount: 3357,
        sellsCount: 2662,
        planId: "008",
        planName: "Zignaly Friend",
        planType: "None",
        projectId: "z01",
        minimumProviderSettings: true,
        status: 1,
        onboarding: { finished: false, paused: true, step: "2" },
        refCode: "0000000000",
        dashlyHash: "",
        dashlyEchoAuth: "",
        firstPositionClosedAt: "2018-06-03 17:20:41",
        firstRealPositionClosedAt: "2018-06-03 17:20:41",
        hasRegisteredAt: "2018-06-03 14:41:08",
        lastPositionClosedAt: "2020-11-07 20:09:36",
        lastPositionOpenedAt: "2020-11-08 13:59:50",
        lastRealPositionClosedAt: "2020-10-31 08:28:07",
        lastRealPositionOpenedAt: "2020-10-29 12:41:09",
        firstPositionOpenedAt: "2018-06-03 15:32:59",
        firstRealPositionOpenedAt: "2018-06-03 15:32:59",
        hasActivatedAt: "2018-06-03 17:20:41",
        hasActivated: true,
        positionBuysCount: 3357,
        positionSellsCount: 2661,
        realPositionBuysCount: 614,
        realPositionSellsCount: 610,
        imageUrl:
          "https://res.cloudinary.com/zignaly/image/upload/v1600269747/sbnpuqrq27dfyeepgzgh.png",
        userName: "test",
      }),
    },

    // seeds(server) {
    //   server.loadFixtures();
    //   //   server.create("user", { name: "Alice" });
    //   //   server.createList("provider", 5);
    // },

    routes() {
      this.urlPrefix = TRADEAPI_URL;
      this.namespace = "/fe";

      this.post("/api.php", (schema, request) => {
        let response = {};
        let status = 200;
        switch (request.queryParams.action) {
          case "login":
            let attrs = JSON.parse(request.requestBody);
            const { email, password } = attrs;
            if (password === "password123") {
              response = schema.db.users.findBy({ email });
            } else {
              status = 400;
              response = { error: { code: 8 } };
            }
            break;
          case "getSessionData":
            response = { status: "active", validUntil: dayjs().add(2, "h").unix() };
            break;
          case "getQuoteAssets":
            response = ["USDT", "BTC", "USD", "BNB"];
            break;
          case "getProviderList2":
            response = schema.db.providers;
            break;
          case "getExchangeList":
            response = schema.db.exchanges;
            break;
          case "getUserExchanges":
            response = schema.db.userExchanges;
            break;
          case "getUserData":
            response = schema.db.userData;
            break;
          case "getPairsNew":
            response = schema.db.pairs;
          default:
            break;
        }

        return new Response(status, {}, response);
      });

      // Allow unhandled requests on the current domain to pass through
      // Currently used to serve gatsby files
      this.urlPrefix = "/";
      this.namespace = "/";
      this.passthrough();
    },
  });

  server.loadFixtures();

  return server;
}
