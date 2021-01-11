import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useDashboardAnalyticsTimeframeOptions from "./useDashboardAnalyticsTimeframeOptions";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";
import useConnectedProvidersLite from "./useConnectedProvidersLite";
import { useIntl } from "react-intl";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useFilters from "./useFilters";
import { toNumber } from "lodash";
import useStoreSessionSelector from "./useStoreSessionSelector";
import useExchangeQuotes from "./useExchangeQuotes";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../services/tradeApiClient.types").ProfitStatsObject} ProfitStatsObject
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 * @typedef {import("../store/initialState").Filters} Filters
 * @typedef {import("../services/tradeApiClient.types").HasBeenUsedProviderEntity} HasBeenUsedProviderEntity
 */

/**
 * @typedef {Object} ProviderStatsData
 * @property {Array<ProfitStatsObject>} stats
 * @property {Array<OptionType>} timeFrames
 * @property {Array<string>} quotes
 * @property {Array<OptionType>} providersOptions
 * @property {Array<HasBeenUsedProviderEntity>} providers
 * @property {function} clearFilters
 * @property {function} setFilters
 * @property {Boolean} loading
 * @property {Filters['dashboardAnalytics']} filters
 */

/**
 * Hook to generate the profile profit stats fetching and filtering.
 *
 * @param {String} providerId Provider ID
 *
 * @returns {ProviderStatsData} Profile profit stats and filtering objects.
 */
const useDashboardAnalytics = (providerId) => {
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const [stats, setStats] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const intl = useIntl();

  const timeFrames = useDashboardAnalyticsTimeframeOptions();

  const { quoteAssets } = useExchangeQuotes({
    exchangeId: storeSettings.selectedExchange.exchangeId,
    exchangeType: storeSettings.selectedExchange.exchangeType,
  });
  const allQuotes = Object.keys(quoteAssets);
  // const [providerQuotes, setProviderQuotes] = useState([]);

  const { providers, providersLoading } = useConnectedProvidersLite(
    storeSettings.selectedExchange.internalId,
    ["copyTrading", "profitSharing", "signalProvider"],
    false,
  );
  let providersOptions = providers.map((item) => ({
    val: item.id,
    label: item.name,
  }));

  providersOptions.unshift({
    val: "1",
    label: intl.formatMessage({ id: "fil.manual" }),
  });
  const filteredProvider = providerId
    ? providersOptions.find((item) => item.val === providerId)
    : "";
  const defaultProviderOption = filteredProvider || providersOptions[0];

  const page = "dashboardAnalytics";
  const storeFilters = storeSettings.filters[page];
  const defaultFilters = {
    timeFrame: "7",
    quote: "USDT",
    provider: defaultProviderOption,
  };

  const optionsFilters = {
    timeFrame: timeFrames,
    quote: allQuotes,
    provider: providersOptions,
  };

  const res = useFilters(defaultFilters, storeFilters, optionsFilters, page);
  const { setFilters, clearFilters } = res;
  /**
   * @type {Filters[typeof page]}
   */
  // @ts-ignore
  const filters = res.filters;

  // const adjustProviderQuotes = () => {
  //   if (filters.provider.val !== "1" && filters.provider.val !== "all") {
  //     const provider = providers.find((item) => item.id === filters.provider.val);
  //     if (provider && provider.quote) {
  //       setProviderQuotes([provider.quote]);
  //       setFilters({ quote: provider.quote });
  //     } else {
  //       setProviderQuotes(allQuotes);
  //     }
  //   } else {
  //     setProviderQuotes(allQuotes);
  //   }
  // };

  // useEffect(adjustProviderQuotes, [filters.provider]);

  const loadDashboardStats = () => {
    if (!providersLoading) {
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
        .profitStatsGet(payload)
        .then((responseData) => {
          setStats(responseData);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Load stats at init and on filters change
  useEffect(loadDashboardStats, [
    filters.provider.val,
    filters.quote,
    filters.timeFrame,
    storeSettings.selectedExchange.internalId,
    storeSession.tradeApi.accessToken,
    providersLoading,
  ]);

  return {
    stats,
    timeFrames,
    // quotes: providerQuotes.length ? providerQuotes : allQuotes,
    quotes: allQuotes,
    providersOptions,
    providers,
    clearFilters,
    loading,
    filters,
    setFilters,
  };
};

export default useDashboardAnalytics;
