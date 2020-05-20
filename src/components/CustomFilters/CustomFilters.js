import React from "react";
import PropTypes from "prop-types";
import "./CustomFilters.scss";
import { Box } from "@material-ui/core";
import CustomButtom from "../CustomButton";

/**
 * @typedef {Object} CustomFiltersPropTypes
 * @property {function} onClose Callback that delegate filters toggle state to caller.
 * @property {function} onClear Callback that delegate filters clearing to caller.
 * @property {string} title Filters' title.
 * @property {*} children Dropdowns to display.
 */

/**
 * Provides a wrapper to display filters bar with clear/hide buttons.
 *
 * @param {CustomFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const CustomFilters = (props) => {
  const { onClose, onClear, title, children } = props;

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
        {children}
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
  children: PropTypes.node.isRequired,
  onClear: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default CustomFilters;
