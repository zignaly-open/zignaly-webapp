import { createServer, Model, Factory, RestSerializer, Response } from "miragejs";
import providers from "../__tests__/fixtures/providers";
import exchanges from "../__tests__/fixtures/exchanges";
import userExchanges from "../__tests__/fixtures/userExchanges";
import userData from "../__tests__/fixtures/userData";
import pairs from "../__tests__/fixtures/pairs";

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

    seeds() {
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
    },
  });

  return server;
}
