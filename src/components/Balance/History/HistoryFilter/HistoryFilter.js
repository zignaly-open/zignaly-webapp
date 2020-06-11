import React from "react";
import "./HistoryFilter.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import EquityFilter from "../../TotalEquity/EquityFilter";

/**
 *
 * @typedef {import("../../../../store/initialState").UserEquityEntity} UserEquityEntity
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<UserEquityEntity>} list
 * @property {Function} onChange
 */
/**
 *
 * @param {DefaultProps} props
 */

const HistoryFilter = ({ list, onChange }) => {
  return (
    <Box
      alignItems="center"
      className="historyFilter"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <Typography variant="h5">
        <FormattedMessage id="dashboard.balance.historical" />
      </Typography>
      <EquityFilter list={list} onChange={onChange} />
    </Box>
  );
};

export default HistoryFilter;
