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
  quotesResponseTransform,
  basesResponseTransform,
  connectedProviderUserInfoResponseTransform,
  providerGetResponseTransform,
  serverTimeResponseTransform,
  coinRayTokenResponseTransform,
  exchangeMarketDataResponseTransform,
  exchangeListResponseTransform,
  ownCopyTraderProvidersOptionsResponseTransform,
  providerFollowersResponseTransform,
  providerFollowersListResponseTransform,
  exchangeAssetsResponseTransform,
  exchangeDepositAddressResponseTransform,
  providerPerformanceResponseTransform,
  exchangeDepositsResponseTransform,
  withdrawResponseTransform,
  exchangeWithdrawsResponseTransform,
  userGetResponseTransform,
  providerExchangeSettingsResponseTransform,
  providerDataPointsResponseTransform,
  convertAssetResponseTransform,
} from "./tradeApiClient.types";

/**
 * @typedef {import('./tradeApiClient.types').AuthorizationPayload} AuthorizationPayload
 * @typedef {import('./tradeApiClient.types').UserEquityPayload} UserEquityPayload
 * @typedef {import('./tradeApiClient.types').PositionActionPayload} PositionActionPayload
 * @typedef {import('./tradeApiClient.types').PositionEntity} PositionEntity
 * @typedef {import('./tradeApiClient.types').PositionsListPayload} PositionsListPayload
 * @typedef {import('./tradeApiClient.types').ProvidersCollection} ProvidersCollection
 * @typedef {import('./tradeApiClient.types').ProvidersPayload} ProvidersPayload
 * @typedef {import('./tradeApiClient.types').ProvidersStatsCollection} ProvidersStatsCollection
 * @typedef {import('./tradeApiClient.types').ProvidersStatsPayload} ProvidersStatsPayload
 * @typedef {import('./tradeApiClient.types').UserCreatePayload} UserCreatePayload
 * @typedef {import('./tradeApiClient.types').UserCreateResponse} UserCreateResponse
 * @typedef {import('./tradeApiClient.types').UserLoginPayload} UserLoginPayload
 * @typedef {import('./tradeApiClient.types').UserLoginResponse} UserLoginResponse
 * @typedef {import('./tradeApiClient.types').UserPositionsCollection} UserPositionsCollection
 * @typedef {import('./tradeApiClient.types').GetProviderPayload} GetProviderPayload
 * @typedef {import('./tradeApiClient.types').GetProviderFollowersPayload} GetProviderFollowersPayload
 * @typedef {import('./tradeApiClient.types').ConnectProviderPayload} ConnectProviderPayload
 * @typedef {import('./tradeApiClient.types').DisableProviderPayload} DisableProviderPayload
 * @typedef {import('./tradeApiClient.types').EditProvderPayload} EditProvderPayload
 * @typedef {import('./tradeApiClient.types').BaseAssetsPayload} BaseAssetsPayload
 * @typedef {import('./tradeApiClient.types').ExchangeAssetsPayload} ExchangeAssetsPayload
 * @typedef {import('./tradeApiClient.types').ConnectedProviderUserInfoPayload} ConnectedProviderUserInfoPayload
 * @typedef {import('./tradeApiClient.types').ConnectedProviderUserInfo} ConnectedProviderUserInfo
 * @typedef {import('./tradeApiClient.types').CoinRayToken} CoinRayToken
 * @typedef {import('./tradeApiClient.types').MarketSymbolsCollection} MarketSymbolsCollection
 * @typedef {import('./tradeApiClient.types').CopyTradersProvidersOptionsPayload} CopyTradersProvidersOptionsPayload
 * @typedef {import('./tradeApiClient.types').CopyTradersProvidersOptionsCollection} CopyTradersProvidersOptionsCollection
 * @typedef {import('./tradeApiClient.types').ExchangeAddPayload} ExchangeAddPayload
 * @typedef {import('./tradeApiClient.types').ExchangeDeletePayload} ExchangeDeletePayload
 * @typedef {import('./tradeApiClient.types').ExchangeUpdatePayload} ExchangeUpdatePayload
 * @typedef {import('./tradeApiClient.types').ProviderExchangeSettingsPayload} ProviderExchangeSettingsPayload
 * @typedef {import('./tradeApiClient.types').ProviderExchangeSettingsUpdatePayload} ProviderExchangeSettingsUpdatePayload
 * @typedef {import('./tradeApiClient.types').DepositAddressGetPayload} DepositAddressGetPayload
 * @typedef {import('./tradeApiClient.types').ExchangeAssetsDict} ExchangeAssetsDict
 * @typedef {import('./tradeApiClient.types').CreatePositionPayload} CreatePositionPayload
 * @typedef {import('./tradeApiClient.types').UpdatePositionPayload} UpdatePositionPayload
 * @typedef {import('./tradeApiClient.types').ExchangeDepositEntity} ExchangeDepositEntity
 * @typedef {import('./tradeApiClient.types').ExchangeWithdrawEntity} ExchangeWithdrawEntity
 * @typedef {import('./tradeApiClient.types').GetExchangeLastDepositsPayload} GetExchangeLastDepositsPayload
 * @typedef {import('./tradeApiClient.types').WithdrawPayload} WithdrawPayload
 * @typedef {import('./tradeApiClient.types').ConvertPayload} ConvertPayload
 * @typedef {import('./tradeApiClient.types').WithdrawReply} WithdrawReply
 * @typedef {import('./tradeApiClient.types').ModifySubscriptionPayload} ModifySubscriptionPayload
 * @typedef {import('./tradeApiClient.types').CancelSubscriptionPayload} CancelSubscriptionPayload
 * @typedef {import('./tradeApiClient.types').UpdatePasswordPayload} UpdatePasswordPayload
 * @typedef {import('./tradeApiClient.types').TwoFAPayload} TwoFAPayload
 * @typedef {import('./tradeApiClient.types').ConvertReply} ConvertReply
 */

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
      method: payload ? "POST" : "GET",
      ...(payload && {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.GATSBY_API_KEY || "",
        },
      }),
    };

    try {
      const response = await fetch(requestUrl, options);
      if (response.status === 200) {
        responseData = await response.json();
      } else {
        responseData.error = await response.json();
      }
    } catch (e) {
      responseData.error = e.message;
    }

    if (responseData.error) {
      const customError = responseData.error.error;
      throw customError;
    }

    return responseData;
  }

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
   * Get user open trading positions.
   *
   * @param {PositionsListPayload} payload User authorization payload.

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
   * @param {PositionsListPayload} payload User authorization payload.

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
   * @param {PositionsListPayload} payload User authorization payload.

   * @returns {Promise<UserPositionsCollection>} Promise that resolve user positions collection.
   *
   * @memberof TradeApiClient
   */
  async logPositionsGet(payload) {
    const endpointPath = "/fe/api.php?action=getClosedPositions";
    const responseData = await this.doRequest(endpointPath, {
      type: "allClosedExtended",
      ...payload,
    });

    return userPositionsResponseTransform(responseData);
  }

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
   * @param {UserEquityPayload} payload
   * @returns
   * @memberof TradeApiClient
   */

  async userBalanceGet(payload) {
    const endpointPath = "/fe/api.php?action=getQuickExchangeSummary";
    const responseData = await this.doRequest(endpointPath, payload);

    return userBalanceResponseTransform(responseData);
  }

  /**
   *
   *
   * @param {UserEquityPayload} payload
   * @returns
   * @memberof TradeApiClient
   */

  async userEquityGet(payload) {
    const endpointPath = "/fe/api.php?action=getHistoricalBalance";
    const responseData = await this.doRequest(endpointPath, payload);

    return userEquityResponseTransform(responseData);
  }

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
   * Close a position.
   *
   * @param {PositionActionPayload} payload Position action payload.

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
   * @param {PositionActionPayload} payload Position action payload.

   * @returns {Promise<PositionEntity>} Promise that resolve user affected position entity.
   *
   * @memberof TradeApiClient
   */
  async positionExit(payload) {
    const endpointPath = "/fe/api.php?action=sellPosition";
    const responseData = await this.doRequest(endpointPath, payload);

    return userPositionItemTransform(responseData);
  }

  /**
   * Get a position.
   *
   * @param {PositionActionPayload} payload Position action payload.

   * @returns {Promise<PositionEntity>} Promise that resolve user affected position entity.
   *
   * @memberof TradeApiClient
   */
  async positionGet(payload) {
    const endpointPath = "/fe/api.php?action=getPosition";
    const responseData = await this.doRequest(endpointPath, payload);

    return userPositionItemTransform(responseData);
  }

  /**
   * @typedef {import('./tradeApiClient.types').ReadOnlyPayload} ReadOnlyPayload
   * @typedef {import('./tradeApiClient.types').QuoteAssetsDict} QuoteAssetsDict
   * @typedef {import('./tradeApiClient.types').BaseAssetsDict} BaseAssetsDict
   */

  /**
   *
   * Get quote assets.
   *
   * @param {ReadOnlyPayload} payload
   * @returns {Promise<QuoteAssetsDict>} Promise that resolves quote assets.
   * @memberof TradeApiClient
   */

  async quotesAssetsGet(payload) {
    const endpointPath = "/fe/api.php?action=getQuoteAssets";
    const responseData = await this.doRequest(endpointPath, payload);

    return quotesResponseTransform(responseData);
  }

  /**
   * Get providers profits stats.
   *
   * @param {GetProviderPayload} payload Get providers stats payload.

   * @returns {Promise<*>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async providerGet(payload) {
    const endpointPath = "/fe/api.php?action=getProvider";
    const responseData = await this.doRequest(endpointPath, payload);

    return providerGetResponseTransform(responseData);
  }
  /**
   * @typedef {import('./tradeApiClient.types').ServerTime} ServerTime
   */

  /**
   * Get Trade API server time.
   *
   * @param {AuthorizationPayload} payload User authorization.
   * @returns {Promise<ServerTime>} Promise that resolves server time value object.
   *
   * @memberof TradeApiClient
   */
  async serverTimeGet(payload) {
    const endpointPath = "/fe/ohlc.php?action=fetchTime";
    const responseData = await this.doRequest(endpointPath, payload);

    return serverTimeResponseTransform(responseData);
  }

  /**
   * Get a coinray access token for authenticated Trade API user.
   *
   * @param {AuthorizationPayload} payload User authorization.
   * @returns {Promise<CoinRayToken>} Promise that resolves server time value object.
   *
   * @memberof TradeApiClient
   */
  async coinRayTokenGet(payload) {
    const endpointPath = "/fe/api.php?action=getCoinRayToken";
    const responseData = await this.doRequest(endpointPath, payload);

    return coinRayTokenResponseTransform(responseData);
  }

  /**
   * Get user exchange connnection market data.
   *
   * @param {AuthorizationPayload} payload Authorized exchange data payload.
   * @returns {Promise<MarketSymbolsCollection>} Promise that resolves exchange market (symbols) data collection.
   *
   * @memberof TradeApiClient
   */
  async exchangeConnectionMarketDataGet(payload) {
    const endpointPath = "/fe/api.php?action=getPairsNew";
    const responseData = await this.doRequest(endpointPath, payload);

    return exchangeMarketDataResponseTransform(responseData);
  }

  /**
   *
   * Get quote assets.
   *
   * @param {BaseAssetsPayload} payload
   * @returns {Promise<BaseAssetsDict>} Promise that resolves base assets.
   * @memberof TradeApiClient
   */

  async baseAssetsGet(payload) {
    const endpointPath = "/fe/api.php?action=getBaseAssets";
    const responseData = await this.doRequest(endpointPath, payload);

    return basesResponseTransform(responseData);
  }

  /**
   *
   * Get exchange assets.
   *
   * @param {ExchangeAssetsPayload} payload
   * @returns {Promise<ExchangeAssetsDict>} Promise that resolves exchange assets.
   * @memberof TradeApiClient
   */

  async exchangeAssetsGet(payload) {
    const endpointPath = "/fe/api.php?action=getExchangeAssets";
    const responseData = await this.doRequest(endpointPath, payload);

    return exchangeAssetsResponseTransform(responseData);
  }

  /**
   *
   * Get connected provider user info.
   *
   * @param {ConnectedProviderUserInfoPayload} payload
   * @returns {Promise<ConnectedProviderUserInfo>} Promise that resolves connected trader user info.
   * @memberof TradeApiClient
   */

  async connectedProviderUserInfoGet(payload) {
    const endpointPath = "/fe/api.php?action=getCurrentAllocatedAndProfitSinceFollowing";
    const responseData = await this.doRequest(endpointPath, payload);

    return connectedProviderUserInfoResponseTransform(responseData);
  }

  /**
   * Get providers profits stats.
   *
   * @param {ConnectProviderPayload} payload Get providers stats payload.

   * @returns {Promise<*>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async providerConnect(payload) {
    const endpointPath = "/fe/api.php?action=createProvider";
    const responseData = await this.doRequest(endpointPath, payload);

    return responseData;
  }

  /**
   * Get providers profits stats.
   *
   * @param {DisableProviderPayload} payload Get providers stats payload.

   * @returns {Promise<*>}
   *
   * @memberof TradeApiClient
   */

  async providerDisable(payload) {
    const endpointPath = "/fe/api.php?action=toggleProvider";
    const responseData = await this.doRequest(endpointPath, payload);

    return responseData;
  }

  /**
   * Get providers profits stats.
   *
   * @param {AuthorizationPayload} payload Get providers stats payload.

   * @returns {Promise<*>}
   *
   * @memberof TradeApiClient
   */

  async exchangeListGet(payload) {
    const endpointPath = "/fe/api.php?action=getExchangeList";
    const responseData = await this.doRequest(endpointPath, payload);

    return exchangeListResponseTransform(responseData);
  }
  /**
   * Get copy trader providers options.
   *
   * @param {CopyTradersProvidersOptionsPayload} payload Get own copy trader providers options payload.
   * @returns {Promise<CopyTradersProvidersOptionsCollection>} Promise that resolves own copy trader providers options.
   * @memberof TradeApiClient
   */
  async userOwnCopyTradersProvidersOptions(payload) {
    const endpointPath = "/fe/api.php?action=getCopyTradingProvidersOptions";
    const responseData = await this.doRequest(endpointPath, payload);

    return ownCopyTraderProvidersOptionsResponseTransform(responseData);
  }

  /**
   * Connect to a new exchange.
   *
   * @param {ExchangeAddPayload} payload Payload
   * @returns {Promise<boolean>} Result
   * @memberof TradeApiClient
   */
  async exchangeAdd(payload) {
    const endpointPath = "/fe/api.php?action=addExchange";
    const responseData = await this.doRequest(endpointPath, payload);
    return responseData;
  }

  /**
   * Delete an exchange.
   *
   * @param {ExchangeDeletePayload} payload Payload
   * @returns {Promise<boolean>} Result
   * @memberof TradeApiClient
   */
  async exchangeDelete(payload) {
    const endpointPath = "/fe/api.php?action=delNewExchange";
    const responseData = await this.doRequest(endpointPath, payload);
    return responseData;
  }

  /**
   * Update an exchange.
   *
   * @param {ExchangeUpdatePayload} payload Payload
   * @returns {Promise<boolean>} Result
   * @memberof TradeApiClient
   */
  async exchangeUpdate(payload) {
    const endpointPath = "/fe/api.php?action=updateNewExchange";
    const responseData = await this.doRequest(endpointPath, payload);
    return responseData;
  }

  /**
   * Get providers profits stats.
   *
   * @param {EditProvderPayload} payload Get providers stats payload.
   *
   * @returns {Promise<*>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async providerEdit(payload) {
    const endpointPath = "/fe/api.php?action=editProvider";
    const responseData = await this.doRequest(endpointPath, payload);

    return responseData;
  }

  /**
   * Get providers profits stats.
   *
   * @param {GetProviderFollowersPayload} payload Get providers stats payload.
   *
   * @returns {Promise<*>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async providerFollowersGet(payload) {
    const endpointPath = "/fe/api.php?action=getFollowersChartForProvider";
    const responseData = await this.doRequest(endpointPath, payload);

    return providerFollowersResponseTransform(responseData);
  }

  /**
   * Get providers profits stats.
   *
   * @param {GetProviderFollowersPayload} payload Get providers stats payload.
   *
   * @returns {Promise<*>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async providerFollowersListGet(payload) {
    const endpointPath = "/fe/api.php?action=getFollowersList";
    const responseData = await this.doRequest(endpointPath, payload);

    return providerFollowersListResponseTransform(responseData);
  }

  /**
   * Get deposit address for coin.
   *
   * @param {DepositAddressGetPayload} payload Get deposit address payload

   * @returns {Promise<*>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async exchangeDepositAddressGet(payload) {
    const endpointPath = "/fe/api.php?action=getExchangeDepositAddress";
    const responseData = await this.doRequest(endpointPath, payload);

    return exchangeDepositAddressResponseTransform(responseData);
  }

  /**
   * Create manual position.
   *
   * @param {CreatePositionPayload} payload Create manual position payload.

   * @returns {Promise<string>} Promise that resolve created position ID.
   *
   * @memberof TradeApiClient
   */
  async manualPositionCreate(payload) {
    const endpointPath = "/fe/api.php?action=createManualPosition";
    const responseData = await this.doRequest(endpointPath, payload);

    return responseData;
  }

  /**
   * Update manual position.
   *
   * @param {UpdatePositionPayload} payload Update manual position payload.

   * @returns {Promise<PositionEntity>} Promise that resolve updated position entity.
   *
   * @memberof TradeApiClient
   */
  async manualPositionUpdate(payload) {
    const endpointPath = "/fe/api.php?action=newUpdatePosition3";
    const responseData = await this.doRequest(endpointPath, payload);

    return userPositionItemTransform(responseData);
  }

  /**
   * Get providers profits stats.
   *
   * @param {GetProviderFollowersPayload} payload Get providers stats payload.
   * @returns {Promise<*>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async providerPerformanceGet(payload) {
    const endpointPath = "/fe/api.php?action=getProviderPerformance";
    const responseData = await this.doRequest(endpointPath, payload);

    return providerPerformanceResponseTransform(responseData);
  }

  /**
   * Get providers profits stats.
   *
   * @param {AuthorizationPayload} payload Get providers stats payload.

   * @returns {Promise<*>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async userDataGet(payload) {
    const endpointPath = "/fe/api.php?action=getUserData";
    const responseData = await this.doRequest(endpointPath, payload);

    return userGetResponseTransform(responseData);
  }

  /**
   * Get providers profits stats.
   *
   * @param {ProviderExchangeSettingsPayload} payload Get providers stats payload.

   * @returns {Promise<*>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async providerExchangeSettingsGet(payload) {
    const endpointPath = "/fe/api.php?action=getProviderExchangeSettings";
    const responseData = await this.doRequest(endpointPath, payload);

    return providerExchangeSettingsResponseTransform(responseData);
  }

  /**
   * Get providers profits stats.
   *
   * @param {ProviderExchangeSettingsUpdatePayload} payload Get providers stats payload.

   * @returns {Promise<*>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async providerExchangeSettingsUpdate(payload) {
    const endpointPath = "/fe/api.php?action=updateProviderExchangeSettingsNew";
    const responseData = await this.doRequest(endpointPath, payload);

    return responseData;
  }

  /**
   * Get providers profits stats.
   *
   * @param {GetProviderFollowersPayload} payload Get providers stats payload.

   * @returns {Promise<*>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async providerCopyTradingDataPointsGet(payload) {
    const endpointPath = "/fe/api.php?action=getCopyTradingDataPoints";
    const responseData = await this.doRequest(endpointPath, payload);

    return providerDataPointsResponseTransform(responseData);
  }

  /**
   * @param {GetExchangeLastDepositsPayload} payload Get exchange last deposits payload.
   * @returns {Promise<Array<ExchangeDepositEntity>>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async exchangeLastDepositsGet(payload) {
    const endpointPath = "/fe/api.php?action=getExchangeLastDeposits";
    const responseData = await this.doRequest(endpointPath, payload);

    return exchangeDepositsResponseTransform(responseData);
  }

  /**
   * Get providers profits stats.
   *
   * @param {GetExchangeLastDepositsPayload} payload Get exchange last withdrawals payload.
   * @returns {Promise<Array<ExchangeWithdrawEntity>>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async exchangeLastWithdrawalsGet(payload) {
    const endpointPath = "/fe/api.php?action=getExchangeLastWithdrawals";
    const responseData = await this.doRequest(endpointPath, payload);

    return exchangeWithdrawsResponseTransform(responseData);
  }

  /**
   * Withdraw currency to a different address.
   *
   * @param {WithdrawPayload} payload Withdraw payload.
   * @returns {Promise<WithdrawReply>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async withdraw(payload) {
    const endpointPath = "/fe/api.php?action=exchangeWithdraw";
    const responseData = await this.doRequest(endpointPath, payload);

    return withdrawResponseTransform(responseData);
  }

  /**
   * Modify user's subscription fron users table in traders profile.
   *
   * @param {ModifySubscriptionPayload} payload payload.
   * @returns {Promise<WithdrawReply>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async modifySubscription(payload) {
    const endpointPath = "/fe/api.php?action=modifyFollowerSubscriptionDuration";
    const responseData = await this.doRequest(endpointPath, payload);

    return responseData;
  }

  /**
   * Cancel user's subscription fron users table in traders profile.
   *
   * @param {CancelSubscriptionPayload} payload payload.
   * @returns {Promise<WithdrawReply>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async cancelSubscription(payload) {
    const endpointPath = "/fe/api.php?action=cancelFollowerSubscription";
    const responseData = await this.doRequest(endpointPath, payload);

    return responseData;
  }

  /**
   * Convert small balances to BNB
   *
   * @param {ConvertPayload} payload Convert payload.
   * @returns {Promise<ConvertReply>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async convert(payload) {
    const endpointPath = "/fe/api.php?action=exchangeDustTransfer";
    const responseData = await this.doRequest(endpointPath, payload);

    return convertAssetResponseTransform(responseData);
  }

  /**
   * Change password.
   *
   * @param {UpdatePasswordPayload} payload Change password payload.
   * @returns {Promise<*>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async updatePassword(payload) {
    const endpointPath = "/fe/api.php?action=changePassword";
    const responseData = await this.doRequest(endpointPath, payload);

    return responseData;
  }

  /**
   * Get code to enable 2FA.
   *
   * @param {AuthorizationPayload} payload Payload
   * @returns {Promise<Array<string>>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async enable2FA1Step(payload) {
    const endpointPath = `/fe/api.php?action=enable2FA1Step&token=${payload.token}`;
    const responseData = await this.doRequest(endpointPath, null);

    return responseData;
  }

  /**
   * Enable 2FA.
   *
   * @param {TwoFAPayload} payload Payload
   * @returns {Promise<Boolean>} Returns promise.
   *
   * @memberof TradeApiClient
   */
  async enable2FA2Step(payload) {
    const endpointPath = `/fe/api.php?action=enable2FA2Step`;
    const responseData = await this.doRequest(endpointPath, payload);

    return responseData;
  }
}

// JS export by default guarantee a singleton instance if we export the class
// instance, see:
// https://medium.com/@lazlojuly/are-node-js-modules-singletons-764ae97519af
const client = new TradeApiClient();
Object.freeze(client);

export default client;
