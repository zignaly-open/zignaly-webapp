import fetch from "cross-fetch";
import {
  userCreateResponseTransform,
  userEntityResponseTransform,
  userPositionsResponseTransform,
  providersResponseTransform,
  providersStatsResponseTransform,
  userExchangeConnectionResponseTransform,
  userBalanceResponseTransform,
  userPositionItemTransform,
  userEquityResponseTransform,
} from "./tradeApiClient.types";

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
    this.baseUrl = process.env.GATSBY_TRADEAPI_URL;
  }

  /**
   * Process API HTTP request.
   *
   * @param {string} endpointPath API endpoint path and action.
   * @param {Object} payload Request payload parameters object.
   * @returns {Promise<*>} Promise that resolves Trade API request response.
   *
   * @memberof TradeApiClient
   */
  async doRequest(endpointPath, payload) {
    let responseData = {};
    const requestUrl = this.baseUrl + endpointPath;
    const options = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(requestUrl, options);
      if (response.status === 200) {
        responseData = await response.json();
      } else {
        responseData.error = await response.text();
      }
    } catch (e) {
      responseData.error = e.message;
    }

    if (responseData.error) {
      const customError = new Error(`API ${requestUrl} request failed:` + responseData.error);
      throw customError;
    }

    return responseData;
  }

  /**
   * @typedef {import('./tradeApiClient.types').UserLoginPayload} UserLoginPayload
   * @typedef {import('./tradeApiClient.types').UserLoginResponse} UserLoginResponse
   */

  /**
   * Login a user in Trade API.
   *
   * @param {UserLoginPayload} payload User login payload
   *
   * @returns {Promise<UserLoginResponse>} Promise that resolves user login response
   *
   * @memberof TradeApiClient
   */
  async userLogin(payload) {
    const endpointPath = "/fe/api.php?action=login";
    const responseData = await this.doRequest(endpointPath, payload);

    return userEntityResponseTransform(responseData);
  }

  userLogout() {}

  /**
   * @typedef {import('./tradeApiClient.types').UserCreatePayload} UserCreatePayload
   * @typedef {import('./tradeApiClient.types').UserCreateResponse} UserCreateResponse
   */

  /**
   * Create user at Zignaly Trade API.
   *
   * @param {UserCreatePayload} payload User create payload.
   *
   * @returns {Promise<UserCreateResponse>} Promise that resolves user create response.
   *
   * @memberof TradeApiClient
   */
  async userCreate(payload) {
    const endpointPath = "/fe/api.php?action=signup";
    const responseData = await this.doRequest(endpointPath, payload);

    return userCreateResponseTransform(responseData);
  }

  /**
   * @typedef {import('./tradeApiClient.types').AuthorizationPayload} AuthorizationPayload
   * @typedef {import('./tradeApiClient.types').UserPositionsCollection} UserPositionsCollection
   */

  /**
   * Get user open trading positions.
   *
   * @param {AuthorizationPayload} payload User authorization payload.

   * @returns {Promise<UserPositionsCollection>} Promise that resolve user positions collection.
   *
   * @memberof TradeApiClient
   */
  async openPositionsGet(payload) {
    const endpointPath = "/fe/api.php?action=getOpenPositions";
    const responseData = await this.doRequest(endpointPath, payload);

    return userPositionsResponseTransform(responseData);
  }

  /**
   * Get user closed trading positions.
   *
   * @param {AuthorizationPayload} payload User authorization payload.

   * @returns {Promise<UserPositionsCollection>} Promise that resolve user positions collection.
   *
   * @memberof TradeApiClient
   */
  async closedPositionsGet(payload) {
    const endpointPath = "/fe/api.php?action=getClosedPositions";
    const responseData = await this.doRequest(endpointPath, {
      type: "sold",
      ...payload,
    });

    return userPositionsResponseTransform(responseData);
  }

  /**
   * Get user unsold / unopened trading positions.
   *
   * @param {AuthorizationPayload} payload User authorization payload.

   * @returns {Promise<UserPositionsCollection>} Promise that resolve user positions collection.
   *
   * @memberof TradeApiClient
   */
  async logPositionsGet(payload) {
    const endpointPath = "/fe/api.php?action=getOpenPositions";
    const responseData = await this.doRequest(endpointPath, {
      type: "unsold",
      ...payload,
    });

    return userPositionsResponseTransform(responseData);
  }

  /**
   * @typedef {import('./tradeApiClient.types').ProvidersPayload} ProvidersPayload
   * @typedef {import('./tradeApiClient.types').ProvidersCollection} ProvidersCollection
   */

  /**
   * Get providers list.
   *
   * @param {ProvidersPayload} payload Get providers payload.

   * @returns {Promise<ProvidersCollection>} Promise that resolves providers collection.
   *
   * @memberof TradeApiClient
   */
  async providersGet(payload) {
    const endpointPath = "/fe/api.php?action=getProviderList2";
    const responseData = await this.doRequest(endpointPath, payload);

    return providersResponseTransform(responseData);
  }

  /**
   *
   *
   * @param {AuthorizationPayload} payload
   * @returns
   * @memberof TradeApiClient
   */

  async userExchangesGet(payload) {
    const endpointPath = "/fe/api.php?action=getUserExchanges";
    const responseData = await this.doRequest(endpointPath, payload);

    return userExchangeConnectionResponseTransform(responseData);
  }

  /**
   *
   *
   * @param {AuthorizationPayload} payload
   * @returns
   * @memberof TradeApiClient
   */

  async userBalanceGet(payload) {
    const endpointPath = "/fe/api.php?action=getDashboardStats";
    const responseData = await this.doRequest(endpointPath, payload);

    return userBalanceResponseTransform(responseData);
  }

  /**
   *
   *
   * @param {AuthorizationPayload} payload
   * @returns
   * @memberof TradeApiClient
   */

  async userEquityGet(payload) {
    const endpointPath = "/fe/api.php?action=getBalance";
    const responseData = await this.doRequest(endpointPath, payload);

    return userEquityResponseTransform(responseData);
  }

  /**
   * @typedef {import('./tradeApiClient.types').ProvidersStatsPayload} ProvidersStatsPayload
   * @typedef {import('./tradeApiClient.types').ProvidersStatsCollection} ProvidersStatsCollection
   */

  /**
   * Get providers profits stats.
   *
   * @param {ProvidersStatsPayload} payload Get providers stats payload.

   * @returns {Promise<ProvidersStatsCollection>} Promise that resolves providers stats collection.
   *
   * @memberof TradeApiClient
   */
  async providersStatsGet(payload) {
    const endpointPath = "/fe/api.php?action=getProviderProfitStats";
    const responseData = await this.doRequest(endpointPath, payload);

    return providersStatsResponseTransform(responseData);
  }

  /**
   * @typedef {import('./tradeApiClient.types').PositionActionPayload} PositionActionPayload
   * @typedef {import('./tradeApiClient.types').PositionEntity} PositionEntity
   */

  /**
   * Close a position.
   *
   * @param {PositionActionPayload} payload User authorization payload.

   * @returns {Promise<PositionEntity>} Promise that resolve user affected position entity.
   *
   * @memberof TradeApiClient
   */
  async positionClose(payload) {
    const endpointPath = "/fe/api.php?action=closePosition";
    const responseData = await this.doRequest(endpointPath, payload);

    return userPositionItemTransform(responseData);
  }

  /**
   * Exit a position.
   *
   * @param {PositionActionPayload} payload User authorization payload.

   * @returns {Promise<PositionEntity>} Promise that resolve user affected position entity.
   *
   * @memberof TradeApiClient
   */
  async positionExit(payload) {
    const endpointPath = "/fe/api.php?action=sellPosition";
    const responseData = await this.doRequest(endpointPath, payload);

    return userPositionItemTransform(responseData);
  }
}

// JS export by default guarantee a singleton instance if we export the class
// instance, see:
// https://medium.com/@lazlojuly/are-node-js-modules-singletons-764ae97519af
const client = new TradeApiClient();
Object.freeze(client);

export default client;
