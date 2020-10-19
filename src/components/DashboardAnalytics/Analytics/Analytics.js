import React from "react";
import Filters from "../Filters";
import { Box } from "@material-ui/core";
import useDashboardAnalytics from "../../../hooks/useDashboardAnalytics";
import AnalyticsChart from "../AnalyticsChart";
import ProfitSharingAnalytics from "../ProfitSharingAnalytics";

/**
 * Dashboard analytics component.
 *
 * @returns {JSX.Element} Component JSX.
 */
const Analytics = () => {
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
  } = useDashboardAnalytics();

  const selectedProvider = providers.find((p) => p.id === filters.provider.val);
  const profitSharing = selectedProvider && selectedProvider.profitSharing;

  return (
    <Box>
      <Filters
        filters={filters}
        onClear={clearFilters}
        providers={providersOptions}
        quotes={quotes}
        setFilters={setFilters}
        timeFrames={timeFrames}
        profitSharing={profitSharing}
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
