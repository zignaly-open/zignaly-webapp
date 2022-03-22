import React, { useEffect, useState } from "react";
import "./TotalEquity.scss";
import { Box, CircularProgress } from "@mui/material";
import TotalEquityGraph from "./TotalEquityGraph";
import TitleBar from "./TitleBar";
import EquityFilter from "./EquityFilter";
import EquityGraphLabels from "./GraphLabels";
import { isObject } from "lodash";
import { createEmptyUserEquityEntity } from "../../../services/tradeApiClient.types";

/**
 * @typedef {import("../../../services/tradeApiClient.types").DefaultDailyBalanceEntity} DefaultDailyBalanceEntity
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {Object} DefaultProps
 * @property {DefaultDailyBalanceEntity} dailyBalance Daily balance.
 * @property {ExchangeConnectionEntity} [selectedExchange]
 * @property {boolean} modal Flag to indicate if chart is displayed inside a modal.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const TotalEquity = ({ dailyBalance, modal, selectedExchange }) => {
  const [list, setList] = useState(dailyBalance.balances);
  const [balance, setBalance] = useState(createEmptyUserEquityEntity());

  const filterBalance = () => {
    let data = dailyBalance.balances.length
      ? dailyBalance.balances[dailyBalance.balances.length - 1]
      : createEmptyUserEquityEntity();
    setBalance(isObject(data) ? data : createEmptyUserEquityEntity());
  };

  useEffect(() => {
    setList(dailyBalance.balances);
    filterBalance();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyBalance.balances]);

  /**
   * @typedef {import("../../../store/initialState").UserEquityEntity} UserEquityEntity
   * @param {Array<UserEquityEntity>} data
   */

  const handleChange = (data) => {
    setList(data);
  };

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
            <TitleBar balance={balance} selectedExchange={selectedExchange} />
            {!modal && <EquityFilter list={dailyBalance.balances} onChange={handleChange} />}
          </Box>
          <Box width={1}>
            <TotalEquityGraph list={list} modal={modal} selectedExchange={selectedExchange} />
            <EquityGraphLabels list={list} />
          </Box>
          {modal && (
            <div className="modalFilter">
              <EquityFilter list={dailyBalance.balances} onChange={handleChange} />
            </div>
          )}
        </Box>
      )}
    </>
  );
};

export default TotalEquity;
