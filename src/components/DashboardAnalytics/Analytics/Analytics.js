import React from "react";
import Filters from "../Filters";
import { Box, CircularProgress } from "@material-ui/core";
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
    clearFilters,
    loading,
  } = useDashboardAnalytics();

  return (
    <Box>
      <Filters
        onClear={clearFilters}
        onQuoteChange={setQuote}
        onTimeFrameChange={setTimeFrame}
        quote={quote}
        quotes={quotes}
        timeFrame={timeFrame}
        timeFrames={timeFrames}
      />
      <AnalyticsChart
        quote={quote}
        stats={stats}
        loading={loading}
        timeFrame={timeFrames.find((t) => t.val === timeFrame).label}
      />
    </Box>
  );
};

export default Analytics;
