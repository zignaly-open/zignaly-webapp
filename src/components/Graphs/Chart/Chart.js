import React, { useState, useRef, useCallback } from "react";
import "./Chart.scss";
import { Box, Tooltip, Button, Popper } from "@material-ui/core";
import CustomToolip from "../../CustomTooltip";
import { Line } from "react-chartjs-2";
import { withStyles } from "@material-ui/core/styles";

/**
 * @typedef {import('chart.js').ChartData} Chart.ChartData
 * @typedef {import('chart.js').ChartOptions} Chart.ChartOptions
 * @typedef {import('chart.js').ChartTooltipModel} Chart.ChartTooltipModel
 * @typedef {import('../../CustomTooltip/CustomTooltip').PosType} PosType
 */

/**
 * @typedef {Object} ChartData
 * @property {Array<Number>} values Chart values.
 * @property {Array<String>} labels Chart labels.
 */

/**
 * @typedef {Object} ChartColorOptions
 * @property {string} backgroundColor Background HTML color.
 * @property {string} borderColor Border HTML color.
 * @property {string} gradientColor1 Chart gradient color top.
 * @property {string} gradientColor2 Chart gradient color bottom.
 */

const MemoizedLine = React.memo(Line, (/* prevProps, nextProps */) => true);
const MemoizedCustomToolip = React.memo(CustomToolip, (/* prevProps, nextProps */) => true);

/**
 * @typedef {Object} LineChartPropTypes
 * @property {ChartColorOptions} colorsOptions Chart colors.
 * @property {ChartData} chartData Chart dataset.
 * @property {function} tooltipFormat Function to format data based on selected value.
 */

var randomScalingFactor = function () {
  return (Math.random() > 0.5 ? 1.0 : 1.0) * Math.round(Math.random() * 100);
};

var line1 = [
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
  randomScalingFactor(),
];

var MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const StyledToolip = ({ pos }) =>
  withStyles({
    popper: { transform: `translate3d(${pos.left}px, ${pos.top}px, 0px) !important` },
    tooltip: {},
  })(Tooltip);

const CustomPopper = ({ pos, children: childrenPopper, ...othersProps }) => {
  console.log(pos);
  const posStyle = pos
    ? {
        marginLeft: pos.left + "px",
        marginTop: pos.top + "px",
        position: "absolute",
      }
    : { marginTop: Math.random() * 100 + "px" };
  //   return <Box>aaa</Box>;
  /**
   * @param {*} childrenProps Props.
   * @return {JSX.Element} The wrapped children components.
   */
  const childrenWrapper = (childrenProps) => (
    <Box className="customTooltipPopper customPos" style={posStyle}>
      {childrenPopper(childrenProps)}
      <Box className="lineTooltip" />
    </Box>
  );
  return <Popper {...othersProps}>{childrenWrapper}</Popper>;
};
const CustomPopperMaker = (pos) => (props) => CustomPopper(props);

/**
 * Provides a wrapper to display a chart.
 *
 * @param {LineChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const LineChart = (props) => {
  const { chartData, colorsOptions, tooltipFormat } = props;
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltipContent, setTooltipContent] = useState();
  const [pos, setPos] = useState(/** @type {PosType} */ (null));
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  /**
   * Callback to handle tooltip display.
   * @param {Chart.ChartTooltipModel} tooltip Tooltip model.
   * @returns {void}
   */
  const showTooltip = (tooltip) => {
    // if chart is not defined, return early
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    // hide the tooltip when chartjs determines you've hovered out
    if (tooltip.opacity === 0) {
      setTooltipVisibility(false);
      return;
    }

    // Set tooltip position.
    const position = chart.chartInstance.canvas.getBoundingClientRect();

    const left = tooltip.caretX;
    const top = tooltip.caretY;
    setPos({ top, left });

    // Set values for display of data in the tooltip
    const content = tooltipFormat(tooltip.dataPoints[0]);
    setTooltipContent(content);

    // Show tooltip
    setTooltipVisibility(true);
  };
  const showTooltipCallback = useCallback(showTooltip, []);

  /**
   * @type Chart.ChartData
   */
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "",
        data: chartData.values,
        backgroundColor: colorsOptions.backgroundColor,
        borderColor: colorsOptions.borderColor,
        fill: "start",
        // pointHitRadius: 20,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 4,
        pointHoverBorderColor: "#5200c5",
        pointHoverBackgroundColor: "#fff",
      },
    ],
  };

  /**
   * @type Chart.ChartOptions
   */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    hover: {
      intersect: false,
      mode: "index",
      animationDuration: 0,
    },
    tooltips: {
      mode: "index",
      intersect: false,
      position: "nearest",
      displayColors: false,
      enabled: false,
      custom: showTooltipCallback,
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0,
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
            fontFamily: "PlexSans-Bold",
          },
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
        },
      ],
    },
    // events: ["click", "touchstart", "touchmove"],
  };

  const data2 = {
    labels: MONTHS,
    datasets: [
      {
        label: "My First dataset",
        //   backgroundColor: window.chartColors.red,
        borderColor: "red",
        data: line1,
        fill: false,
      },
    ],
  };

  const plugins = [
    {
      id: "responsiveGradient",
      /**
       * @typedef {Object} ChartWithScales
       * @property {*} scales
       *
       * @typedef {Chart & ChartWithScales} ExtendedChart
       */

      /**
       * Fill chart with gradient on layout change.
       *
       * @param {ExtendedChart} chart Chart instance.
       * @returns {void}
       */
      afterLayout: (chart /* options */) => {
        let scales = chart.scales;
        let color = chart.ctx.createLinearGradient(0, scales["y-axis-0"].bottom, 0, 0);
        color.addColorStop(0, colorsOptions.gradientColor2);
        color.addColorStop(1, colorsOptions.gradientColor1);
        chart.data.datasets[0].backgroundColor = color;
      },
    },
  ];

  const posStyle = pos
    ? {
        // transform: `translate3d(${pos.left}px, ${pos.top}px, 0px) !important`,
        color: "green",
        marginLeft: pos.left + "px",
        marginTop: pos.top + "px",
        position: "absolute",
        // paddingTop: "170px",
      }
    : {};
  const offset = pos ? `${pos.left}, 0` : "";
  //   console.log(posStyle);

  if (tooltipRef.current) {
    tooltipRef.current.pos = pos;
  }
  return (
    <Box className="chart">
      {/* {isTooltipVisible && ( */}
      {/* <Tooltip
        title="My Tooltip"
        open={isTooltipVisible}
        placement="left"
        PopperProps={{ keepMounted: true }}
      >
        <span>Anchor Point here</span>
      </Tooltip> */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setTooltipVisibility(!isTooltipVisible)}
      >
        Toggle Tooltip
      </Button>
      {/* <MemoizedCustomToolip open={isTooltipVisible} pos={pos} title="testtttttttttttttt">
        <Box />
      </MemoizedCustomToolip> */}
      <Tooltip
        // PopperComponent={CustomPopperMaker(pos)}
        PopperComponent={CustomPopper}
        classes={{ tooltip: "customTooltip" }}
        // PopperProps={{
        //   popperOptions: {
        //     modifiers: {
        //       offset: {
        //         enabled: true,
        //         offset,
        //       },
        //     },
        //   },
        // }}
        pos={pos}
        PopperProps={{ keepMounteds: true, styless: { ...posStyle }, pos }}
        // title="testtttttttttttttt"
        // style={{ background: "red" }}
        placement="top-start"
        title={tooltipContent}
        open={isTooltipVisible}
        pos={pos}
        ref={tooltipRef}
      >
        <MemoizedLine data={data} options={options} ref={chartRef} plugins={plugins} />
      </Tooltip>
      {/* )} */}

      {/* <CustomToolip open={isTooltipVisible} pos={pos} title={tooltipContent}> */}
      {/* </CustomToolip> */}
    </Box>
  );
};

export default LineChart;
