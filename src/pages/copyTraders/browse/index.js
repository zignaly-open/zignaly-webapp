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
  const handleTimeFrameChange = (val) => {
    console.log(val);
  };

  const handleCoinChange = (val) => {
    console.log(val);
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
    console.log(val);
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
  toggleFilters: PropTypes.func,
  toggleSort: PropTypes.func,
  showFilters: PropTypes.bool,
  showSort: PropTypes.bool,
};

export default compose(withPageContext, withAppLayout, withCopyTradersLayout)(CopyTradersBrowse);
