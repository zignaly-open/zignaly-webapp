import client from "../src/services/tradeApiClient";
// import faker from "faker";
import { assert } from "chai";
import {
  POSITION_SIDE_LONG,
  POSITION_ENTRY_TYPE_LIMIT,
} from "../src/services/tradeApiClient.types";
import { positionEntityStructureAssertions } from "./utils/positionAssertions";

describe("Consume tradeApiClient service", () => {
  // Shared user and access token across scenarios.
  let accessToken = null;

  // Shared user session for test scenarios that require access token.
  beforeAll(async () => {
    const loginPayload = {
      email: process.env.GATSBY_API_TEST_USER,
      password: process.env.GATSBY_API_TEST_PASS,
      gRecaptchaResponse: "",
    };

    const userEntity = await client.userLogin(loginPayload);

    accessToken = userEntity.token;
  });

  it("should login a user", async () => {
    const payload = {
      email: process.env.GATSBY_API_TEST_USER,
      password: process.env.GATSBY_API_TEST_PASS,
      gRecaptchaResponse: "",
    };

    const userEntity = await client.userLogin(payload);
    assert.equal(userEntity.firstName, "Tole", "User firstName violates expected value.");
    assert.equal(
      userEntity.email,
      process.env.GATSBY_API_TEST_USER,
      "User email violates expected value.",
    );
    assert.lengthOf(userEntity.token, 32, "Token seems to be invalid.");
  });

  it("should get ReCaptcha error when login a user", async () => {
    const payload = {
      email: process.env.GATSBY_API_TEST_USER,
      password: process.env.GATSBY_API_TEST_PASS,
      gRecaptchaResponse: "",
    };

    // Temporal store of the API key for later restore.
    const apiSecretKey = process.env.GATSBY_API_KEY;
    // Empty the key so is not passed in the Trade API request header.
    process.env.GATSBY_API_KEY = "";

    try {
      await client.userLogin(payload);
    } catch (error) {
      assert.isObject(error, "Error is not an object.");
      assert.isNumber(error.code, "Error code is not a number.");
      assert.equal(error.code, 76, "Error type code is no 76 as expected.");
    }

    // Restore the API key for next scenarios.
    process.env.GATSBY_API_KEY = apiSecretKey;
  });

  it("should get new v2 user open positions", async () => {
    const payload = {
      token: accessToken,
      internalExchangeId: "Binance1578301457_5e12f811deda4",
    };

    const positionsCollection = await client.openPositionsGet(payload);
    assert.isArray(positionsCollection, "Positions collection is not an array.");
    assert.isAtLeast(positionsCollection.length, 2, "Less than expected total positions.");
    assert.isObject(positionsCollection[0], "First collection position item is not an object.");
    assert.isObject(positionsCollection[1], "Second collection position item is not an object.");
    positionEntityStructureAssertions(positionsCollection[0]);
    positionEntityStructureAssertions(positionsCollection[1]);
  }, 15000);

  it("should get user closed positions", async () => {
    const payload = {
      token: accessToken,
      internalExchangeId: "Binance1578301457_5e12f811deda4",
    };

    const positionsCollection = await client.closedPositionsGet(payload);
    assert.isArray(positionsCollection, "Positions collection is not an array.");
    assert.isAtLeast(positionsCollection.length, 10, "Less than expected total positions.");
    assert.isObject(positionsCollection[0], "First collection position item is not an object.");
    assert.isObject(positionsCollection[1], "Second collection position item is not an object.");
    positionEntityStructureAssertions(positionsCollection[0]);
    positionEntityStructureAssertions(positionsCollection[1]);
  }, 15000);

  it("should get user log positions", async () => {
    const payload = {
      token: accessToken,
      internalExchangeId: "Binance1578301457_5e12f811deda4",
    };

    const positionsCollection = await client.logPositionsGet(payload);
    assert.isArray(positionsCollection, "Positions collection is not an array.");
    assert.isAtLeast(positionsCollection.length, 10, "Less than expected total positions.");
    assert.isObject(positionsCollection[0], "First collection position item is not an object.");
    assert.isObject(positionsCollection[1], "Second collection position item is not an object.");
    positionEntityStructureAssertions(positionsCollection[0]);
    positionEntityStructureAssertions(positionsCollection[2]);
    // As log positions retrieve unopened the closeDate should be 0.
    assert.equal(
      positionsCollection[0].closed,
      true,
      "First collection position item closed flag is not true.",
    );
    assert.equal(
      positionsCollection[2].closed,
      true,
      "Second collection position item closed flag is not true.",
    );
  }, 15000);

  it("should get all the providers", async () => {
    const getProvidersPayload = {
      token: accessToken,
      type: "all",
      ro: true,
      copyTradersOnly: true,
      timeFrame: 90,
    };
    const providersCollection = await client.providersGet(getProvidersPayload);
    assert.isArray(providersCollection, "Providers collection is not an array.");
    assert.isObject(providersCollection[0], "First collection provider element is not an object.");
    assert.isString(providersCollection[0].id, "First collection provider ID is not a string.");
  }, 10000);

  it("should get user exchange connections", async () => {
    const getExchangeConnectionPayload = {
      token: accessToken,
    };

    const exchangeConnections = await client.userExchangesGet(getExchangeConnectionPayload);
    assert.isArray(exchangeConnections, "Exchange connection is not an array.");
  }, 5000);

  it("should get user balance", async () => {
    const getBalancePayload = {
      token: accessToken,
      exchangeInternalId: "Binance1578301457_5e12f811deda4",
    };

    const userBalance = await client.userBalanceGet(getBalancePayload);
    assert.isObject(userBalance, "User Balance is not an object");
  }, 25000);

  it("should get user's daily balance", async () => {
    const payload = {
      token: accessToken,
      exchangeInternalId: "Binance1578301457_5e12f811deda4",
    };

    const equity = await client.userEquityGet(payload);
    assert.isObject(equity, "Equity is not an object.");
    assert.isArray(equity.balances, "Equity balances property is not an array.");
  }, 25000);

  it("should get provider profits stats", async () => {
    const payload = {
      token: accessToken,
      ro: true,
      quote: "BTC",
      base: "all",
      timeFrame: "2months",
      DCAFilter: "withoutDCA",
    };

    const providersStats = await client.providersStatsGet(payload);
    assert.isArray(providersStats, "Provider stats is not an array.");
    assert.isObject(providersStats[0], "First stats is not an object.");
    assert.isString(providersStats[0].providerId, "First provider ID is not a string.");
  }, 20000);

  it("should get quote assets", async () => {
    const payload = {
      token: accessToken,
      ro: true,
    };

    const quoteAssets = await client.quotesAssetsGet(payload);
    assert.isObject(quoteAssets, "Quote assets is not an object.");
    assert.isObject(quoteAssets.BTC, "BTC quote is not an object.");
    assert.isString(quoteAssets.BTC.quote, "BTC quote is not a string.");
  });

  it("should get server time", async () => {
    const payload = {
      token: accessToken,
    };

    const serverTime = await client.serverTimeGet(payload);
    assert.isObject(serverTime, "Server time is not an object.");
    assert.isNumber(serverTime.serverTime, "Server time 'serverTime' is not a number.");
    assert.isAtLeast(serverTime.serverTime, 100000, "Time seems to be invalid.");
    assert.isNumber(serverTime.dbTime, "Server time 'dbTime' is not a number.");
  });

  it("should get coinray token", async () => {
    const payload = {
      token: accessToken,
    };

    const coinRayToken = await client.coinRayTokenGet(payload);
    assert.isObject(coinRayToken, "Coinray token is not an object.");
    assert.isString(coinRayToken.jwt, "Coinray token 'jwt' is not a string.");
    assert.isAtLeast(coinRayToken.jwt.length, 200, "Token seems to be invalid.");
  });

  it("should get bases assets", async () => {
    const payload = {
      token: accessToken,
      quote: "USDT",
      ro: true,
    };

    const basesAssets = await client.baseAssetsGet(payload);
    assert.isObject(basesAssets, "Base assets is not an object.");
    assert.isObject(basesAssets.BTC, "BTC quote is not an object.");
  }, 15000);

  it("should get exchange connection market data", async () => {
    const payload = {
      token: accessToken,
      exchangeInternalId: "Binance1578301457_5e12f811deda4",
    };

    const marketData = await client.exchangeConnectionMarketDataGet(payload);
    assert.isArray(marketData, "Market data is not an array of symbols.");
    assert.isObject(marketData[0], "First market symbol item is not an object.");
    assert.isString(marketData[0].id, "First market id is not string.");
    assert.isString(marketData[0].symbol, "First market symbol is not string.");
    assert.isString(marketData[0].base, "First market symbol base is not string.");
    assert.isString(marketData[0].quote, "First market symbol quote is not string.");
    assert.isObject(marketData[0].limits, "First market symbol limits is not an object.");
    assert.isObject(marketData[0].limits.cost, "First market symbol limits cost is not an object.");
    assert.isObject(
      marketData[0].limits.price,
      "First market symbol limits price is not an object.",
    );
    assert.isObject(
      marketData[0].limits.amount,
      "First market symbol limits amount is not an object.",
    );
    assert.isObject(marketData[0].precision, "First market symbol precision is not an object.");
    assert.isNumber(
      marketData[0].precision.amount,
      "First market symbol precision amount is not an object.",
    );
    assert.isNumber(
      marketData[0].precision.price,
      "First market symbol precision price is not an object.",
    );
    assert.isNumber(
      marketData[0].precision.base,
      "First market symbol precision base is not an object.",
    );
    assert.isNumber(
      marketData[0].precision.quote,
      "First market symbol precision quote is not an object.",
    );
  });

  it("should get user owned copy traders options list", async () => {
    const payload = {
      token: accessToken,
      internalExchangeId: "Binance1578301457_5e12f811deda4",
    };

    const copyTradersOptions = await client.ownedCopyTradersProvidersOptions(payload);
    assert.isArray(copyTradersOptions, "Copy traders options is not an array.");

    // Validate all options response structure.
    copyTradersOptions.forEach((copyTraderOption) => {
      assert.isString(copyTraderOption.providerName, "First option providerName is not string.");

      assert.isNumber(
        copyTraderOption.providerConsumedBalance,
        "Consumed balance is not a number.",
      );

      assert.isNumber(
        copyTraderOption.providerConsumedBalancePercentage,
        "Consumed balance percentage is not a number.",
      );

      assert.isNumber(copyTraderOption.providerPayableBalance, "Payable balance is not a number.");
    });
  }, 10000);

  it("should get details of provider", async () => {
    const payload = {
      token: accessToken,
      providerId: "5ebdc98dda8e96310c265c55",
      version: 2,
    };

    const provider = await client.providerGet(payload);
    assert.isObject(provider, "response is not an object.");
    assert.isString(provider.id, "response does not have the provider id.");
  }, 10000);

  it("should get list of all exchanges support by zignaly", async () => {
    const payload = {
      token: accessToken,
    };

    const exchangeList = await client.exchangeListGet(payload);
    assert.isArray(exchangeList, "Exchange list is not an array.");
  }, 10000);

  it("should create and update manual market order position", async () => {
    const payload = {
      token: accessToken,
      type: POSITION_ENTRY_TYPE_LIMIT,
      pair: "BTC USDT",
      positionSize: 100,
      positionSizeQuote: "USDT",
      side: POSITION_SIDE_LONG,
      limitPrice: 10200.456,
      stopLossPercentage: false,
      buyTTL: false,
      buyStopPrice: 0,
      sellByTTL: 0,
      takeProfitTargets: [
        {
          targetId: 1,
          priceTargetPercentage: 10,
          quoteTarget: 0.37543,
          amountPercentage: 100,
          value: 293,
        },
      ],
      reBuyTargets: [
        {
          targetId: 1,
          priceTargetPercentage: 1.3,
          amountPercentage: 0.5,
        },
      ],
      trailingStopTriggerPercentage: false,
      trailingStopPercentage: false,
      providerId: 1,
      providerName: "Manual Trading",
      exchangeName: "Binance",
      internalExchangeId: "Binance1578301457_5e12f811deda4",
    };

    const positionId = await client.manualPositionCreate(payload);
    assert.isString(positionId, "Create position ID is not a string.");
    assert.lengthOf(positionId, 24, "Created position ID don't have expected length.");

    const updatePayload = {
      token: accessToken,
      positionId,
      providerId: payload.providerId,
      providerName: payload.providerName,
      trailingStopTriggerPercentage: 5,
      trailingStopPercentage: 3,
      takeProfitTargets: payload.takeProfitTargets,
      stopLossPercentage: 3,
      reBuyTargets: [
        {
          targetId: 1,
          priceTargetPercentage: 5,
          amountPercentage: 50,
        },
      ],
      internalExchangeId: payload.internalExchangeId,
    };

    const updatedPositionId = await client.manualPositionUpdate(updatePayload);
    assert.isString(updatedPositionId, "Response is not a position ID string.");

    // Get the position entity after the update to check the changes.
    const updatedPositionEntity = await client.positionGet({
      token: accessToken,
      positionId: updatedPositionId,
      internalExchangeId: payload.internalExchangeId,
    });

    assert.equal(
      updatedPositionEntity.reBuyTargets["1"].triggerPercentage,
      5,
      "DCA target percentage don't match the expected value.",
    );

    assert.equal(
      updatedPositionEntity.reBuyTargets["1"].quantity,
      50,
      "DCA target amount amount don't match the expected value.",
    );

    assert.equal(
      updatedPositionEntity.takeProfitTargets["1"].amountPercentage,
      100,
      "Take profit target percentage don't match the expected value.",
    );

    assert.isAtLeast(
      updatedPositionEntity.takeProfitTargets["1"].priceTargetPercentage,
      10,
      "Take profit target price don't match the expected value.",
    );
  }, 25000);

  it("should get position by ID", async () => {
    const payload = {
      token: accessToken,
      positionId: "5f0c715ce3975f63f47a2ef8",
      internalExchangeId: "Binance1578301457_5e12f811deda4",
    };

    const positionEntity = await client.positionGet(payload);
    positionEntityStructureAssertions(positionEntity);
  });

  it("should get trading performance data for a provider", async () => {
    const payload = {
      token: accessToken,
      providerId: "5ebdc98dda8e96310c265c55",
    };

    const provider = await client.providerPerformanceGet(payload);
    assert.isObject(provider, "response is not an object.");
    assert.isArray(provider.weeklyStats, "response does not have the weekly performance data.");
  }, 10000);

  it("should get user profile data", async () => {
    const payload = {
      token: accessToken,
    };

    const userData = await client.userDataGet(payload);
    assert.isObject(userData, "response is not an object.");
    assert.isString(userData.userId, "response is missing user ID.");
  }, 10000);

  it("should get copy trading points data for a provider", async () => {
    const payload = {
      token: accessToken,
      providerId: "5ebdc98dda8e96310c265c55",
    };

    const dataPoints = await client.providerCopyTradingDataPointsGet(payload);
    assert.isObject(dataPoints, "response is not an object.");
  }, 10000);

  it("should get assets for the exchange account", async () => {
    const payload = {
      token: accessToken,
      internalId: "Zignaly1586867845_5e95ae85e21ea",
    };

    const assets = await client.exchangeAssetsGet(payload);
    assert.isObject(assets, "response is not an object.");
    assert.isObject(assets.BTC, "response does not have the BTC asset.");
  }, 10000);

  it("should get deposit history for the exchange account", async () => {
    const payload = {
      token: accessToken,
      internalId: "Zignaly1586867845_5e95ae85e21ea",
    };

    const assets = await client.exchangeLastDepositsGet(payload);
    assert.isArray(assets, "response is not an array.");
  }, 10000);

  it("should get withdraw history for the exchange account", async () => {
    const payload = {
      token: accessToken,
      internalId: "Zignaly1586867845_5e95ae85e21ea",
    };

    const assets = await client.exchangeLastWithdrawalsGet(payload);
    assert.isArray(assets, "response is not an array.");
  }, 10000);

  it("should get deposit address for asset", async () => {
    const payload = {
      token: accessToken,
      internalId: "Zignaly1586867845_5e95ae85e21ea",
      asset: "BTC",
      network: "BTC",
    };

    const addressResponse = await client.exchangeDepositAddressGet(payload);
    assert.isObject(addressResponse, "response is not an object.");
    assert.equal(addressResponse.currency, "BTC");
    assert.isString(addressResponse.address, "Address is not a string");
  }, 10000);

  it("should get 2FA code", async () => {
    const payload = {
      token: accessToken,
    };

    const response = await client.enable2FA1Step(payload);
    assert.isArray(response, "Response is not an array.");
    assert.isString(response[0], "Code is not a string.");
  }, 10000);

  it("should get user notifications settings", async () => {
    const payload = {
      token: accessToken,
    };

    const response = await client.getProfileNotifications(payload);
    assert.isObject(response, "Response is not an array.");
  }, 10000);

  it("should get user's exchange orders for an exchange.", async () => {
    const payload = {
      token: accessToken,
      exchangeInternalId: "Binance1586927630_5e96980e40f3a",
    };

    const response = await client.openOrdersGet(payload);
    assert.isArray(response, "Response is not an array.");
  }, 25000);

  it("should get user's session data.", async () => {
    const payload = {
      token: accessToken,
    };

    const response = await client.sessionDataGet(payload);
    assert.isObject(response, "Response is not an object.");
  }, 10000);

  it("should get user's available balance for an exchange", async () => {
    const payload = {
      token: accessToken,
      exchangeInternalId: "Binance1578301457_5e12f811deda4",
    };

    const response = await client.userAvailableBalanceGet(payload);
    assert.isObject(response, "Response is not an object.");
  }, 10000);

  it("should get management positions for provider.", async () => {
    const payload = {
      token: accessToken,
      providerId: "5ee26419928896519668b62b",
    };

    const response = await client.providerManagementPositions(payload);
    assert.isArray(response, "Response is not an array of objects with positions and subpositions");
  }, 10000);

  it("should get provider's followers list.", async () => {
    const payload = {
      token: accessToken,
      providerId: "5ee26419928896519668b62b",
    };

    const response = await client.providerFollowersListGet(payload);
    assert.isArray(response, "Response is not an array of follower entities.");
  }, 10000);

  it("should get provider's copiers list.", async () => {
    const payload = {
      token: accessToken,
      providerId: "5edf6165fc869626686e8657",
    };

    const response = await client.providerCopiersGet(payload);
    assert.isArray(response, "Response is not an array of copiers entities.");
  }, 10000);

  it("should get user's exchange assets.", async () => {
    const payload = {
      token: accessToken,
      internalId: "Zignaly1586867845_5e95ae85e21ea",
    };

    const response = await client.userExchangeAssetsGet(payload);
    assert.isArray(response, "Response is not an array of user exchange assets entities.");
  }, 10000);
});
