import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import TotalEquityGraph from "../../../Balance/TotalEquity/TotalEquityGraph";
import TitleBar from "../../../Balance/TotalEquity//TitleBar";
import EquityFilter from "../../../Balance/TotalEquity//EquityFilter";
import EquityGraphLabels from "../../../Balance/TotalEquity//GraphLabels";
import { formatFloat } from "../../../../utils/format";
import { FormattedMessage } from "react-intl";
import "./ProfitSharingEquityChart.scss";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").ProfitSharingBalanceEntry} ProfitSharingBalanceEntry
 */

/**
 * @typedef {Object} DefaultProps
 * @property {number} currentBalance
 * @property {Array<ProfitSharingBalanceEntry>} data
 */

/**
 * Render balance line chart for profit sharing analytics.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const ProfitSharingEquityChart = ({ currentBalance, data }) => {
  const tableDataAll = [];
  data
    .sort((a, b) => a.date - b.date)
    .reduce((totalBalance, entry) => {
      const newTotalBalance = parseFloat(totalBalance) + parseFloat(entry.amount);
      tableDataAll.push({
        date: entry.date,
        totalUSDT: newTotalBalance,
      });
      return newTotalBalance;
    }, 0);
  const [tableData, setTableData] = useState(tableDataAll);
  console.log(tableDataAll);

  return (
    <Box
      alignItems="flex-start"
      className="profitSharingEquityChart"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
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
        <EquityFilter list={tableData} onChange={(d) => setTableData(d)} />
      </Box>
      <Box width={1} className="chartBox">
        <TotalEquityGraph list={tableData} modal={false} />
        <EquityGraphLabels list={tableData} />
      </Box>
    </Box>
  );
};

export default ProfitSharingEquityChart;
