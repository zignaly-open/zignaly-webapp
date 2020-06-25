import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {import("../services/tradeApiClient.types").ExchangeDepositAddress} ExchangeDepositAddress
 */

/**
 * Provides deposit address.
 *
 * @param {string} internalId Exchange account internal id.
 * @param {string} network Coin network.
 * @param {string} asset Asset name.
 * @returns {ExchangeDepositAddress} Deposit address object.
 */
const useExchangeDepositAddress = (internalId, asset, network) => {
  const [depositAddress, setDepositAddress] = useState();

  const storeSession = useStoreSessionSelector();

  const loadData = () => {
    if (!internalId || !network || !asset) return;
    if (depositAddress) {
      // Dependency updated, reset the value while it's loading
      setDepositAddress(null);
    }

    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId,
      network,
      asset,
    };
    let canceled = false;

    tradeApi
      .exchangeDepositAddressGet(payload)
      .then((data) => {
        if (!canceled) {
          console.log(data);
          setDepositAddress(data);
        }
      })
      .catch((e) => {
        alert(`ERROR: ${e.message}`);
      });

    return () => {
      canceled = true;
    };
  };

  useEffect(loadData, [internalId, network, asset, storeSession.tradeApi.accessToken]);

  return depositAddress;
};

export default useExchangeDepositAddress;
