import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useQuoteAssets from "./useQuoteAssets";
import useDashboardAnalyticsTimeframeOptions from "./useDashboardAnalyticsTimeframeOptions";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";
import useReadOnlyProviders from "./useReadOnlyProviders";
import { useIntl } from "react-intl";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useFilters from "./useFilters";
import { toNumber } from "lodash";
import useStoreSessionSelector from "./useStoreSessionSelector";

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
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const [stats, setStats] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const timeFrames = useDashboardAnalyticsTimeframeOptions();

  const quoteAssets = useQuoteAssets();
  const allQuotes = Object.keys(quoteAssets);
  const [providerQuotes, setProviderQuotes] = useState([]);

  let providerAssets = useReadOnlyProviders();
  providerAssets = providerAssets.filter(
    (item) =>
      item.hasBeenUsed && item.exchangeInternalId === storeSettings.selectedExchange.internalId,
  );

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

  const page = "dashboardAnalytics";
  const storeFilters = storeSettings.filters[page];
  const defaultFilters = {
    timeFrame: "7",
    quote: "USDT",
    provider: providers[0],
  };

  const optionsFilters = {
    timeFrame: timeFrames,
    quote: allQuotes,
    provider: providers,
  };

  const res = useFilters(defaultFilters, storeFilters, optionsFilters, page);
  const { setFilters, clearFilters } = res;
  /**
   * @type {Filters[typeof page]}
   */
  // @ts-ignore
  const filters = res.filters;

  const adjustProviderQuotes = () => {
    if (filters.provider.val !== "1" && filters.provider.val !== "all") {
      const provider = providerAssets.find((item) => item.id === filters.provider.val);
      if (provider && provider.quote) {
        setProviderQuotes([provider.quote]);
        setFilters({ quote: provider.quote });
      }
    }
  };

  useEffect(adjustProviderQuotes, [filters.provider]);

  const loadDashboardStats = () => {
    setLoading(true);
    const timeFrmaeFormatList = ["weekly", "monthly", "yearly"];
    const payload = {
      token: storeSession.tradeApi.accessToken,
      ro: true,
      quote: filters.quote,
      timeFrame: !timeFrmaeFormatList.includes(filters.timeFrame)
        ? toNumber(filters.timeFrame)
        : false,
      includeOpenPositions: true,
      providerId: filters.provider.val,
      timeFrameFormat: timeFrmaeFormatList.includes(filters.timeFrame)
        ? filters.timeFrame
        : "lastXDays",
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
    filters.provider.val,
    filters.quote,
    filters.timeFrame,
    storeSettings.selectedExchange.internalId,
    storeSession.tradeApi.accessToken,
  ]);

  return {
    stats,
    timeFrames,
    quotes: providerQuotes.length ? providerQuotes : allQuotes,
    providers,
    clearFilters,
    loading,
    filters,
    setFilters,
  };
};

export default useDashboardAnalytics;
