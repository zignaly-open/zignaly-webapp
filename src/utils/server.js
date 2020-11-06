import { createServer, Model, Factory } from "miragejs";
import providers from "../__tests__/fixtures/providers";
import exchanges from "../__tests__/fixtures/exchanges";

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      exchange: Model,
    },

    fixtures: {
      providers,
      exchanges,
    },

    // factories: {
    //   provider: Factory.extend({
    //     // factory properties go here
    //   }),
    // },

    seeds(server) {
      server.loadFixtures();
      server.create("user", { name: "Bob" });
      server.create("user", { name: "Alice" });
      //   server.createList("provider", 5);
    },

    routes() {
      //   this.urlPrefix = "http://api.zignaly.lndo.site/fe";
      this.namespace = "api";

      this.post("/api.php?action=getProviderList2", (schema) => {
        return schema.providers.all();
      });

      this.post("/api.php?action=getQuoteAssets", (schema) => {
        return ["USDT", "BTC", "USD", "BNB"];
      });

      this.post("/api.php?action=getExchangeList", (schema) => {
        return schema.exchanges.all();
      });
      this.post("/test", (schema) => {
        return schema.exchanges.all();
      });
      //   this.get("/movies");
    },
  });

  return server;
}
