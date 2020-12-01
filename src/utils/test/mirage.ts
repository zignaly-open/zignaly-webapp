import { createServer, Model, Factory, RestSerializer, Response } from "miragejs";
import providers from "./fixtures/providers";
import exchanges from "./fixtures/exchanges";
import userExchanges from "./fixtures/userExchanges";
import userData from "./fixtures/userData";
import pairs from "./fixtures/pairs";

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
      //   server.create("user", { name: "Bob" });
      //   server.create("user", { name: "Alice" });
      //   server.createList("provider", 5);
    },

    routes() {
      this.urlPrefix = process.env.GATSBY_TRADEAPI_URL;
      this.namespace = "/fe";

      this.post("/api.php", (schema, request) => {
        let response = {};
        switch (request.queryParams.action) {
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
        // Return response and force status 200
        return new Response(200, {}, response);
      });

      this.urlPrefix = "/";
      this.namespace = "/";
      // Allow unhandled requests on the current domain to pass through
      this.passthrough();
    },
  });

  return server;
}
