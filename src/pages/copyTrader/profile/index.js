import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@material-ui/core";
import { compose } from "recompose";
import withAppLayout from "../../../layouts/appLayout";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import withPageContext from "../../../pageContext";
import TraderCard from "../../../components/TraderCard";
import ProvidersFilters from "../../../components/Providers/ProvidersFilters";
import TimeFrameSelect from "../../../components/TimeFrameSelect";
import CustomSelect from "../../../components/CustomSelect";
import Helmet from "react-helmet";
import "./copyTradersBrowse.scss";

const CopyTradersBrowse = ({ showFilters, showSort, toggleFilters, toggleSort }) => {
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
  const handleTimeFrameChange = val => {
    console.log(val);
  };

  const handleCoinChange = val => {
    console.log(val);
    setCoin(val);
  };

  const handleExchangeChange = val => {
    setExchange(val);
  };

  const clearFilters = () => {
    setCoin("");
    setExchange("");
  };

  const clearSort = () => {
    setSort("");
  };

  const handleSortChange = val => {
    setSort(val);
    console.log(val);
  };

  return (
    <Box className="ctBrowsePage">
      <Helmet>
        <title>Copy Traders</title>
      </Helmet>

      {showFilters && (
        <ProvidersFilters
          onClose={() => toggleFilters()}
          onClear={() => clearFilters()}
          title="Filters"
        >
          <CustomSelect options={coins} onChange={handleCoinChange} value={coin} label="Coin" />
          <CustomSelect
            options={exchanges}
            onChange={handleExchangeChange}
            value={exchange}
            label="Exchange"
          />
        </ProvidersFilters>
      )}
      {showSort && (
        <ProvidersFilters onClose={() => toggleSort()} onClear={() => clearSort()} title="Sort by">
          <CustomSelect
            options={sorts}
            onChange={handleSortChange}
            value={sort}
            label=""
            className="sortSelect"
          />
        </ProvidersFilters>
      )}
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h3" className="regularHeading">
          7 traders
        </Typography>
        <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
          <TimeFrameSelect onChange={handleTimeFrameChange} />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="flex-start">
        <Box
          className="tradersBox"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          {list && list.map(item => <TraderCard key={item} data={item} showSummary={false} />)}
        </Box>
      </Box>
    </Box>
  );
};

CopyTradersBrowse.propTypes = {
  toggleFilters: PropTypes.func,
  toggleSort: PropTypes.func,
  showFilters: PropTypes.bool,
  showSort: PropTypes.bool,
};

export default compose(withPageContext, withAppLayout, withDashboardLayout)(CopyTradersBrowse);
