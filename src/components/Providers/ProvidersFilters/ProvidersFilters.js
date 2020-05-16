import React from "react";
import PropTypes from "prop-types";
import "./ProvidersFilters.scss";
import { Box } from "@material-ui/core";
import CustomButtom from "../../CustomButton";

const ProvidersFilters = (props) => {
  const { onClose, onClear, title } = props;

  return (
    <Box
      alignItems="center"
      className="providersFilters"
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
        <CustomButtom className="textPurple" onClick={onClear}>
          Clear All
        </CustomButtom>
        <CustomButtom className="textPurple" onClick={onClose}>
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
