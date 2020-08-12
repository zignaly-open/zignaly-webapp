import React from "react";
import "./TooltipChart.scss";
import CustomToolip from "../../CustomTooltip";

/**
 * @typedef {import('../../../hooks/useChartTooltip').ChartTooltipDataType} ChartTooltipDataType
 */

/**
 * @typedef {Object} TooltipChartPropTypes
 * @property {ChartTooltipDataType} tooltipData Tooltip config data.
 * @property {React.MutableRefObject<any>} pointHoverRef Ref to line hover point.
 * @property {React.ReactElement} children Chart component to wrap with tooltip.
 * @property {boolean} [showPointHover] Flag to display the point hover (tooltip base).
 */

/**
 * Provides a chart wrapper to display a tooltip.
 *
 * @param {TooltipChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TooltipChart = ({ pointHoverRef, tooltipData, children, showPointHover = true }) => {
  return (
    <>
      <div
        className="tooltipPointHover"
        ref={pointHoverRef}
        style={{
          visibility: tooltipData.isVisible ? "visible" : "hidden",
          transform: `translate(${tooltipData.pos.left - (showPointHover ? 8 : 0)}px, ${
            tooltipData.pos.top - (showPointHover ? 8 : 0)
          }px)`,
          ...(!showPointHover && {
            height: 0,
            border: 0,
            width: 0,
          }),
        }}
      />

      <CustomToolip
        arrow={true}
        customPopper={true}
        elementRef={pointHoverRef}
        open={tooltipData.isVisible}
        placement="top"
        title={tooltipData.content}
      >
        {children}
      </CustomToolip>
    </>
  );
};

export default TooltipChart;
