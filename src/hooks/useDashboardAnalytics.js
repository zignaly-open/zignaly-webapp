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
import useFilters from "./useFilters";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../services/tradeApiClient.types").ProfileStatsObject} ProfileStatsObject
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 * @typedef {import("../store/initialState").Filters} Filters
 */

/**
 * @typedef {Object} ProviderStatsData
 * @property {Array<ProfileStatsObject>} stats
 * @property {Array<OptionType>} timeFrames
 * @property {Array<string>} quotes
 * @property {Array<OptionType>} providers
 * @property {function} clearFilters
 * @property {function} setFilters
 * @property {Boolean} loading
 * @property {Filters['dashboardAnalytics']} filters
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

  const timeFrames = useDashboardAnalyticsTimeframeOptions();

  const quoteAssets = useQuoteAssets();
  const quotes = Object.keys(quoteAssets);

  const page = "dashboardAnalytics";
  const storeFilters = storeSettings.filters[page];
  const defaultFilters = {
    timeFrame: "3",
    quote: "USDT",
    // Store provider's label and value in order to display it in the
    // dropdown before the providers list is resolved
    provider: providers[1],
  };

  const optionsFilters = {
    timeFrame: timeFrames,
    quote: quotes,
    provider: providers,
  };

  const res = useFilters(defaultFilters, storeFilters, optionsFilters, page);
  const { setFilters, clearFilters } = res;
  /**
   * @type {Filters[typeof page]}
   */
  // @ts-ignore
  const filters = res.filters;

  const loadDashboardStats = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      ro: true,
      quote: filters.quote,
      timeFrame: filters.timeFrame,
      includeOpenPositions: true,
      providerId: filters.provider.val,
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
    filters,
    storeSettings.selectedExchange.internalId,
    storeSession.tradeApi.accessToken,
  ]);

  return {
    stats,
    timeFrames,
    quotes,
    providers,
    clearFilters,
    loading,
    filters,
    setFilters,
  };
};

export default useDashboardAnalytics;
