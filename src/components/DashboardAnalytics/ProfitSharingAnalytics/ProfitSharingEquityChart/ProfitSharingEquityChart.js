import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import TotalEquityGraph from "../../../Balance/TotalEquity/TotalEquityGraph";
import EquityFilter from "../../../Balance/TotalEquity//EquityFilter";
import EquityGraphLabels from "../../../Balance/TotalEquity//GraphLabels";
import { formatFloat } from "../../../../utils/format";
import { FormattedMessage } from "react-intl";
import "./ProfitSharingEquityChart.scss";

/**
 * @typedef {import("../../../Balance/TotalEquity/TotalEquityGraph/TotalEquityGraph").EquityChartData} EquityChartData
 * @typedef {import("../../../../services/tradeApiClient.types").UserEquityEntity} UserEquityEntity
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {number} currentBalance
 * @property {Array<EquityChartData>} data
 * @property {ExchangeConnectionEntity} selectedExchange
 */

/**
 * Render balance line chart for profit sharing analytics.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const ProfitSharingEquityChart = ({ currentBalance, data, selectedExchange }) => {
  const [tableData, setTableData] = useState(data);

  return (
    <Box
      alignItems="flex-start"
      className="profitSharingEquityChart"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Box
        alignItems="flex-start"
        className="equityHeader"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
      >
        <div>
          <Typography className="boxTitle" variant="h3">
            <FormattedMessage id="dashboard.balance" />
          </Typography>
          <Typography className="number2">USDT {formatFloat(currentBalance)}</Typography>
        </div>
        <EquityFilter
          list={tableData}
          onChange={(/** @type {typeof tableData} */ d) => setTableData(d)}
        />
      </Box>
      <Box className="chartBox" width={1}>
        <TotalEquityGraph list={tableData} modal={false} selectedExchange={selectedExchange} />
        <EquityGraphLabels list={tableData} />
      </Box>
    </Box>
  );
};

export default ProfitSharingEquityChart;
