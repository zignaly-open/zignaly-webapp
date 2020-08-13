import React, { useCallback } from "react";
import "./BarChart.scss";
import { Box } from "@material-ui/core";
import { Bar, HorizontalBar } from "react-chartjs-2";
import "../Chart.roundedBarCharts";
import LogoIcon from "../../../images/logo/logoIcon.svg";
import useChartTooltip from "../../../hooks/useChartTooltip";
import TooltipChart from "../TooltipChart";
import { isEqual } from "lodash";

// Chart.Tooltip.positioners.cursor = function (chartElements, coordinates) {
//   return { x: coordinates.x, y: 210 };
// };

/**
 * Check that props are equals (deep comparison)
 * @param {*} prevProps prevProps
 * @param {*} nextProps nextProps
 * @returns {boolean} Equality
 */
const propsEqual = (prevProps, nextProps) =>
  isEqual(prevProps.data, nextProps.data) && isEqual(prevProps.options, nextProps.options);

// Memoize the chart and only re-renders when the data is updated.
// Otherwise it will be rendered everytime the toolip is triggered(state update).
const MemoizedBar = React.memo(Bar, propsEqual);
const MemoizedHorizontalBar = React.memo(HorizontalBar, propsEqual);

/**
 * @typedef {import('chart.js').ChartData} ChartData
 * @typedef {import('chart.js').ChartOptions} ChartOptions
 * @typedef {import('chart.js').ChartPluginsOptions} ChartPluginsOptions
 * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
 * @typedef {import('chart.js').Chart} Chart
 */

/**
 * @callback ChartTooltipCallback
 * @param {ChartTooltipItem} tooltipItem:
 * @param {ChartData} data
 */

/**
 * @typedef {Object} BarChartPropTypes
 * @property {Array<Number>} values Chart values.
 * @property {Array<String>} [labels] Chart labels.
 * @property {Array<String>} [imageUrls] Chart images (used instead of labels).
 * @property {boolean} [horizontal] Flag to display the bars horizontally.
 * @property {boolean} [adjustHeightToContent] Adjust thw height of the canvas dynamicaly to fit its content. (Horizontal only)
 * @property {ChartTooltipCallback} tooltipFormat Function to format data based on selected value.
 * @property {ChartOptions} options Custom user options to override.
 */

/**
 * Provides a wrapper to display a bar chart.
 *
 * @param {BarChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const BarChart = (props) => {
  const {
    values,
    labels,
    horizontal,
    tooltipFormat,
    imageUrls,
    adjustHeightToContent,
    options: customOptions,
  } = props;
  const { chartRef, pointHoverRef, tooltipData, showTooltip } = useChartTooltip(tooltipFormat);
  const showTooltipCallback = useCallback(showTooltip, [values]);

  /**
   * @type ChartData
   */
  const data = {
    labels: imageUrls ? values.map(() => "") : labels,
    datasets: [
      {
        data: values,
        barThickness: 20,
        maxBarThickness: 24,
        // barPercentage: 0.5,
        // backgroundColor: colorsOptions.backgroundColor,
        backgroundColor: values.map((v) => (v < 0 ? "#f63f82" : "#08a441")),
      },
    ],
  };

  const yAxes = {
    ticks: {
      fontColor: "#d4d4d4",
      fontSize: 14,
      // padding: 75,
      padding: 0,
      // stepSize: 1,
      //   min: -2,
    },
    gridLines: {
      // draw zero line only
      color: "transparent",
      display: true,
      drawBorder: false,
      zeroLineColor: "#d4d4d4",
    },
  };

  const xAxes = {
    gridLines: {
      display: false,
    },
    ticks: {
      display: true,
      padding: horizontal ? 10 : 0,
    },
    // categoryPercentage: 1,
    // barPercentage: 0.7,
  };

  // Load all images
  const [imagesElements, setImages] = React.useState([]);
  React.useEffect(() => {
    if (imageUrls) {
      const images = imageUrls.map((imageUrl) => {
        let image = new Image();
        image.src = imageUrl;
        return image;
      });
      setImages(images);
    }
  }, [imageUrls]);

  /**
   * @typedef {Object} RoundedChartOptions
   * @property {number} cornerRadius:
   *
   * @typedef {ChartOptions & RoundedChartOptions} ExtendedChartOptions
   */
  /**
   * @type ExtendedChartOptions
   */
  let options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      yAxes: [horizontal ? xAxes : yAxes],
      xAxes: [horizontal ? yAxes : xAxes],
    },
    layout: {
      padding: {
        // left: 25,
        left: horizontal ? 15 : 0,
        right: 0,
        top: 20,
        bottom: horizontal ? 10 : imageUrls ? 25 : 0,
      },
    },
    cornerRadius: 4,
    tooltips: {
      enabled: false,
      custom: showTooltipCallback,
    },
    animation: {
      duration: 0,
    },
    hover: {
      intersect: false,
      mode: "index",
      animationDuration: 0,
    },
    plugins: {
      legendImages: imagesElements
        ? {
            images: imagesElements,
            horizontal,
          }
        : false,
    },
    // events: ["click", "touchstart", "touchmove"],
  };

  const plugins = [
    {
      id: "legendImages",
      /**
       * @typedef {Object} ChartWithScales
       * @property {*} scales
       *
       * @typedef {Chart & ChartWithScales} ExtendedChart
       */
      /**
       * Draw images at the bottom of the graph
       * @param {ExtendedChart} chart Chart instance.
       * @returns {void}
       */
      afterDraw: (chart) => {
        if (!chart.data.datasets) return;
        const { images, horizontal: isHorizontal } = chart.options.plugins.legendImages;
        let ctx = chart.ctx;
        let xAxis = chart.scales["x-axis-0"];
        let yAxis = chart.scales["y-axis-0"];

        /**
         * @param {HTMLImageElement} image The image to draw.
         * @param {number} index Data infex.
         * @returns {void}
         */
        const drawImage = (image, index) => {
          if (!image.naturalWidth) {
            // Image didn't load properly, fallback to default icon
            image.src = LogoIcon;
          }

          if (isHorizontal) {
            // Draw image on the left
            const y = yAxis.getPixelForTick(index);
            const size = 26;
            ctx.drawImage(image, 0, y - size / 2, size, size);
          } else {
            // Draw image at the bottom
            const x = xAxis.getPixelForTick(index);
            const size = 40;
            ctx.drawImage(image, x - size / 2, yAxis.bottom + 15, size, size);
          }
        };

        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          if (!image.complete) {
            image.onload = () => {
              drawImage(image, i);
            };
          } else {
            drawImage(image, i);
          }
        }
      },
    },
  ];

  // Merge user options
  options = Object.assign(options, customOptions);

  const BarComponent = horizontal ? MemoizedHorizontalBar : MemoizedBar;

  let height = 0;
  if (horizontal && adjustHeightToContent) {
    // Calculate optimal height to display all the bars.
    const BAR_GAP = 3;
    const X_AXIS_HEIGHT = 60;
    let barThickness = data.datasets[0].barThickness;
    barThickness = typeof barThickness === "number" ? barThickness : 0;
    height = values.length * (barThickness + BAR_GAP * 2) + X_AXIS_HEIGHT;
  }

  return (
    <Box className="barChart" style={{ ...(height && { height }) }}>
      <TooltipChart pointHoverRef={pointHoverRef} showPointHover={false} tooltipData={tooltipData}>
        <BarComponent data={data} options={options} plugins={plugins} ref={chartRef} />
      </TooltipChart>
    </Box>
  );
};

export default BarChart;
