import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import { useSelector } from "react-redux";
import useQuoteAssets from "./useQuoteAssets";
import useBaseAssets from "./useBaseAssets";
import useTimeFramesOptions from "./useTimeFramesOptions";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../services/tradeApiClient.types").ProvidersStatsCollection} ProvidersStatsCollection
 */

/**
 * @typedef {Object} ProviderStatsData
 * @property {ProvidersStatsCollection} stats
 * @property {string} timeFrame
 * @property {function} setTimeFrame
 * @property {string} quote
 * @property {function} setQuote
 * @property {string} base
 * @property {function} setBase
 * @property {function} clearFilters
 */

/**
 * Hook to generate the providers stats fetching and filtering.
 *
 * @returns {ProviderStatsData} Providers stats and filtering objects.
 */
const useProvidersAnalytics = () => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSessionType} Store session data.
   */
  const selectStoreSession = (state) => state.session;
  const storeSession = useSelector(selectStoreSession);
  const intl = useIntl();
  const [stats, setStats] = useState([]);

  const [quote, setQuote] = useState("USDT");
  const [timeFrame, setTimeFrame] = useState("30days");

  //   const quoteAssets = useQuoteAssets();
  //   const timeFramesOptions = useTimeFramesOptions();
  //   const quotes = Object.keys(quoteAssets);

  const baseAssets = useBaseAssets(quote);
  const bases = Object.entries(baseAssets).map(([key, val]) => ({
    val: key,
    label: val.quote + "/" + val.base,
  }));
  bases.push({ val: "all", label: intl.formatMessage({ id: "fil.pairs" }) });
  const [base, setBase] = useState(bases[0]);

  const clearFilters = () => {
    setQuote("USDT");
    setBase(bases[0]);
    setTimeFrame("30days");
  };

  // Load stats at init and on filters change
  useEffect(() => {
    const loadProvidersStats = async () => {
      try {
        const payload = {
          token: storeSession.tradeApi.accessToken,
          ro: true,
          quote,
          base: base,
          timeFrame,
          DCAFilter: "anyDCA",
        };
        const responseData = await tradeApi.providersStatsGet(payload);
        setStats(responseData);
      } catch (e) {
        // TODO: Display error in alert.
      }
    };

    loadProvidersStats();
  }, [timeFrame, quote, base, storeSession.tradeApi.accessToken]);

  return {
    stats,
    timeFrame,
    setTimeFrame,
    quote,
    setQuote,
    base,
    bases,
    setBase,
    clearFilters,
  };
};

export default useProvidersAnalytics;
