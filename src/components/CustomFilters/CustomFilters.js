import React from "react";
import "./CustomFilters.scss";
import { Box, Collapse } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CustomButtom from "../CustomButton";
import ChevronRightIcon from "../../images/filters/chevron-right.svg";
import ClosetIcon from "../../images/filters/close.svg";

/**
 * @typedef {Object} CustomFiltersPropTypes
 * @property {function} [onClose] Callback that delegate filters toggle state to caller.
 * @property {function} [onClear] Callback that delegate filters clearing to caller.
 * @property {string} title Filters' title.
 * @property {boolean} [open] Flag to trigger open filter bar transition.
 * @property {*} children Dropdowns to display.
 */

/**
 * Provides a wrapper to display filters bar with clear/hide buttons.
 *
 * @param {CustomFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const CustomFilters = (props) => {
  const { onClose, onClear, title, open, children } = props;

  return (
    <ConditionalWrapper
      condition={open !== undefined}
      wrapper={(_children) => (
        <Collapse in={open} unmountOnExit={true}>
          {_children}
        </Collapse>
      )}
    >
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
          {title && <span className="title">{title}</span>}
          {children}
        </Box>
        <Box
          alignItems="center"
          className="actions"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          {onClear && (
            <CustomButtom
              className="textPurple"
              onClick={() => onClear()}
              startIcon={<img className="icon iconPurple" src={ClosetIcon} />}
            >
              <FormattedMessage id="fil.clearall" />
            </CustomButtom>
          )}
          {onClose && (
            <CustomButtom
              className="textPurple"
              onClick={() => onClose()}
              startIcon={<img className="icon iconPurple" src={ChevronRightIcon} />}
            >
              <FormattedMessage id="fil.hide" />
            </CustomButtom>
          )}
        </Box>
      </Box>
    </ConditionalWrapper>
  );
};

/**
 * @typedef {Object} ConditionalWrapperPropTypes
 * @property {boolean} condition
 * @property {React.FunctionComponent} wrapper
 * @property {JSX.Element} children
 */

/**
 * Conditionally wrap children component
 * @param {ConditionalWrapperPropTypes} props Props
 * @returns {JSX.Element} Element.
 */
const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

export default CustomFilters;
