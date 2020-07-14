import React, { useState, useEffect } from "react";
import "./History.scss";
import { Box, CircularProgress } from "@material-ui/core";
import HistoryTable from "./HistoryTable";
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

  const embedFilter = <EquityFilter list={dailyBalance.balances} onChange={handleChange} />;

  return (
    <>
      {dailyBalance.loading && (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      )}
      {!dailyBalance.loading && (
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
      )}
    </>
  );
};

export default History;
