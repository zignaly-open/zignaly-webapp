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
 * Filter component to filter table data.
 *
 * @typedef {Object} DefaultProps Default component props.
 * @property {Array<UserEquityEntity>} list original list passed to the filter.
 * @property {Function} onChange Function to handle data changes.
 */
/**
 *
 * @param {DefaultProps} props Default component props.
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
      <EquityFilter list={list} onChange={onChange} />
    </Box>
  );
};

export default HistoryFilter;
