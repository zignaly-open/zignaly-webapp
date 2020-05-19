import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@material-ui/core";
import { compose } from "recompose";
import { injectIntl, intlShape } from "react-intl";
import withAppLayout from "../../../layouts/appLayout";
import withCopyTradersLayout from "../../../layouts/copyTradersLayout";
import withPageContext from "../../../pageContext";
import TraderCard from "../../../components/TraderCard";
import ProvidersFilters from "../../../components/Providers/ProvidersFilters";
import ProvidersSort from "../../../components/Providers/ProvidersSort";
import TimeFrameSelect from "../../../components/TimeFrameSelect";
import Helmet from "react-helmet";
import "./copyTradersBrowse.scss";

/**
 * @typedef {Object} CopyTradersBrowsePropTypes
 * @property {boolean} showFilters Flag to indicate if filters should be rendered.
 * @property {boolean} showSort Flag to indicate if sort options should be rendered.
 * @property {function} toggleFilters Callback that delegate filters toggle state to caller.
 * @property {function} toggleSort Callback that delegate sort toggle state to caller.
 * @property {any} intl React-intl context to translate strings
 */

/**
 * Provides a list to browse copy traders.
 *
 * @param {CopyTradersBrowsePropTypes} props Component properties.
 * @returns {Object} Component JSX.
 */
const CopyTradersBrowse = (props) => {
  const { showFilters, showSort, toggleFilters, toggleSort, intl } = props;
  const list = [1, 2, 3, 4, 5, 6, 7];

  const handleFiltersChange = (coin, exchange) => {};
  const handleSortChange = (sort) => {};

  const handleTimeFrameChange = (val) => {};

  return (
    <Box className="ctBrowsePage">
      <Helmet>
        <title>{intl.formatMessage({ id: "menu.copytraders" })}</title>
      </Helmet>

      {showFilters && <ProvidersFilters onChange={handleFiltersChange} onClose={toggleFilters} />}
      {showSort && <ProvidersSort onChange={handleSortChange} onClose={toggleSort} />}
      <Box display="flex" flexDirection="row" justifyContent="space-between" pb="12px">
        <Typography className="regularHeading" variant="h3">
          7 traders
        </Typography>
        <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-end">
          <TimeFrameSelect onChange={handleTimeFrameChange} />
        </Box>
      </Box>
      <Box
        className="tradersBox"
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="flex-start"
      >
        {list &&
          list.map((item) => (
            <TraderCard
              key={item.id}
              id={item.id}
              returns={item.returns}
              risk={item.risk}
              showSummary={false}
              coin={item.coin}
              fee={item.fee}
              logoUrl={item.logoUrl}
              name={item.name}
            />
          ))}
      </Box>
    </Box>
  );
};

CopyTradersBrowse.propTypes = {
  showFilters: PropTypes.bool.isRequired,
  showSort: PropTypes.bool.isRequired,
  toggleFilters: PropTypes.func.isRequired,
  toggleSort: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default compose(
  withPageContext,
  withAppLayout,
  withCopyTradersLayout,
  injectIntl,
)(CopyTradersBrowse);
