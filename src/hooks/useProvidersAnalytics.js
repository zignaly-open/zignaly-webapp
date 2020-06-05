import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import { useSelector } from "react-redux";

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
  const [stats, setStats] = useState([]);
  const [statsFiltered, setStatsFiltered] = useState([]);
  const [quote, setQuote] = useState("BTC");
  const [base, setBase] = useState("");
  const [timeFrame, setTimeFrame] = useState("30days");

  const clearFilters = () => {
    setQuote("BTC");
    setBase("");
    setTimeFrame("30days");
  };

  // Filter stats on filters and stats change
  useEffect(() => {
    const _stats = stats.filter((p) => true /** || !coin || p.coin === coin */);
    setStatsFiltered(_stats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats, quote, base]);

  // Load stats at init and on timeframe change
  useEffect(() => {
    const loadProvidersStats = async () => {
      try {
        const payload = {
          token: storeSession.tradeApi.accessToken,
          ro: true,
          quote,
          base: base || "all",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFrame]);

  return {
    stats: statsFiltered,
    timeFrame,
    setTimeFrame,
    quote,
    setQuote,
    base,
    setBase,
    clearFilters,
  };
};

export default useProvidersAnalytics;
