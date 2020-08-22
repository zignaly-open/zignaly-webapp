import React from "react";
import useProvidersAnalytics from "../../../hooks/useProvidersAnalytics";
import ProvidersProfitsTable from "../../Providers/ProvidersProfitsTable";
import AnalyticsFilters from "../../Providers/AnalyticsFilters";
import ProvidersProfitsChart from "../../Providers/ProvidersProfitsChart";
import { FormattedMessage } from "react-intl";
import { Box } from "@material-ui/core";
import useTimeFramesOptions from "../../../hooks/useTimeFramesOptions";

/**
 * @typedef {Object} ProvidersAnalyticsPropTypes
 * @property {'signalp'|'copyt'} type Type of provider to retreive.
 */

/**
 * Provides filters for filtering providers.
 *
 * @param {ProvidersAnalyticsPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersAnalytics = ({ type }) => {
  const timeFrames = useTimeFramesOptions();
  const { stats, quotes, bases, clearFilters, filters, setFilters } = useProvidersAnalytics(type);

  console.log(filters, bases);
  return (
    <Box>
      <AnalyticsFilters
        filters={filters}
        bases={bases}
        setFilters={setFilters}
        onClear={clearFilters}
        quotes={quotes}
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
