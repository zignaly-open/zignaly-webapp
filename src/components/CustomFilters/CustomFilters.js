import React from "react";
import PropTypes from "prop-types";
import "./CustomFilters.scss";
import { Box } from "@material-ui/core";
import CustomButtom from "../CustomButton";

const CustomFilters = (props) => {
  const { onClose, onClear, title } = props;

  return (
    <Box
      alignItems="center"
      className="customFilters"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box
        alignItems="center"
        className="filters"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <span className="title">{title}</span>
        {props.children}
      </Box>
      <Box
        alignItems="center"
        className="actions"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <CustomButtom className="text-purple" onClick={onClear}>
          Clear All
        </CustomButtom>
        <CustomButtom className="text-purple" onClick={onClose}>
          Hide
        </CustomButtom>
      </Box>
    </Box>
  );
};

CustomFilters.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default CustomFilters;
