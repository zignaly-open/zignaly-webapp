import React, { useState, useEffect } from "react";
import "./History.scss";
import { Box } from "@material-ui/core";
import useStoreUserSelector from "../../../hooks/useStoreUserSelector";
import HistoryTable from "./HistoryTable";
import { FormattedMessage } from "react-intl";
import EquityFilter from "../TotalEquity/EquityFilter";

const History = () => {
  const [list, setList] = useState([]);
  const storeUser = useStoreUserSelector();

  useEffect(() => {
    setList(storeUser.dailyBalance.balances);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUser.dailyBalance]);

  /**
   *
   * @typedef {import("../../../store/initialState").UserEquityEntity} UserEquityEntity
   */

  /**
   *
   * @param {Array<UserEquityEntity>} data
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
        <EquityFilter list={storeUser.dailyBalance.balances} onChange={handleChange} />
      </Box>
      <HistoryTable
        list={list}
        persistKey="dailyBalance"
        title={<FormattedMessage id="dashboard.balance.historical" />}
      />
    </Box>
  );
};

export default History;
