import React, { useRef, useEffect } from "react";
import "./Doughnut.scss";
import { Box } from "@material-ui/core";
import { Doughnut as DoughnutChart } from "react-chartjs-2";

/**
 * @typedef {import('chart.js').ChartData} ChartData
 * @typedef {import('chart.js').ChartOptions} ChartOptions
 * @typedef {Object} DoughnutColorOptions
 * @property {Array<String>} backgroundColor Background HTML color.
 * @property {string} [borderColor] Border HTML color.
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<Number>} values Chart values.
 * @property {Array<String>} labels Chart labels.
 * @property {DoughnutColorOptions} colorOptions
 * @property {boolean} vertical Display legend under the doughnut.
 */

/**
 *
 * @param {DefaultProps} props
 */

const Doughnut = (props) => {
  const { values, labels, colorOptions, vertical } = props;
  const chartRef = useRef(null);
  const legendId = `legendBox${Math.random()}`;
  /**
   * @type {ChartData}
   */
  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: colorOptions.backgroundColor,
        borderColor: colorOptions.borderColor,
      },
    ],
  };

  /**
   * @type {ChartOptions}
   */
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    layout: {
      padding: {
        // right: vertical ? 0 : 100,
      },
    },
    legend: {
      display: false,
    },
    /* @ts-ignore */
    legendCallback: (chart) => {
      let ul = document.createElement("ul");
      chart.data.datasets.forEach((dataset) => {
        let backgroundColor = colorOptions.backgroundColor;
        const labelsSorted = labels
          .map((l, index) => ({ label: l, index, value: dataset.data[index] }))
          .sort((a, b) => {
            // @ts-ignore
            return b.value - a.value;
          });
        labelsSorted.forEach((labelData) => {
          ul.innerHTML += `
                  <li>
                     <span class="circle" style="background-color: ${
                       backgroundColor[labelData.index]
                     }"></span>
                     <span class="value number2">${labelData.value}% ${labelData.label}</span>
                   </li>
                `;
        });
      });
      return ul.outerHTML;
    },
    cutoutPercentage: 65,
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  const renderLegend = () => {
    document.getElementById(legendId).innerHTML = chartRef.current.chartInstance.generateLegend();
  };

  useEffect(renderLegend, [data, labels]);

  return (
    <div className={`doughnut ${vertical ? "vertical" : ""}`}>
      {/* <div className="test"> */}
      <div className="canvasParent">
        <DoughnutChart height={null} width={null} data={data} options={options} ref={chartRef} />
      </div>
      {/* </div> */}
      <div className="legendBox" id={legendId} />
    </div>
  );
};

export default Doughnut;
