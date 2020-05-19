import React from "react";
import "./PositionFilters.scss";
import { Box } from "@material-ui/core";
import CustomButtom from "../../CustomButton";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Function} onChange
 * @property {Function} onClose
 *
 */

/**
 * Default component props.
 *
 * @param {DefaultProps} props
 */

const PositionFilters = (props) => {
  const { onClose, onChange } = props;

  return (
    <Box
      alignItems="center"
      className="positionFilters"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box
        alignItems="center"
        className="filters"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <span className="title">Filters</span>
      </Box>
      <Box
        alignItems="center"
        className="actions"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <CustomButtom className="textPurple" onClick={onClose}>
          Clear All
        </CustomButtom>
        <CustomButtom className="textPurple" onClick={onClose}>
          Hide
        </CustomButtom>
      </Box>
    </Box>
  );
};

export default PositionFilters;
