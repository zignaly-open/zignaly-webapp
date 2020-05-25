import React from "react";
import "./CustomFilters.scss";
import { Box } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CustomButtom from "../CustomButton";

/**
 * @typedef {import('react').MouseEventHandler} MouseEventHandler
 * @typedef {Object} CustomFiltersPropTypes
 * @property {MouseEventHandler} onClose Callback that delegate filters toggle state to caller.
 * @property {MouseEventHandler} onClear Callback that delegate filters clearing to caller.
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
          <FormattedMessage id="fil.clearall" />
        </CustomButtom>
        <CustomButtom className="text-purple" onClick={onClose}>
          <FormattedMessage id="fil.hide" />
        </CustomButtom>
      </Box>
    </Box>
  );
};

export default CustomFilters;
