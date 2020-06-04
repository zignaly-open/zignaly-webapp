import React, { useState } from "react";
import useProvidersAnalytics from "../../../hooks/useProvidersAnalytics";
import ProvidersProfitsTable from "../../Providers/ProvidersProfitsTable";
import AnalyticsFilters from "../../Providers/AnalyticsFilters";
import { useIntl, FormattedMessage } from "react-intl";
import { Box } from "@material-ui/core";

/**
 * @typedef {Object} ProvidersAnalyticsPropTypes
 * @property {React.MouseEventHandler} clearFilters Callback that delegate filters clearing to caller.
 * @property {function} onCoinChange Callback that delegate coin change to caller.
 * @property {function} onExchangeChange Callback that delegate exchange change to caller.
 * @property {string} base Selected coin.
 * @property {string} pair Selected pair.
 * @property {string} type Selected timeFrame.
 */

/**
 * Provides filters for filtering providers.
 *
 * @param {ProvidersAnalyticsPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersAnalytics = ({ type }) => {
  const copyTradersOnly = type === "copyt";
  const {
    stats,
    timeFrame,
    setTimeFrame,
    quote,
    setQuote,
    base,
    setBase,
    clearFilters,
  } = useProvidersAnalytics();

  return (
    <Box>
      <AnalyticsFilters
        type={type}
        base={base}
        onBaseChange={setBase}
        quote={quote}
        onQuoteChange={setQuote}
        timeFrame={timeFrame}
        onTimeFrameChange={setTimeFrame}
        onClear={clearFilters}
      />
      <ProvidersProfitsTable
        persistKey={`${type}Analytics`}
        title={<FormattedMessage id={`${type}.performance`} />}
        type={type}
        stats={stats}
      />
    </Box>
  );
};

export default ProvidersAnalytics;
