import ls from "@livesession/sdk";

export const liveSessionTrackID = "4c9e2f89.fe420345";

/**
 *
 * @typedef {import("../services/tradeApiClient.types").UserEntity} UserEntity
 */

/**
 *
 * @param {UserEntity} responseData User entity.
 * @returns {void} None.
 */
export const startLiveSession = (responseData) => {
  ls.init(liveSessionTrackID);
  ls.identify({
    name: responseData.firstName,
    email: responseData.email,
    params: {
      userId: responseData.userId,
      exchangeConnected: responseData.binanceConnected,
      providerEnabled: responseData.providerEnable,
      openCount: responseData.buysCount,
      closeCount: responseData.sellsCount,
      hasActivated: responseData.hasActivated,
    },
  });
  ls.newPageView();
};

export const endLiveSession = () => {
  ls.init(liveSessionTrackID);
  ls.invalidateSession();
};
