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
   * @property {String} instance
   */
  constructor() {
    this.instance = undefined;
    this.baseUrl = process.env.TRADEAPI_URL

    if (!TradeApiClient.instance) {
      TradeApiClient.instance = this
    }

    return TradeApiClient
  }

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
   * @property {string} passwrod
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
    }

    try {
      const response = await fetch(requestUrl, options)
      if (response.status === 200) {
        return await response.json()
      }

      throw new Error("User creation failed.")
    } catch (e) {
      console.error(e)
    }
  }

  openPositionsGet(token, positionStatus) {}
}

const client = new TradeApiClient()
Object.freeze(client)

export default client.instance
