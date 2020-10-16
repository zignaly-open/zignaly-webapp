import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import TotalEquityGraph from "../../../Balance/TotalEquity/TotalEquityGraph";
import TitleBar from "../../../Balance/TotalEquity//TitleBar";
import EquityFilter from "../../../Balance/TotalEquity//EquityFilter";
import EquityGraphLabels from "../../../Balance/TotalEquity//GraphLabels";
import { formatFloat, formatDate } from "../../../../utils/format";
import { generateDays } from "../../../../utils/chart";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import "./ProfitSharingEquityChart.scss";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").ProfitSharingBalanceEntry} ProfitSharingBalanceEntry
 * @typedef {import("../../../../services/tradeApiClient.types").UserEquityEntity} UserEquityEntity
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
  /** @type {Array<UserEquityEntity>} */
  const dailyBalance = [];

  generateDays();
  data
    .sort((a, b) => a.date - b.date)
    .reduce((/** @type {{date: string, amount: number}} */ lastData, entry) => {
      const entryDate = formatDate(entry.date, "YYYY/MM/DD");
      let totalUSDT;

      if (lastData) {
        console.log(lastData, entry);
        if (lastData.date === entryDate) {
          console.log("1");
          // Still same date, updating daily amount total
          totalUSDT = lastData.amount + entry.amount;
        } else {
          console.log("2");

          const nextDate = moment(lastData.date).add("1d").format("YYYY/MM/DD");
          if (nextDate !== entryDate) {
            // Day with no data so keeping the same amount as previous one
            totalUSDT = lastData.amount;
          } else {
          }
        }
      } else {
        // Init first day with entry amount
        totalUSDT = entry.amount;
      }

      // Update daily balance
      dailyBalance.push({
        date: entryDate,
        totalUSDT,
      });

      // Return last aggregated data
      return {
        date: entryDate,
        amount: totalUSDT,
      };
    }, null);
  const [tableData, setTableData] = useState(dailyBalance);

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
