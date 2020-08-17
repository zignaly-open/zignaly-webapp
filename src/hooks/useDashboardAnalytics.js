import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import { useSelector } from "react-redux";
import useQuoteAssets from "./useQuoteAssets";
import useDashboardAnalyticsTimeframeOptions from "./useDashboardAnalyticsTimeframeOptions";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";
import useReadOnlyProviders from "./useReadOnlyProviders";
import { useIntl } from "react-intl";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import { setFilters } from "../store/actions/settings";
import useEffectSkipFirst from "./useEffectSkipFirst";

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
 * @property {OptionType} provider
 * @property {Array<OptionType>} providers
 * @property {function} setProvider
 * @property {function} clearFilters
 * @property {Boolean} loading
 */

/**
 * Hook to generate the profile profit stats fetching and filtering.
 *
 * @returns {ProviderStatsData} Profile profit stats and filtering objects.
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
  const storeSettings = useStoreSettingsSelector();
  const [stats, setStats] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const pageKey = "dashboardAnalytics";

  // time frames
  const timeFrames = useDashboardAnalyticsTimeframeOptions();
  const initTimeFrame = storeSettings.filters[pageKey].timeFrame || "3";
  const [timeFrame, setTimeFrame] = useState(initTimeFrame);

  // quotes
  const quoteAssets = useQuoteAssets();
  const quotes = Object.keys(quoteAssets);
  const initQuote = storeSettings.filters[pageKey].quote || "USDT";
  const [quote, setQuote] = useState(initQuote);

  let providerAssets = useReadOnlyProviders();
  providerAssets = providerAssets.filter((item) => item.hasBeenUsed);

  let providers = providerAssets.map((item) => ({
    val: item.id,
    label: item.name,
  }));

  providers.unshift({
    val: "1",
    label: intl.formatMessage({ id: "fil.manual" }),
  });
  providers.unshift({
    val: "all",
    label: intl.formatMessage({ id: "fil.providers.all" }),
  });

  const initProvider = storeSettings.filters[pageKey].provider || providers[1];
  const [provider, setProvider] = useState(initProvider);

  // Save settings to store when changed
  const saveQuote = () => {
    dispatch(
      setFilters({
        page: pageKey,
        filters: {
          timeFrame,
          quote,
          provider,
        },
      }),
    );
  };
  useEffectSkipFirst(saveQuote, [timeFrame, quote, provider]);

  const clearFilters = () => {
    setQuote("USDT");
    setTimeFrame("3");
    setProvider(providers[1]);
  };

  const loadDashboardStats = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      ro: true,
      quote,
      timeFrame,
      includeOpenPositions: true,
      providerId: provider.val,
      timeFrameFormat: "lastXDays",
      internalExchangeId: storeSettings.selectedExchange.internalId,
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
  useEffect(loadDashboardStats, [
    timeFrame,
    quote,
    provider,
    storeSettings.selectedExchange.internalId,
    storeSession.tradeApi.accessToken,
  ]);

  return {
    stats,
    timeFrames,
    timeFrame,
    setTimeFrame,
    quotes,
    quote,
    setQuote,
    provider,
    providers,
    setProvider,
    clearFilters,
    loading,
  };
};

export default useDashboardAnalytics;
