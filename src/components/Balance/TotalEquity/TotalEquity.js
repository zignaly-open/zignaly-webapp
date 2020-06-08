import React, { useEffect, useState } from "react";
import "./TotalEquity.scss";
import { Box } from "@material-ui/core";
import TotalEquityGraph from "./TotalEquityGraph";
import TitleBar from "./TitleBar";
import EquityFilter from "./EquityFilter";
import useStoreUserSelector from "../../../hooks/useStoreUserSelector";
import EquityGraphLabels from "./EquityGraphLabels";

const TotalEquity = () => {
  const [list, setList] = useState([]);
  const storeUser = useStoreUserSelector();

  useEffect(() => {
    setList(storeUser.dailyBalance.balances);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUser.dailyBalance]);

  /**
   * @typedef {import("../../../store/initialState").UserEquityEntity} UserEquityEntity
   * @param {Array<UserEquityEntity>} data
   */

  const handleChange = (data) => {
    setList(data);
  };

  return (
    <Box
      alignItems="flex-start"
      className="totalEquity"
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
        <TitleBar />
        <EquityFilter list={storeUser.dailyBalance.balances} onChange={handleChange} />
      </Box>
      <TotalEquityGraph list={list} />
      <EquityGraphLabels list={list} />
    </Box>
  );
};

export default TotalEquity;
