import React from "react";
import { Tooltip, Box, Popper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import "./CustomTooltip.scss";

/**
 * @typedef {import('@material-ui/core/Tooltip').TooltipProps} TooltipProps
 */

/**
 * @typedef {Object} PosType
 * @property {number} top Tooltip top fixed position.
 * @property {number} left Tooltip left fixed position.
 */

/**
 * Provides a custom tooltip component.
 *
 * @typedef {Object} PropTypes
 * @property {PosType} [pos] Custom tooltip position.
 * @property {Object} [children] Child components of the tooltip.
 *
 * @param {TooltipProps & PropTypes} props Component props.
 * @returns {JSX.Element} Component JSX.
 *
 */
const CustomTooltip = (props) => {
  const { title, children, pos, ...others } = props;

  // Custom tooltip position for the chart
  const posStyle = pos
    ? {
        transform: `translate3d(${pos.left}px, ${pos.top}px, 0px) !important`,
      }
    : {};

  const StyledTooltip = withStyles({
    popper: posStyle,
    tooltip: {},
  })(Tooltip);

  /**
   * @param {*} props Props.
   * @return {JSX.Element} A wrapper for popper component.
   */
  const CustomPopper = ({ children: childrenPopper, ...othersProps }) => {
    /**
     * @param {*} childrenProps Props.
     * @return {JSX.Element} The wrapped children components.
     */
    const childrenWrapper = (childrenProps) => (
      <Box className={`customTooltipPopper ${pos ? "customPos" : ""}`}>
        {childrenPopper(childrenProps)}
        {pos && <Box className="lineTooltip" />}
      </Box>
    );
    return <Popper {...othersProps}>{childrenWrapper}</Popper>;
  };

  return (
    <StyledTooltip
      PopperComponent={CustomPopper}
      classes={{ tooltip: "customTooltip" }}
      title={title}
      {...others}
    >
      {children || <Box />}
    </StyledTooltip>
  );
};

export default CustomTooltip;
