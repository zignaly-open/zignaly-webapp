import React from "react";
import AnalyticsFilters from "../../Providers/AnalyticsFilters";
import ProvidersProfitsChart from "../../Providers/ProvidersProfitsChart";
import { Box } from "@material-ui/core";
import useDashboardAnalytics from "../../../hooks/useDashboardAnalytics";

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
    bases,
    base,
    setBase,
    clearFilters,
  } = useDashboardAnalytics();

  return (
    <Box>
      <AnalyticsFilters
        base={base}
        bases={bases}
        onBaseChange={setBase}
        onClear={clearFilters}
        onQuoteChange={setQuote}
        onTimeFrameChange={setTimeFrame}
        quote={quote}
        quotes={quotes}
        timeFrame={timeFrame}
        timeFrames={timeFrames}
      />
      <ProvidersProfitsChart
        base={base.label}
        quote={quote}
        stats={stats}
        timeFrame={timeFrames.find((t) => t.val === timeFrame).label}
      />
    </Box>
  );
};

export default Analytics;
