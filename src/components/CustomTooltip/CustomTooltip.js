import React from "react";
import { Tooltip } from "@material-ui/core";
import "./CustomTooltip.scss";

const CustomTooltip = (props) => {
  const { title, children, ...others } = props;
  return (
    <Tooltip title={title} classes={{ tooltip: "customTooltip" }} {...others}>
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
