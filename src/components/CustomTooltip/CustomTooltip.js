import React from "react";
import { Tooltip, Box, Popper, Button, Typography } from "@material-ui/core";
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
 * @typedef {Object} DefaultProps
 * @property {PosType} [pos] Custom tooltip position.
 *
 * @typedef {TooltipProps & DefaultProps} FullProps
 */

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const CustomPopper = ({ children: childrenPopper, ...othersProps }) => {
  //   console.log(othersProps);
  //   return <Box>aaa</Box>;
  /**
   * @param {*} childrenProps Props.
   * @return {JSX.Element} The wrapped children components.
   */
  const childrenWrapper = (childrenProps) => (
    <Box className="customTooltipPopper customPos">
      {childrenPopper(childrenProps)}
      <Box className="lineTooltip" />
    </Box>
  );
  return <Popper {...othersProps}>{childrenWrapper}</Popper>;
};

/**
 * Provides a custom tooltip component.
 *
 * @param {FullProps} props Component props.
 * @returns {JSX.Element} Component JSX.
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
  const CustomPopper0 = ({ children: childrenPopper, ...othersProps }) => {
    return <Box>aaa</Box>;
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
  console.log("object");

  return (
    // <HtmlTooltip
    //   title={
    //     <React.Fragment>
    //       <Typography color="inherit">Tooltip with HTML</Typography>
    //       <em>{"And here's"}</em> <b>{"some"}</b> <u>{"amazing content"}</u>.{" "}
    //       {"It's very engaging. Right?"}
    //     </React.Fragment>
    //   }
    //   {...others}
    // >
    //   <Button>HTML</Button>
    // </HtmlTooltip>
    <StyledTooltip
      //   PopperComponent={pos ? CustomPopper : Popper}
      //   classes={{ tooltip: "customTooltip" }}
      PopperProps={{ keepMounted: true, style: { ...posStyle } }}
      title={title}
      {...others}
    >
      {children}
    </StyledTooltip>
  );
};

export default CustomTooltip;
