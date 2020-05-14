import fetch from "cross-fetch"

/**
 * Trade API client service, provides integration to API endpoints.
 *
 * @constructor
 * @public
 * @class TradeApiClient
 */
class TradeApiClient {
  /**
   * Creates an instance of TradeApiClient.
   * @memberof TradeApiClient
   */
  constructor() {
    this.baseUrl = process.env.TRADEAPI_URL
  }

  /**
   * @typedef {Object} UserLoginPayload
   * @property {string} email
   * @property {string} password
   */

  /**
   * Login a user in Trade API.
   *
   * @param {UserLoginPayload} payload
   * @returns string The session token.
   * @memberof TradeApiClient
   */
  userLogin(payload) {}

  userLogout() {}

  /**
   * @typedef {Object} UserCreatePayload
   * @property {string} firstName
   * @property {string} email
   * @property {string} password
   * @property {string} gRecaptchaResponse
   */

  /**
   * Create user at Zignaly Trade API.
   *
   * @param {UserCreatePayload} UserCreatePayload
   * @returns
   * @memberof TradeApiClient
   */
  async userCreate(UserCreatePayload) {
    const apiBaseUrl = "http://api.zignaly.lndo.site/"
    const endpointPath = "fe/api.php?action=signup"
    const requestUrl = apiBaseUrl + endpointPath
    const options = {
      method: "POST",
      body: JSON.stringify(UserCreatePayload),
      headers: {
        'Content-Type': 'application/json',
      }
    }

    try {
      const response = await fetch(requestUrl, options)
      if (response.status === 200) {
        return await response.json()
      }

      const body = await response.text();
      throw new Error("User creation failed:" + body);
    } catch (e) {
      console.error(e)
    }
  }

  openPositionsGet(token, positionStatus) {}
}

// JS export by default guarantee a singleton instance if we export the class
// instance, see:
// https://medium.com/@lazlojuly/are-node-js-modules-singletons-764ae97519af
const client = new TradeApiClient()
Object.freeze(client)

export default client
