import fetch from "cross-fetch";

// Trade API client service, provides integration to API endpoints.
class TradeApiClient {
   constructor() {
       this.baseUrl = process.env.TRADEAPI_URL;

        if (!TradeApiClient.instance) {
            TradeApiClient.instance = this;
        }

        return TradeApiClient;
   }

   userLogin(username, password) {

   }

   userLogout() {

   }

   userCreate(userCreatePayload) {

   }

   positionsGet(token, positionStatus) {

   }
}

const instance = new TradeApiClient();
Object.freeze(instance);

export default instance;
