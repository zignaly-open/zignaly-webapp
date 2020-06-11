import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";

/**
 * @typedef {import("../services/tradeApiClient.types").QuoteAssetsDict} QuoteAssetsDict
 */

/**
 * Provides quotes assets.
 *
 * @returns {QuoteAssetsDict} Quote Assets.
 */
const useLocationHash = () => {
  //   const [quotes, setQuotes] = useState({});

  //   useEffect(() => {
  //       const loadData = async () => {
  //         const hash = window.location.hash ? window.location.hash.substr(1) : "";
  //     };
  //     loadData();
  //   }, [storeSession.tradeApi.accessToken]);

  return window.location.hash ? window.location.hash.substr(1) : "";
};

export default useLocationHash;
