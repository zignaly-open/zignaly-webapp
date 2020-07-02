import React from "react";
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
}) => {
  const copyTradersOnly = type === "copyt";
  const providersOptions = { copyTradersOnly, connectedOnly };
  const {
    providers,
    timeFrame,
    setTimeFrame,
    coin,
    coins,
    setCoin,
    exchange,
    exchanges,
    setExchange,
    sort,
    setSort,
    clearFilters,
    clearSort,
  } = useProvidersList(providersOptions);
  const intl = useIntl();

  return (
    <Box className="providersBrowse">
      {toggleFilters && (
        <ProvidersFilters
          clearFilters={clearFilters}
          coin={coin}
          coins={coins}
          exchange={exchange}
          exchanges={exchanges}
          onClose={toggleFilters}
          onCoinChange={setCoin}
          onExchangeChange={setExchange}
          open={showFilters}
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
        onChange={setTimeFrame}
        title={`${providers.length} ${intl.formatMessage({
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
