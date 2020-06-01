import React from "react";
import { Tooltip, Box, Popper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import "./CustomTooltip.scss";

const CustomTooltip = (props) => {
  const { title, children, pos, ...others } = props;

  // Custom tooltip position for the chart
  const posStyle = !_.isEmpty(pos)
    ? {
        transform: `translate3d(${pos.left}px, ${pos.bottom}px, 0px) !important`,
      }
    : null;

  const StyledTooltip = withStyles({ popper: posStyle, tooltip: {} })(Tooltip);

  const CustomPopper = ({ children, ...others }) => {
    const childrenWrapper = (childrenProps) => (
      <Box className={`customTooltipPopper ${!_.isEmpty(pos) ? "customPos" : ""}`}>
        {children(childrenProps)}
        {!_.isEmpty(pos) && <Box className="lineTooltip" />}
      </Box>
    );
    return <Popper children={childrenWrapper} {...others} />;
  };

  return (
    <StyledTooltip
      title={title}
      classes={{ tooltip: "customTooltip" }}
      PopperComponent={CustomPopper}
      {...others}
    >
      <Box>{children}</Box>
    </StyledTooltip>
  );
};

export default CustomTooltip;
