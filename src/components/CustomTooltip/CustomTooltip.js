import React from "react";
import { Tooltip, Box, Popper } from "@material-ui/core";
import "./CustomTooltip.scss";

/**
 * @typedef {import('@material-ui/core/Tooltip').TooltipProps} TooltipProps
 */

/**
 * Add a vertical line instead of an arrow to the popper.
 * @param {*} props Props.
 * @return {JSX.Element} A wrapper for popper component.
 */
const CustomPopper = ({ children, ...others }) => (
  <Popper {...others}>
    {(ref) => (
      <Box className="customTooltipPopper">
        <Box className="innerPopper">{children(ref)}</Box>
        <Box id="lineTooltip" />
      </Box>
    )}
  </Popper>
);

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
      PopperComponent={customPopper ? CustomPopper : Popper}
      PopperProps={
        customPopper
          ? {
              popperOptions: {
                modifiers: {
                  flip: { enabled: false },
                  offset: {
                    enabled: true,
                    offset: `0px, 26px`,
                  },
                  arrow: { enabled: true, element: "#lineTooltip" },
                },
              },
              anchorEl: elementRef.current,
            }
          : null
      }
      classes={{
        tooltip: "customTooltip",
      }}
      title={title}
      {...others}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
