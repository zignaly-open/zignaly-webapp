import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import ProvidersFilters from "../ProvidersFilters";
import ProvidersSort from "../ProvidersSort";
import ProvidersList from "../ProvidersList";
import TimeFrameSelectRow from "../TimeFrameSelectRow";
import useProvidersList from "../../../hooks/useProvidersList";
import { Box } from "@material-ui/core";

/**
 * @typedef {Object} ProvidersBrowsePropTypes
 * @property {boolean} [showFilters] Flag to indicate if filters should be rendered.
 * @property {boolean} [showSort] Flag to indicate if sort options should be rendered.
 * @property {function} [toggleFilters] Callback that delegate filters toggle state to caller.
 * @property {function} [toggleSort] Callback that delegate sort toggle state to caller.
 * @property {'copyt'|'signalp'} type Type of providers to show.
 * @property {boolean} connectedOnly Only display connected providers.
 */

/**
 * Provides filters for filtering providers.
 *
 * @param {ProvidersBrowsePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersBrowse = ({
  toggleSort,
  toggleFilters,
  showFilters,
  showSort,
  type,
  connectedOnly,
  setModifiedFiltersCount,
}) => {
  const copyTradersOnly = type === "copyt";
  const providersOptions = { copyTradersOnly, connectedOnly };
  const {
    providers,
    timeFrame,
    setTimeFrame,
    quotes,
    exchanges,
    exchangeTypes,
    fromUserOptions,
    sort,
    setSort,
    clearFilters,
    clearSort,
    filters,
    setFilters,
    modifiedFilters,
  } = useProvidersList(providersOptions);
  const intl = useIntl();

  useEffect(() => {
    setModifiedFiltersCount(modifiedFilters);
  }, [modifiedFilters]);

  return (
    <Box className="providersBrowse">
      {toggleFilters && (
        <ProvidersFilters
          clearFilters={clearFilters}
          quotes={quotes}
          copyTradersOnly={copyTradersOnly}
          exchanges={exchanges}
          exchangeTypes={exchangeTypes}
          fromUserOptions={fromUserOptions}
          onClose={toggleFilters}
          open={showFilters}
          setFilters={setFilters}
          filters={filters}
          modifiedFilters={modifiedFilters}
        />
      )}
      {toggleSort && (
        <ProvidersSort
          clearFilters={clearSort}
          onChange={setSort}
          onClose={toggleSort}
          open={showSort}
          sort={sort}
        />
      )}
      <TimeFrameSelectRow
        isCopyTrading={copyTradersOnly}
        onChange={setTimeFrame}
        title={`${providers ? providers.length : 0} ${intl.formatMessage({
          id: connectedOnly
            ? copyTradersOnly
              ? "dashboard.traders.copying"
              : "dashboard.providers.following"
            : copyTradersOnly
            ? "copyt.traders"
            : "menu.signalproviders",
        })}`}
        value={timeFrame}
      />
      <ProvidersList providers={providers} showSummary={connectedOnly} timeFrame={timeFrame} />
    </Box>
  );
};

export default ProvidersBrowse;
