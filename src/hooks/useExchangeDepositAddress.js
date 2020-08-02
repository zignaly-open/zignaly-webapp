import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

/**
 * @typedef {import("../services/tradeApiClient.types").ExchangeDepositAddress} ExchangeDepositAddress
 * @typedef {import("../services/tradeApiClient.types").CoinNetwork} CoinNetwork
 */

/**
 * Provides deposit address.
 *
 * @param {string} internalId Exchange account internal id.
 * @param {string} asset Asset name.
 * @param {CoinNetwork} network Coin network.
 * @returns {ExchangeDepositAddress} Deposit address object.
 */
const useExchangeDepositAddress = (internalId, asset, network) => {
  const [depositAddress, setDepositAddress] = useState(
    /** @type {ExchangeDepositAddress} */ (null),
  );
  const dispatch = useDispatch();

  const storeSession = useStoreSessionSelector();

  const loadData = () => {
    if (!internalId || !network || !network.withdrawEnable || !asset) return undefined;
    if (depositAddress) {
      // Dependency updated, reset the value while it's loading
      setDepositAddress(null);
    }

    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId,
      network: network.network,
      asset,
    };
    let canceled = false;

    tradeApi
      .exchangeDepositAddressGet(payload)
      .then((data) => {
        if (!canceled) {
          setDepositAddress(data);
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });

    return () => {
      // Cancel request do avoid overwriting the address if multiple different requests are sent at the same time.
      canceled = true;
    };
  };

  useEffect(loadData, [internalId, network, asset, storeSession.tradeApi.accessToken]);

  return depositAddress;
};

export default useExchangeDepositAddress;
