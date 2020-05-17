import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@material-ui/core";
import { compose } from "recompose";
import withAppLayout from "../../../layouts/appLayout";
import withCopyTradersLayout from "../../../layouts/copyTradersLayout";
import withPageContext from "../../../pageContext";
import TraderCard from "../../../components/TraderCard";
import ProvidersFilters from "../../../components/Providers/ProvidersFilters";
import ProvidersSort from "../../../components/Providers/ProvidersSort";
import TimeFrameSelect from "../../../components/TimeFrameSelect";
import Helmet from "react-helmet";
import "./copyTradersBrowse.scss";

const CopyTradersBrowse = ({ showFilters, showSort, toggleFilters, toggleSort }) => {
  const list = [1, 2, 3];

  const handleFiltersChange = (type, mda, trader) => {};
  const handleSortChange = (sort) => {};

  const handleTimeFrameChange = (val) => {
    console.log(val);
  };

  return (
    <Box className="ctBrowsePage">
      <Helmet>
        <title>Copy Traders</title>
      </Helmet>

      {showFilters && <ProvidersFilters onChange={handleFiltersChange} onClose={toggleFilters} />}
      {showSort && <ProvidersSort onChange={handleSortChange} onClose={toggleSort} />}
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
