import { useRef, useState } from "react";

/**
 * @typedef {import('chart.js').ChartOptions} ChartOptions
 */

/**
 * @typedef {Object} ChartTooltipDataType
 * @property {boolean} isVisible Flag to indicate if tooltip is visible.
 * @property {React.ReactNode|string} content Content to display inside the tooltip.
 * @property {{left: number, top: number}} pos Tooltip position.
 */

/**
 * @typedef {Object} HookChartTooltipData
 * @property {ChartOptions['tooltips']['custom']} showTooltip Show tooltip chart callback.
 * @property {ChartTooltipDataType} tooltipData Tooltip Data
 * @property {React.MutableRefObject<any>} pointHoverRef Ref to line hover point.
 * @property {React.MutableRefObject<any>} chartRef Ref to line chart.
 */

/**
 * Hook to show a tooltip in a chart.
 *
 * @param {function} tooltipFormat Function to return tooltip formatted content.
 * @returns {HookChartTooltipData} Chart tooltip data.
 */
const useChartTooltip = (tooltipFormat) => {
  const chartRef = useRef(null);
  const pointHoverRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(
    /** @type {ChartTooltipDataType} **/ ({
      isVisible: false,
      content: "",
      pos: { left: 0, top: 0 },
    }),
  );

  /**
   * Callback to handle tooltip display.
   * @param {Chart.ChartTooltipModel} tooltip Tooltip model.
   * @returns {void}
   */
  const showTooltip = (tooltip) => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    // hide the tooltip when chartjs determines you've hovered out
    if (tooltip.opacity === 0) {
      setTooltipData((data) => ({ ...data, isVisible: false }));
      return;
    }

    // Set tooltip position.
    const left = tooltip.caretX;
    const top = tooltip.caretY;

    // Set values for display of data in the tooltip
    const content = tooltipFormat(tooltip.dataPoints[0]);

    setTooltipData((data) => ({ ...data, pos: { left, top }, isVisible: true, content }));
  };

  return { showTooltip, tooltipData, pointHoverRef, chartRef };
};

export default useChartTooltip;
