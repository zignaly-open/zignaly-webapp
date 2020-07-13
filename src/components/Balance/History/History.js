import React, { useState, useEffect } from "react";
import "./History.scss";
import { Box } from "@material-ui/core";
import HistoryTable from "./HistoryTable";
import HistoryFilter from "./HistoryFilter";

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

  const initData = () => {
    setList(dailyBalance.balances);
  };

  useEffect(initData, [dailyBalance]);
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

  const embedFilter = <HistoryFilter list={dailyBalance.balances} onChange={handleChange} />;

  return (
    <Box
      alignItems="flex-start"
      className="history"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <HistoryTable
        list={list}
        persistKey="dailyBalance"
        quotes={dailyBalance.quotes}
        title={embedFilter}
      />
    </Box>
  );
};

export default History;
