import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {import("../services/tradeApiClient.types").ExchangeListEntity} ExchangeListEntity
 */

/**
 * Provides exchange list.
 *
 * @returns {Array<ExchangeListEntity>} Exchange list.
 */
const useExchangeList = () => {
  const [exchanges, setExchanges] = useState([]);

  const storeSession = useStoreSessionSelector();

  useEffect(() => {
    const loadData = async () => {
      const payload = {
        token: storeSession.tradeApi.accessToken,
      };

      tradeApi
        .exchangeListGet(payload)
        .then((data) => {
          setExchanges(data);
        })
        .catch((e) => {
          alert(`ERROR: ${e.message}`);
        });
    };
    loadData();
  }, [storeSession.tradeApi.accessToken]);

  return exchanges;
};

export default useExchangeList;
