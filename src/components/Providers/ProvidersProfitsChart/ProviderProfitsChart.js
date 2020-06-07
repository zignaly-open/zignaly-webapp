import React from "react";
import { Paper } from "@material-ui/core";
import BarChart from "../../Graphs/BarChart";
import { useIntl } from "react-intl";
import Table from "../../Table";

/**
 * @typedef {import("../../Graphs/LineChart/LineChart").ChartColorOptions} ChartColorOptions
 * @typedef {import("../../Graphs/LineChart/LineChart").ChartData} ChartData
 * @typedef {import("../../../services/tradeApiClient.types").ProvidersStatsCollection} ProvidersStatsCollection
 */

/**
 * @typedef {Object} ProvidersAnalyticsPropTypes
 * @property {string} type Type of provider to retreive.
 * @property {string} quote
 * @property {OptionType} base
 * @property {string} timeFrame
 * @property {ProvidersStatsCollection} stats Table stats data.
 */

/**
 * Provides chart to display providers profits.
 *
 * @param {ProvidersAnalyticsPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersProfitChart = ({}) => {
  const intl = useIntl();
  /**
   * @type {ChartData}
   */
  const stats = [
    {
      percentageProfitW1: -1,
      percentageProfitW2: 1,
      percentageProfitW3: 0.5,
    },
  ];
  const values = [-1, 1, 0.5];
  const labels = ["W1", "W2", "W3"];
  let chartData = { values, labels };

  let columns = [
    {
      name: "todo",
      label: "--",
      options: {
        display: "true",
        // customBodyRender: (val, tableMeta) => (
        //   <img src={val} title={tableMeta.rowData[2]} width="30px" />
        // ),
        // setCellProps: (value) => ({
        //   className: "test",
        //   style: {
        //     textAlign: "center",
        //   },
        // }),
        // setCellHeaderProps: () => ({ style: { maxWidth: "140px" } }),
        setCellProps: () => ({ width: "140px" }),
        sort: false,
        // viewColumns: false,
        // sort: false,
      },
    },
    {
      name: "percentageProfitW1",
      label: "w1",
      options: {
        display: "true",
        setCellHeaderProps: () => ({ align: "center" }),
        setCellProps: () => ({ align: "center" }),
        sort: false,
      },
    },
    {
      name: "percentageProfitW2",
      label: "w2",
      options: {
        display: "true",
        setCellHeaderProps: () => ({ align: "center" }),
        sort: false,
      },
    },
    {
      name: "percentageProfitW3",
      label: "w3",
      options: {
        display: "true",
        setCellHeaderProps: () => ({ align: "center" }),
        sort: false,
      },
    },
  ];
  return (
    <Paper
      title={intl.formatMessage({
        id: "srv.profitspercentage",
      })}
    >
      <BarChart chartData={chartData} />
      <Table data={stats} columns={columns} />
    </Paper>
  );
};
export default ProviderProfitsChart;
