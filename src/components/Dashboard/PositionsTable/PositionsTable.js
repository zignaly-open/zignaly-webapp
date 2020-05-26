import React, { useEffect, useState } from "react";
import "./PositionsTable.scss";
import { Box, Table } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import PositionsTableHead from "./PositionsTableHead";
import PositionsTableBody from "./PositionsTableBody";
import { useSelector } from "react-redux";

/**
 * @typedef {import("../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../store/initialState").DefaultStateSession} StateSessionType
 */

const PositionsTable = () => {
  const [positions, setPositions] = useState([]);
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSessionType} Store session data.
   */
  const selectStoreSession = (state) => state.session;
  const storeSession = useSelector(selectStoreSession);
  const fetchOpenPositions = async () => {
    try {
      const payload = {
        token: storeSession.tradeApi.accessToken,
      };

      return await tradeApi.openPositionsGet(payload);
    } catch (e) {
      alert(`ERROR: ${e.message}`);
    }
  };

  const loadData = () => {
    fetchOpenPositions().then((fetchData) => {
      setPositions(fetchData);
    });
  };

  useEffect(loadData, [storeSession.tradeApi.accessToken]);

  /**
   * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
   * @type {UserPositionsCollection} positionsCollection
   */

  return (
    <Box
      alignItems="center"
      className="positionsTable"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box
        className="tableBox hideScroll"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <Table className="table">
          <PositionsTableHead />
          <PositionsTableBody positions={positions} />
        </Table>
      </Box>
    </Box>
  );
};

export default PositionsTable;
