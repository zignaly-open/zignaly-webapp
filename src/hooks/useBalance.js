import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {import("../services/tradeApiClient.types").BaseAssetsDict} BaseAssetsDict
 */

/**
 * Provides bases assets.
 *
 * @param {string} quote Quote of the bases.
 * @returns {BaseAssetsDict} Quote Assets.
 */
const useBalance = (internalId) => {
  const [balance, setBalance] = useState({
    pnlBTC: 0,
    pnlUSDT: 0,
    totalBTC: 0,
    totalFreeBTC: 0,
    totalFreeUSDT: 0,
    totalLockedBTC: 0,
    totalLockedUSDT: 0,
    totalUSDT: 0,
  });

  const storeSession = useStoreSessionSelector();

  useEffect(() => {
    const loadData = () => {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        exchangeInternalId: internalId,
      };

      tradeApi
        .userBalanceGet(payload)
        .then((data) => {
          setBalance(data);
        })
        .catch((e) => {
          alert(`ERROR: ${e.message}`);
        });
    };
    loadData();
  }, [internalId, storeSession.tradeApi.accessToken]);

  return balance;
};

export default useBalance;
