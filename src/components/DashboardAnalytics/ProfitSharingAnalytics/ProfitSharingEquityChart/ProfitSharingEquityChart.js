import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";
import TotalEquityGraph from "../../../Balance/TotalEquity/TotalEquityGraph";
import EquityFilter from "../../../Balance/TotalEquity//EquityFilter";
import EquityGraphLabels from "../../../Balance/TotalEquity//GraphLabels";
import { formatFloat, formatDate } from "../../../../utils/format";
import { generateDailyData } from "../../../../utils/chart";
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
  const dailyBalance = generateDailyData(data, (date, amount) => ({
    date: formatDate(date, "YYYY/MM/DD"),
    amount,
  }));

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
