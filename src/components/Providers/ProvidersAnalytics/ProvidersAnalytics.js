import React from "react";
import useProvidersAnalytics from "../../../hooks/useProvidersAnalytics";
import ProvidersProfitsTable from "../../Providers/ProvidersProfitsTable";
import AnalyticsFilters from "../../Providers/AnalyticsFilters";
import ProvidersProfitsChart from "../../Providers/ProvidersProfitsChart";
import { FormattedMessage } from "react-intl";
import { Box } from "@material-ui/core";

/**
 * @typedef {Object} ProvidersAnalyticsPropTypes
 * @property {Array<'signal'|'copytraders'|'profitsharing'>} provType Type of provider to retreive.
 */

/**
 * Provides filters for filtering providers.
 *
 * @param {ProvidersAnalyticsPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersAnalytics = ({ provType }) => {
  const {
    stats,
    quotes,
    bases,
    timeFrames,
    clearFilters,
    filters,
    setFilters,
  } = useProvidersAnalytics(provType);

  const copyTraders = provType.includes("copytraders");
  const profitSharing = provType.includes("profitsharing");

  const type = copyTraders || profitSharing ? "copyt" : "signalp";

  return (
    <Box>
      <AnalyticsFilters
        bases={bases}
        filters={filters}
        onClear={clearFilters}
        quotes={quotes}
        setFilters={setFilters}
        timeFrames={timeFrames}
      />
      <ProvidersProfitsChart
        base={bases.find((b) => b.val === filters.base).label}
        quote={filters.quote}
        stats={stats}
        timeFrame={timeFrames.find((t) => t.val === filters.timeFrame).label}
      />
      <ProvidersProfitsTable
        persistKey={`${type}Analytics`}
        stats={stats}
        title={<FormattedMessage id={`${type}.performance`} />}
        type={type}
      />
    </Box>
  );
};

export default ProvidersAnalytics;
