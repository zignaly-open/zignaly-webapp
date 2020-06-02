import React from "react";
import "./CustomFilters.scss";
import { Box, Button, Icon } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CustomButtom from "../CustomButton";
import ChevronRightIcon from "../../images/filters/chevron-right.svg";
import ClosetIcon from "../../images/filters/close.svg";

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
        <CustomButtom
          className="textPurple"
          onClick={onClear}
          startIcon={<img className="icon" src={ClosetIcon} />}
        >
          <FormattedMessage id="fil.clearall" />
        </CustomButtom>
        <CustomButtom
          className="textPurple"
          onClick={onClose}
          startIcon={<img className="icon" src={ChevronRightIcon} />}
        >
          <FormattedMessage id="fil.hide" />
        </CustomButtom>
      </Box>
    </Box>
  );
};

export default CustomFilters;
