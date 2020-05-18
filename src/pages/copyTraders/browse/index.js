import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@material-ui/core";
import { compose } from "recompose";
import withAppLayout from "../../../layouts/appLayout";
import withCopyTradersLayout from "../../../layouts/copyTradersLayout";
import withPageContext from "../../../pageContext";
import TraderCard from "../../../components/TraderCard";
import ProvidersFilters from "../../../components/Providers/ProvidersFilters";
import TimeFrameSelect from "../../../components/TimeFrameSelect";
import CustomSelect from "../../../components/CustomSelect";
import Helmet from "react-helmet";
import "./copyTradersBrowse.scss";

/**
 * @typedef {Object} CopyTradersBrosePropTypes
 * @property {boolean} showFilters Flag to indicate if filters should be rendered.
 * @property {boolean} showSort Flag to indicate if sort options should be rendered.
 * @property {function} toggleFilters Callback that delegate filters toggle state to caller.
 * @property {function} toggleSort Callback that delegate sort toggle state to caller.
 */

/**
 * Provides a list to browse copy traders.
 *
 * @param {CopyTradersBrosePropTypes} props Component properties.
 * @returns {Object} Component JSX.
 */
const CopyTradersBrowse = (props) => {
  const { showFilters, showSort, toggleFilters, toggleSort } = props;
  const list = [1, 2, 3];
  const coins = ["BTC", "USDT"];
  const exchanges = ["Binance", "KuCoin"];
  const sorts = [
    "Descending Results",
    "Ascending Results",
    "Descending Name",
    "Ascending Name",
    "Descending Subscription Fee",
    "Ascending Subscription Fee",
    "Descending Creation Date",
    "Ascending Creation Date",
  ];

  const [coin, setCoin] = useState(coins[0]);
  const [exchange, setExchange] = useState(exchanges[0]);
  const [sort, setSort] = useState("");
  const handleTimeFrameChange = () => {};
  const handleCoinChange = (val) => {
    setCoin(val);
  };

  const handleExchangeChange = (val) => {
    setExchange(val);
  };

  const clearFilters = () => {
    setCoin("");
    setExchange("");
  };

  const clearSort = () => {
    setSort("");
  };

  const handleSortChange = (val) => {
    setSort(val);
  };

  return (
    <Box className="ctBrowsePage">
      <Helmet>
        <title>Copy Traders</title>
      </Helmet>

      {showFilters && (
        <ProvidersFilters
          onClear={() => clearFilters()}
          onClose={() => toggleFilters()}
          title="Filters"
        >
          <CustomSelect label="Coin" onChange={handleCoinChange} options={coins} value={coin} />
          <CustomSelect
            label="Exchange"
            onChange={handleExchangeChange}
            options={exchanges}
            value={exchange}
          />
        </ProvidersFilters>
      )}
      {showSort && (
        <ProvidersFilters onClear={() => clearSort()} onClose={() => toggleSort()} title="Sort by">
          <CustomSelect
            className="sortSelect"
            label=""
            onChange={handleSortChange}
            options={sorts}
            value={sort}
          />
        </ProvidersFilters>
      )}
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography className="regularHeading" variant="h3">
          7 traders
        </Typography>
        <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-end">
          <TimeFrameSelect onChange={handleTimeFrameChange} />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="flex-start">
        <Box
          alignItems="center"
          className="tradersBox"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          {list && list.map((item) => <TraderCard data={item} key={item} showSummary={false} />)}
        </Box>
      </Box>
    </Box>
  );
};

CopyTradersBrowse.propTypes = {
  showFilters: PropTypes.bool.isRequired,
  showSort: PropTypes.bool.isRequired,
  toggleFilters: PropTypes.func.isRequired,
  toggleSort: PropTypes.func.isRequired,
};

export default compose(withPageContext, withAppLayout, withCopyTradersLayout)(CopyTradersBrowse);
