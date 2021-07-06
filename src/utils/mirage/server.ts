import { createServer, Model, Factory, RestSerializer, Response } from "miragejs";
import exchanges from "./fixtures/exchanges";
import pairs from "./fixtures/pairs";
import dayjs from "dayjs";

// Use proper TRADEAPI_URL value.
// When this file is imported from cypress context we can't access process.env
// so the env variables are passed to the cypress config object ????
// const TRADEAPI_URL =
// window?.Cypress ? Cypress.env("GATSBY_TRADEAPI_URL") : process.env.GATSBY_TRADEAPI_URL;

const TRADEAPI_URL = process.env.GATSBY_TRADEAPI_URL;
const TRADEAPI_URL_NEW = process.env.GATSBY_TRADEAPI_URL_NEW;

// Serializer matching our backend format
let ApplicationSerializer = RestSerializer.extend({
  root: false,
  embed: true,
});

const userFactory = Factory.extend({
  "2FAEnable": false,
  // withReminders: trait({
  //   afterCreate(list, server) {
  //     server.createList("reminder", 5, { list });
  //   },
  // }),
});

const getUserData = (user: any) => ({
  ...user,
  isTrader: { copy_trading: true, profit_sharing: true, signal_providers: true },
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
      // user: Model.extend({
      //   // campaigns: hasMany(),
      //   // owner: belongsTo("user"),
      //   save,
      // }),
    },

    fixtures: {
      exchanges,
      pairs,
    },

    factories: {
      provider: Factory.extend({
        name: "Test",
      }),
      // user: Factory.extend(makeUser()),
      user: userFactory,
    },

    // seeds(server) {
    //   // Not ran in test env
    //   server.loadFixtures();
    //   server.create("provider", { name: "PS test" });
    // },

    routes() {
      this.urlPrefix = TRADEAPI_URL_NEW;

      this.post("/signup", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const { email, firstName } = attrs;
        // const user = schema.db.users.insert({ email, firstName });
        return { token: "testtoken" };
      });

      this.post("/login", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const { email, password } = attrs;
        if (password !== "password123") {
          return new Response(400, {}, { error: { code: 8 } });
        }
        // const user = schema.db.users.findBy({ email });
        return new Response(200, {}, { token: "testtoken" });
      });

      this.get("/user/providers", (schema, request) => {
        return [];
      });

      this.get("/user", (schema, request) => {
        return getUserData(schema.db.users.find(1));
      });

      this.get("/providers/profit_sharing/:timeframe", (schema, request) => {
        return schema.all("provider");
      });

      this.urlPrefix = TRADEAPI_URL;
      this.namespace = "/fe";

      this.post("/api.php", (schema, request) => {
        let response = {};
        let status = 200;
        switch (request.queryParams.action) {
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
          case "getPairsNew":
            response = schema.db.pairs;
          default:
            break;
        }

        return new Response(status, {}, response);
      });

      // this.post("/tz.php", () => {
      //   return new Response(200);
      // });
    },
  });

  if (environment === "test") {
    // Force load fixtures (disabled by default for test environment)
    server.loadFixtures();
    // Log network requests (disabled by default for test environment)
    server.logging = true;
  }

  return server;
}
