import React from "react";
import "./PositionFilters.scss";
import { Box } from "@material-ui/core";
import CustomButtom from "../../CustomButton";

const PositionFilters = props => {
  const { onClose } = props;

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
        <CustomButtom className="text-purple" onClick={onClose}>
          Clear All
        </CustomButtom>
        <CustomButtom className="text-purple" onClick={onClose}>
          Hide
        </CustomButtom>
      </Box>
    </Box>
  );
};

export default PositionFilters;
