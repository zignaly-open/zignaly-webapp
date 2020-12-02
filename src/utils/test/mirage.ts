import { createServer, Model, Factory, RestSerializer, Response } from "miragejs";
import providers from "./fixtures/providers";
import exchanges from "./fixtures/exchanges";
import userExchanges from "./fixtures/userExchanges";
import userData from "./fixtures/userData";
import pairs from "./fixtures/pairs";

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

    // factories: {
    //   provider: Factory.extend({
    //     // factory properties go here
    //   }),
    // },

    seeds(server) {
      server.loadFixtures();
      server.create("user", { name: "Bob" });
      //   server.create("user", { name: "Alice" });
      //   server.createList("provider", 5);
    },

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
      this.urlPrefix = "/";
      this.namespace = "/";
      this.passthrough();
    },
  });

  return server;
}
