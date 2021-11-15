import { useState, useEffect, useContext } from "react";
import tradeApi from "../services/tradeApiClient";
import useDashboardAnalyticsTimeframeOptions from "./useDashboardAnalyticsTimeframeOptions";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useFilters from "./useFilters";
import { toNumber } from "lodash";
import useExchangeQuotes from "./useExchangeQuotes";
import useSelectedExchange from "hooks/useSelectedExchange";
import PrivateAreaContext from "context/PrivateAreaContext";

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
  const storeSettings = useStoreSettingsSelector();
  const selectedExchange = useSelectedExchange();
  const [stats, setStats] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const intl = useIntl();

  const timeFrames = useDashboardAnalyticsTimeframeOptions();

  const { quoteAssets } = useExchangeQuotes({
    exchangeId: selectedExchange.exchangeId,
    exchangeType: selectedExchange.exchangeType,
  });
  const allQuotes = Object.keys(quoteAssets);
  // const [providerQuotes, setProviderQuotes] = useState([]);
  const { userProviders: usedProvidersAll } = useContext(PrivateAreaContext);
  const providers = usedProvidersAll?.filter(
    (p) =>
      p.exchangeInternalId === selectedExchange.internalId ||
      p.exchangeInternalIds.find((e) => e.internalId === selectedExchange.internalId),
  );

  let providersOptions = [
    {
      val: "1",
      label: intl.formatMessage({ id: "fil.manual" }),
    },
  ];

  if (providers) {
    providersOptions = providersOptions.concat(
      providers.map((item) => ({
        val: item.id,
        label: item.name,
      })),
    );
  }

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
    if (providers) {
      setLoading(true);
      const timeFrmaeFormatList = ["weekly", "monthly", "yearly"];
      const payload = {
        quote: filters.quote,
        timeFrame: !timeFrmaeFormatList.includes(filters.timeFrame)
          ? toNumber(filters.timeFrame)
          : false,
        includeOpenPositions: true,
        providerId: filters.provider.val,
        timeFrameFormat: timeFrmaeFormatList.includes(filters.timeFrame)
          ? filters.timeFrame
          : "lastXDays",
        internalExchangeId: selectedExchange.internalId,
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

  const providersLoaded = Boolean(providers);
  // Load stats at init and on filters change
  useEffect(loadDashboardStats, [
    filters.provider.val,
    filters.quote,
    filters.timeFrame,
    selectedExchange.internalId,
    providersLoaded,
  ]);

  return {
    stats,
    timeFrames,
    // quotes: providerQuotes.length ? providerQuotes : allQuotes,
    quotes: allQuotes,
    providersOptions,
    providers: providers ? providers : [],
    clearFilters,
    loading,
    filters,
    setFilters,
  };
};

export default useDashboardAnalytics;
