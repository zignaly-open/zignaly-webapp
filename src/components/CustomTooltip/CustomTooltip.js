import React from "react";
import { Tooltip, Box, Popper } from "@material-ui/core";
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
 * @param {*} props Props.
 * @return {JSX.Element} A wrapper for popper component.
 */
const CustomPopper = ({ pos, children: childrenPopper, ...othersProps }) => {
  /**
   * @type React.CSSProperties
   */
  const posStyle = pos
    ? {
        marginLeft: pos.left + "px",
        marginTop: pos.top + "px",
        position: "absolute",
      }
    : {};
  /**
   * @param {*} childrenProps Props.
   * @return {JSX.Element} The wrapped children components.
   */
  const childrenWrapper = (childrenProps) => (
    <Box className="customTooltipPopper" style={posStyle}>
      {childrenPopper(childrenProps)}
      <Box className="lineTooltip" />
    </Box>
  );
  return <Popper {...othersProps}>{childrenWrapper}</Popper>;
};

/**
 * @typedef {Object} DefaultProps
 * @property {PosType} [pos] Custom tooltip position.
 *
 * @typedef {TooltipProps & DefaultProps} FullProps
 */

/**
 * Provides a custom tooltip component.
 *
 * @param {FullProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 *
 */
const CustomTooltip = (props) => {
  const { title, children, pos, ...others } = props;

  return (
    <Tooltip
      PopperComponent={pos ? CustomPopper : Popper}
      // @ts-ignore
      PopperProps={{ pos }}
      classes={{ tooltip: "customTooltip" }}
      title={title}
      {...others}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
