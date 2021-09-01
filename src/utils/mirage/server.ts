import { createServer, Model, Factory, RestSerializer, Response } from "miragejs";
import exchanges from "./fixtures/exchanges";
import pairs from "./fixtures/pairs";
import dayjs from "dayjs";
import faker from "faker";
import IdManager from "./IdManager";

// Use proper TRADEAPI_URL value.
// When this file is imported from cypress context we can't access process.env
// so the env variables are passed to the cypress config object
const TRADEAPI_URL =
  // @ts-ignore
  window?.Cypress ? Cypress.env("GATSBY_TRADEAPI_URL") : process.env.GATSBY_TRADEAPI_URL;
const TRADEAPI_URL_NEW =
  // @ts-ignore
  window?.Cypress ? Cypress.env("GATSBY_TRADEAPI_URL_NEW") : process.env.GATSBY_TRADEAPI_URL_NEW;

// eslint-disable-next-line no-console
console.log(`Mocking ${TRADEAPI_URL_NEW}`);

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

    identityManagers: { application: IdManager } as any,

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
        name: faker.commerce.productName(),
        // id: faker.random.alphaNumeric(24),
        exchanges: ["zignaly"],
        disable: true,
        logoUrl: null,
        isClone: false,
        isCopyTrading: true,
        createdAt: "",
        public: true,
        returns: 2,
        floating: 10,
        options: {},
        website: "",
        exchangeInternalIds: [],
        profitMode: "",
        profitsShare: 5,
        profitSharing: true,
        followers: 10,
        strategy: "",
        about: "",
        team: [],
        social: [],
        minAllocatedBalance: 0,
        maxAllocatedBalance: 50,
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
      // Let localhost request pass through (gatsby files)
      this.passthrough();

      this.urlPrefix = TRADEAPI_URL_NEW;

      this.post("/signup", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const { email, firstName } = attrs;
        schema.db.users.insert({ email, firstName });
        return { token: Cypress.env("token") };
      });

      this.post("/login", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const { email, password } = attrs;
        const user = schema.db.users.findBy({ email });
        if (!user || user.password !== password) {
          return new Response(400, {}, { error: { code: 8 } });
        }
        return new Response(200, {}, { token: Cypress.env("token") });
      });

      this.get("/user/providers", (schema, request) => {
        return [];
      });

      this.get("/user", (schema, request) => {
        return getUserData(schema.db.users.find(1));
      });

      this.get("/exchanges", (schema, request) => {
        return schema.db.exchanges;
      });

      this.get("/providers?", (schema, request) => {
        return schema.db.providers;
      });

      this.get("/providers/profit_sharing/:timeframe", (schema, request) => {
        return schema.all("provider");
      });

      this.passthrough("https://api.segment.io/**");
      this.passthrough("https://*.userpilot.io/**");

      this.urlPrefix = TRADEAPI_URL;
      this.namespace = "/fe";

      this.post("/api.php", (schema, request) => {
        let response = {};
        let status = 200;
        switch (request.queryParams.action) {
          case "getSessionData":
            response = { status: "active", validUntil: dayjs().add(2, "h").valueOf() };
            break;
          case "getQuoteAssets":
            response = ["USDT", "BTC", "USD", "BNB"];
            break;
          case "getPairsNew":
            response = schema.db.pairs;
            break;
          case "getProvider": {
            const { providerId, exchangeInternalId } = JSON.parse(request.requestBody);
            response = schema.db.providers.findBy({ id: providerId });
            break;
          }
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
