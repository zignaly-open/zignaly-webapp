import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import ProvidersFilters from "../ProvidersFilters";
import ProvidersSort from "../ProvidersSort";
import ProvidersList from "../ProvidersList";
import TimeFrameSelectRow from "../TimeFrameSelectRow";
import useProvidersList from "hooks/useProvidersList";
import { Box } from "@mui/material";

/**
 * @typedef {import("../../../services/tradeApiClient.types").NewAPIProvidersPayload} NewAPIProvidersPayload
 * @typedef {Object} ProvidersBrowsePropTypes
 * @property {boolean} [showFilters] Flag to indicate if filters should be rendered.
 * @property {boolean} [showSort] Flag to indicate if sort options should be rendered.
 * @property {function} [toggleFilters] Callback that delegate filters toggle state to caller.
 * @property {function} [toggleSort] Callback that delegate sort toggle state to caller.
 * @property {function} [setModifiedFiltersCount] Callback that delegate modifiedFiltersCount to caller.
 * @property {NewAPIProvidersPayload["type"]} type Type of providers to show.
 * @property {boolean} [myServices] Load only created services by the user.
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
  myServices = false,
  setModifiedFiltersCount,
}) => {
  const connectedOnly = type.startsWith("connected");
  const connectedTradersOnly = type === "connected_traders";
  const isCopyTrading = !["signal_providers", "connected_providers"].includes(type);
  const providersOptions = { type, connectedOnly, myServices };
  const [updatedAt, setUpdatedAt] = useState(null);
  const {
    providers,
    quotes,
    exchanges,
    exchangeTypes,
    sort,
    setSort,
    clearFilters,
    clearSort,
    filters,
    setFilters,
    modifiedFilters,
    timeFrame,
    setTimeFrame,
  } = useProvidersList(providersOptions, updatedAt);

  const intl = useIntl();

  useEffect(() => {
    if (setModifiedFiltersCount) {
      setModifiedFiltersCount(modifiedFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modifiedFilters]);

  const reloadProviders = () => {
    setUpdatedAt(new Date().getTime());
  };

  return (
    <Box className="providersBrowse">
      {toggleFilters && (
        <ProvidersFilters
          clearFilters={clearFilters}
          exchangeTypes={exchangeTypes}
          exchanges={exchanges}
          filters={filters}
          onClose={toggleFilters}
          open={showFilters}
          quotes={quotes}
          setFilters={setFilters}
          type={type}
        />
      )}
      {toggleSort && (
        <ProvidersSort
          clearFilters={clearSort}
          onChange={setSort}
          onClose={toggleSort}
          open={showSort}
          sort={sort}
          type={type}
        />
      )}
      <TimeFrameSelectRow
        isCopyTrading={isCopyTrading}
        onChange={setTimeFrame}
        title={`${providers ? providers.length : 0} ${intl.formatMessage({
          id: connectedOnly
            ? isCopyTrading
              ? "dashboard.traders.copying"
              : "dashboard.providers.following"
            : isCopyTrading
            ? "copyt.traders"
            : "fil.providers",
        })}`}
        value={timeFrame}
      />
      <ProvidersList
        providers={providers}
        reloadProviders={reloadProviders}
        showSummary={connectedTradersOnly}
        timeFrame={timeFrame}
      />
    </Box>
  );
};

export default ProvidersBrowse;
