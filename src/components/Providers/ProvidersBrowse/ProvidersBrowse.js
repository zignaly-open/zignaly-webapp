import React, { useState } from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import useQuoteAssets from "../../../hooks/useQuoteAssets";
import ProvidersProfitsTable from "../../Providers/ProvidersProfitsTable";
import AnalyticsFilters from "../../Providers/AnalyticsFilters";
import { useIntl, FormattedMessage } from "react-intl";
import ProvidersFilters from "../ProvidersFilters";
import ProvidersSort from "../ProvidersSort";
import ProvidersList from "../ProvidersList";
import TimeFrameSelectRow from "../TimeFrameSelectRow";
import useProvidersList from "../../../hooks/useProvidersList";
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
const ProvidersBrowse = ({
  //   onClose,
  //   coin,
  //   exchange,
  //   onCoinChange,
  //   onExchangeChange,
  openSort,
  openFilters,
  showFilters,
  showSort,
  type,
  connectedOnly,
}) => {
  //   const quoteAssets = useQuoteAssets();
  //   const coins = Object.keys(quoteAssets);
  const copyTradersOnly = type === "copyt";
  const providersOptions = { copyTradersOnly, connectedOnly };
  // const providersCallbacks = { toggleFilters, toggleSort };
  const {
    providers,
    timeFrame,
    setTimeFrame,
    coin,
    setCoin,
    exchange,
    setExchange,
    sort,
    setSort,
    clearFilters,
    clearSort,
  } = useProvidersList(providersOptions);
  const intl = useIntl();

  // clear filters here or in provfilters?

  return (
    <Box>
      {showFilters && (
        <ProvidersFilters
          clearFilters={clearFilters}
          coin={coin}
          exchange={exchange}
          onClose={openFilters}
          onCoinChange={setCoin}
          onExchangeChange={setExchange}
        />
      )}
      {showSort && (
        <ProvidersSort clearFilters={clearSort} onChange={setSort} onClose={openSort} sort={sort} />
      )}
      <TimeFrameSelectRow
        title={`${providers.length} ${intl.formatMessage({ id: `${type}.traders` })}`}
        onChange={setTimeFrame}
        value={timeFrame}
      />
      <ProvidersList providers={providers} showSummary={connectedOnly} />
    </Box>
  );
};

export default ProvidersBrowse;
