import { createServer, Model, Factory, RestSerializer, Response, trait, belongsTo } from "miragejs";
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

// Serializer matching our backend format
let ApplicationSerializer = RestSerializer.extend({
  root: false,
  embed: true,
});

const userFactory = Factory.extend({
  "2FAEnable": false,
  // afterCreate(user, server) {
  // server.createList("providerConnection", 5, { user });
  // },
  exchanges: [
    {
      activated: true,
      exchangeId: "5e662c1c3e3b24c186ed9c21",
      exchangeName: "Zignaly",
      exchangeType: "spot",
      internal: true,
      internalId: "Zignaly1585927408_5e8754f065080",
      internalName: "Zignaly Spot",
      isBrokerAccount: true,
      name: "Zignaly",
    },
    {
      activated: true,
      exchangeId: "5e662c1c3e3b24c186ed9c21",
      exchangeName: "Zignaly",
      exchangeType: "futures",
      internal: true,
      internalId: "Zignaly1185927111_068018f065acb",
      internalName: "Zignaly Futures",
      isBrokerAccount: true,
      name: "Zignaly",
    },
    {
      activated: false,
      exchangeId: "5e662c1c3e3b24c186ed9c21",
      exchangeName: "Zignaly",
      exchangeType: "spot",
      internal: true,
      internalId: "Zignaly1598187408_6acb54f060181",
      internalName: "Zignaly Not Activated",
      isBrokerAccount: true,
      name: "Zignaly",
    },
    {
      activated: true,
      exchangeId: "5b13fee5b233f6004cb8b884",
      exchangeName: "Binance",
      exchangeType: "spot",
      internal: true,
      internalId: "Zignaly9828187401_acb54faba182",
      internalName: "Binance Account",
      isBrokerAccount: true,
      name: "Binance",
      areKeysValid: true,
    },
  ],
});

export const getUserData = (user: any) => ({
  ...user,
  isTrader: { copy_trading: true, profit_sharing: true, signal_providers: true },
});

const composeProvider = (p, schema) => {
  const user = schema.db.users.where({})[0];
  const connected = schema.db.providerConnections.findBy({ userId: user.id, providerId: p.id });

  return {
    ...p,
    disable: !connected,
  };
};

export function makeServer({ environment = "test" } = {}) {
  // eslint-disable-next-line no-console
  console.log(`Mocking ${TRADEAPI_URL_NEW}`);

  let server = createServer({
    environment,

    // Custom id with 24 chars
    identityManagers: { application: IdManager } as any,

    serializers: {
      application: ApplicationSerializer,
    },

    models: {
      user: Model,
      exchange: Model,
      provider: Model,
      userData: Model,
      pair: Model,
      providerConnection: Model.extend({
        user: belongsTo("user"),
        provider: belongsTo("provider"),
      }),
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
        exchanges: ["zignaly"],
        exchangeType: "spot",
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
        copyTradingQuote: "USDT",
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

      // Connected services
      this.get("/user/providers", (schema, request) => {
        return schema.db.providerConnections.where({}).map((p) => {
          const provider = schema.db.providers.find(p.providerId);
          return {
            connected: true,
            exchangeInternalId: "Zignaly1585927408_5e8754f075080",
            // exchangeInternalIds: [],
            id: provider.id,
            name: provider.name,
          };
        });
      });

      this.get("/user", (schema, request) => {
        // todo
        return getUserData(schema.db.users.find(1));
      });

      this.get("/user/exchange/:exchangeInternalId/available_balance", (schema, request) => {
        return {
          USDT: 10,
        };
      });

      this.get("/exchanges", (schema, request) => {
        return schema.db.exchanges;
      });

      this.get("/providers?", (schema, request) => {
        return schema.all("provider").map((p) => composeProvider);
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
            const provider = schema.db.providers.findBy({ id: providerId });
            response = composeProvider(provider, schema);
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

    // server.create("exchage", [
    //   {
    //     id: "5e662c1c3e3b24c186ed9c24",
    //     name: "Zignaly",
    //     enabled: true,
    //     requiredAuthFields: [],
    //     testNet: ["futures"],
    //     type: ["spot", "futures"],
    //     features: [],
    //   },
    //   {
    //     id: "5b13fee5b233f6004cb8b884",
    //     name: "Binance",
    //     enabled: true,
    //     requiredAuthFields: ["key", "secret"],
    //     testNet: ["futures"],
    //     type: ["spot", "futures"],
    //     features: [],
    //   },
    //   {
    //     id: "606a32546fc218b34f08539d",
    //     name: "AscendEX",
    //     enabled: true,
    //     enabledInTest: true,
    //     requiredAuthFields: ["key", "secret"],
    //     testNet: [],
    //     type: ["spot"],
    //     features: [],
    //   },
    //   {
    //     id: "5d66ba813e3b24c1867d2103",
    //     name: "BitMEX",
    //     enabled: true,
    //     enabledInTest: true,
    //     requiredAuthFields: ["key", "secret"],
    //     testNet: ["futures"],
    //     type: ["futures"],
    //     features: { hasPostOnly: true },
    //   },
    //   {
    //     id: "5dc14f932f2826b3b6970fa8",
    //     name: "KuCoin",
    //     enabled: true,
    //     requiredAuthFields: ["key", "secret", "password"],
    //     testNet: [],
    //     type: ["spot"],
    //     features: [],
    //   },
    //   {
    //     id: "5fb6466f687988f13db12c7a",
    //     name: "VCCE",
    //     enabled: true,
    //     enabledInTest: true,
    //     requiredAuthFields: ["key", "secret"],
    //     testNet: [],
    //     type: ["spot"],
    //     features: [],
    //   },
    // ]);
  }

  return server;
}

export const setup = () => {
  if (window.Cypress) {
    // If your app makes requests to domains other than / (the current domain), add them
    // here so that they are also proxied from your app to the handleFromCypress function.
    let otherDomains = [process.env.GATSBY_TRADEAPI_URL, process.env.GATSBY_TRADEAPI_URL_NEW];
    let methods = ["get", "put", "patch", "post", "delete"];

    // Proxy API requests to the handleFromCypress function of Cypress
    createServer({
      environment: "test",
      routes() {
        for (const domain of ["/", ...otherDomains]) {
          for (const method of methods) {
            this[method](`${domain}/*`, async (schema, request) => {
              let [status, headers, body] = await window.handleFromCypress(request);
              return new Response(status, headers, body);
            });
          }
        }

        // All other requests on the current domain will still pass through
        // this.passthrough();

        // If your central server has any calls to passthrough(), you'll need to duplicate them here
        // this.passthrough("https://analytics.google.com");
      },
    });
  } else if (process.env.NODE_ENV === "development") {
    if (process.env.MIRAGE === "true") {
      // Use mirage server for local development
      makeServer({ environment: "development" });
    }
  }
};
