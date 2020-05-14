import fetch from "cross-fetch"
import { userCreateResponseTransform } from "./tradeApiResponseTransformer"

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
   * Process API HTTP request.
   *
   * @param {string} endpointPath API endpoint path and action.
   * @param {Object} payload Request payload parameters object.
   * @returns {Promise<*>}
   *
   * @memberof TradeApiClient
   */
  async doRequest(endpointPath, payload) {
    const apiBaseUrl = "http://api.zignaly.lndo.site/"
    const requestUrl = apiBaseUrl + endpointPath
    const options = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const response = await fetch(requestUrl, options)
      if (response.status === 200) {
        return await response.json()
      }

      const body = await response.text()
      throw new Error(`API ${requestUrl} request failed:` + body)
    } catch (e) {
      console.error(e)
    }
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
   * @returns {Promise<UserLoginResponse>}
   * @memberof TradeApiClient
   */
  async userLogin(payload) {
    const endpointPath = "/fe/api.php?action=login"
    const responseData = await this.doRequest(endpointPath, payload)

    return userCreateResponseTransform(responseData)
  }

  userLogout() {}

  /**
   * @typedef {Object} UserCreatePayload
   * @property {string} firstName User first name.
   * @property {string} email User email address.
   * @property {string} password User password.
   * @property {string} gRecaptchaResponse Google captcha response.
   */

  /**
   * Create user at Zignaly Trade API.
   *
   * @param {UserCreatePayload} UserCreatePayload
   * @returns {Promise<UserCreateResponse>}
   * @memberof TradeApiClient
   */
  async userCreate(UserCreatePayload) {
    const endpointPath = "fe/api.php?action=signup"
    const responseData = await this.doRequest(endpointPath, UserCreatePayload)

    return userCreateResponseTransform(responseData)
  }

  openPositionsGet(token, positionStatus) {}
}

// JS export by default guarantee a singleton instance if we export the class
// instance, see:
// https://medium.com/@lazlojuly/are-node-js-modules-singletons-764ae97519af
const client = new TradeApiClient()
Object.freeze(client)

export default client
