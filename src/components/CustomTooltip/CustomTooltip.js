import React from "react";
import { Tooltip } from "@mui/material";
import "./CustomTooltip.scss";

/**
 * @typedef {import('@mui/material/Tooltip').TooltipProps} TooltipProps
 */

/**
 * @typedef {Object} DefaultProps
 * @property {boolean} [customPopper] Flag to indicate whether to render the custom popper for chart tooltip.
 * @property {React.MutableRefObject<any>} [elementRef] Ref to the element to point to.
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
  const { title, children, customPopper, elementRef, ...others } = props;
  return (
    <Tooltip
      PopperProps={
        customPopper
          ? {
              popperOptions: {
                modifiers: {
                  flip: { enabled: false },
                  offset: {
                    enabled: true,
                    offset: "0px, 26px",
                  },
                },
              },
              anchorEl: elementRef.current,
            }
          : null
      }
      classes={{
        tooltip: "customTooltip",
        popper: customPopper ? "customTooltipPopper" : null,
        arrow: "customArrowTooltip",
      }}
      enterTouchDelay={100}
      title={title}
      {...others}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
