import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import { useSelector } from "react-redux";
import useQuoteAssets from "./useQuoteAssets";
import useDashboardAnalyticsTimeframeOptions from "./useDashboardAnalyticsTimeframeOptions";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../services/tradeApiClient.types").ProfileStatsObject} ProfileStatsObject
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 */

/**
 * @typedef {Object} ProviderStatsData
 * @property {Array<ProfileStatsObject>} stats
 * @property {string} timeFrame
 * @property {Array<OptionType>} timeFrames
 * @property {function} setTimeFrame
 * @property {string} quote
 * @property {Array<string>} quotes
 * @property {function} setQuote
 * @property {function} clearFilters
 * @property {Boolean} loading
 */

/**
 * Hook to generate the providers stats fetching and filtering.
 *
 * @returns {ProviderStatsData} Providers stats and filtering objects.
 */
const useDashboardAnalytics = () => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSessionType} Store session data.
   */
  const selectStoreSession = (state) => state.session;
  const storeSession = useSelector(selectStoreSession);
  const [stats, setStats] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // time frames
  const timeFrames = useDashboardAnalyticsTimeframeOptions();
  const [timeFrame, setTimeFrame] = useState("60");

  // quotes
  const quoteAssets = useQuoteAssets();
  const quotes = Object.keys(quoteAssets);
  const [quote, setQuote] = useState("USDT");

  const clearFilters = () => {
    setQuote("USDT");
    setTimeFrame("60");
  };

  const loadDashboardStats = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      ro: true,
      quote,
      timeFrame,
      includeOpenPositions: true,
      providerId: "all",
      timeFrameFormat: "lastXDays",
    };
    tradeApi
      .profileStatsGet(payload)
      .then((responseData) => {
        setStats(responseData);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Load stats at init and on filters change
  useEffect(loadDashboardStats, [timeFrame, quote, storeSession.tradeApi.accessToken]);

  return {
    stats,
    timeFrames,
    timeFrame,
    setTimeFrame,
    quotes,
    quote,
    setQuote,
    clearFilters,
    loading,
  };
};

export default useDashboardAnalytics;
