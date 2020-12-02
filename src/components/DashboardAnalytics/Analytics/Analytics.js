import React from "react";
import Filters from "../Filters";
import { Box } from "@material-ui/core";
import useDashboardAnalytics from "../../../hooks/useDashboardAnalytics";
import AnalyticsChart from "../AnalyticsChart";
import ProfitSharingAnalytics from "../ProfitSharingAnalytics";

/**
 * @typedef {Object} ProviderProps
 * @property {String} providerId position ID dynamic route path parameter.
 */

/**
 * Dashboard Analaytics component.
 *
 * @param {ProviderProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */
const Analytics = ({ providerId }) => {
  const {
    stats,
    timeFrames,
    quotes,
    providers,
    providersOptions,
    clearFilters,
    loading,
    setFilters,
    filters,
  } = useDashboardAnalytics(providerId);

  const selectedProvider = providers.find((p) => p.id === filters.provider.val);
  const profitSharing = selectedProvider && selectedProvider.profitSharing;

  return (
    <Box>
      <Filters
        filters={filters}
        onClear={clearFilters}
        profitSharing={profitSharing}
        providers={providersOptions}
        quotes={quotes}
        setFilters={setFilters}
        timeFrames={timeFrames}
      />
      {!profitSharing ? (
        <AnalyticsChart
          loading={loading}
          provider={filters.provider}
          quote={filters.quote}
          stats={stats}
          timeFrame={timeFrames.find((t) => t.val === filters.timeFrame).label}
        />
      ) : (
        <ProfitSharingAnalytics provider={selectedProvider} />
      )}
    </Box>
  );
};

export default Analytics;
