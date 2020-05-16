import React from "react";
import PropTypes from "prop-types";
import "./ProvidersFilters.scss";
import { Box } from "@material-ui/core";
import CustomButtom from "../../CustomButton";

const ProvidersFilters = (props) => {
  const { onClose, onClear, title } = props;

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      className="providersFilters"
    >
      <Box
        className="filters"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <span className="title">{title}</span>
        {props.children}
      </Box>
      <Box
        className="actions"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <CustomButtom onClick={onClear} className="textPurple">
          Clear All
        </CustomButtom>
        <CustomButtom onClick={onClose} className="textPurple">
          Hide
        </CustomButtom>
      </Box>
    </Box>
  );
};

ProvidersFilters.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default ProvidersFilters;
