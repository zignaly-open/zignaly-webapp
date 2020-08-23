import React from "react";
import Filters from "../Filters";
import { Box } from "@material-ui/core";
import useDashboardAnalytics from "../../../hooks/useDashboardAnalytics";
import AnalyticsChart from "../AnalyticsChart";

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
    clearFilters,
    loading,
    setFilters,
    filters,
  } = useDashboardAnalytics();

  return (
    <Box>
      <Filters
        filters={filters}
        onClear={clearFilters}
        providers={providers}
        quotes={quotes}
        setFilters={setFilters}
        timeFrames={timeFrames}
      />
      <AnalyticsChart
        loading={loading}
        provider={filters.provider}
        quote={filters.quote}
        stats={stats}
        timeFrame={timeFrames.find((t) => t.val === filters.timeFrame).label}
      />
    </Box>
  );
};

export default Analytics;
