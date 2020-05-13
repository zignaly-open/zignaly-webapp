// @flow
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

   /**
    * Login a user in Trade API.
    *
    * @param {UserLoginPayload} payload
    * @returns string The session token.
    * @memberof TradeApiClient
    */
   userLogin(payload) {

   }

   userLogout() {

   }

   async userCreate(userCreatePayload) {
    const apiBaseUrl = 'http://api.zignaly.lndo.site/';
    const endpointPath = 'fe/api.php?action=signup';
    const requestUrl = apiBaseUrl + endpointPath;
    const options = {
        method: 'POST',
        body: JSON.stringify(userCreatePayload)
    }

    try {
      const response = await fetch(requestUrl, options);
      if (response.status === 200) {
        return await response.json();
      }

      throw new Error("User creation failed.");
    } catch (e) {
      console.error(e);
    }
   }

   openPositionsGet(token, positionStatus) {

   }
}

const client = new TradeApiClient();
Object.freeze(client);

export default client.instance;
