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
  } = useDashboardAnalytics();

  return (
    <Box>
      <Filters
        onClear={clearFilters}
        onProviderChange={setProvider}
        onQuoteChange={setQuote}
        onTimeFrameChange={setTimeFrame}
        provider={provider}
        providers={providers}
        quote={quote}
        quotes={quotes}
        timeFrame={timeFrame}
        timeFrames={timeFrames}
      />
      <AnalyticsChart
        loading={loading}
        provider={provider}
        quote={quote}
        stats={stats}
        timeFrame={timeFrames.find((t) => t.val === timeFrame).label}
      />
    </Box>
  );
};

export default Analytics;
