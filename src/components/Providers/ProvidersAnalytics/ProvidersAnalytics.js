import React from "react";
import useProvidersAnalytics from "../../../hooks/useProvidersAnalytics";
import ProvidersProfitsTable from "../../Providers/ProvidersProfitsTable";
import AnalyticsFilters from "../../Providers/AnalyticsFilters";
import { FormattedMessage } from "react-intl";
import { Box } from "@material-ui/core";

/**
 * @typedef {Object} ProvidersAnalyticsPropTypes
 * @property {string} type Selected timeFrame.
 */

/**
 * Provides filters for filtering providers.
 *
 * @param {ProvidersAnalyticsPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersAnalytics = ({ type }) => {
  //   const copyTradersOnly = type === "copyt";
  const {
    stats,
    timeFrame,
    setTimeFrame,
    quote,
    setQuote,
    bases,
    base,
    setBase,
    clearFilters,
  } = useProvidersAnalytics();

  return (
    <Box>
      <AnalyticsFilters
        bases={bases}
        base={base}
        onBaseChange={setBase}
        onClear={clearFilters}
        onQuoteChange={setQuote}
        onTimeFrameChange={setTimeFrame}
        quote={quote}
        timeFrame={timeFrame}
        // type={type}
      />
      <ProvidersProfitsTable
        persistKey={`${type}Analytics`}
        stats={stats}
        title={<FormattedMessage id={`${type}.performance`} />}
        // type={type}
      />
    </Box>
  );
};

export default ProvidersAnalytics;
