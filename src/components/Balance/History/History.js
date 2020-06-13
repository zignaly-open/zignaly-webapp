import React, { useState } from "react";
import "./History.scss";
import { Box } from "@material-ui/core";
import HistoryTable from "./HistoryTable";
import { FormattedMessage } from "react-intl";
import EquityFilter from "../TotalEquity/EquityFilter";

/**
 * @typedef {import("../../../services/tradeApiClient.types").DefaultDailyBalanceEntity} DefaultDailyBalanceEntity
 * @typedef {import("../../../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 * @typedef {Object} DefaultProps
 * @property {DefaultDailyBalanceEntity} dailyBalance Daily balance.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const History = ({ dailyBalance }) => {
  const [list, setList] = useState(dailyBalance.balances);
  /**
   *
   * @typedef {import("../../../store/initialState").UserEquityEntity} UserEquityEntity
   */

  /**
   * @param {Array<UserEquityEntity>} data Filtered equity data.
   * @returns {void}
   */
  const handleChange = (data) => {
    setList(data);
  };

  return (
    <Box
      alignItems="flex-start"
      className="history"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Box
        alignItems="center"
        bgcolor="grid.content"
        className="historyHeader"
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
      >
        <EquityFilter list={dailyBalance.balances} onChange={handleChange} />
      </Box>
      <HistoryTable
        list={list}
        persistKey="dailyBalance"
        quotes={dailyBalance.quotes}
        title={<FormattedMessage id="dashboard.balance.historical" />}
      />
    </Box>
  );
};

export default History;
