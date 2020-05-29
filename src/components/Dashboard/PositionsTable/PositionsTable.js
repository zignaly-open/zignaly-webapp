import React, { useEffect, useState } from "react";
import "./PositionsTable.scss";
import { Box, Table } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import PositionsTableHead from "./PositionsTableHead";
import PositionsTableBody from "./PositionsTableBody";
import { useSelector } from "react-redux";
import useIterval from "use-interval";

/**
 * @typedef {import("../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../store/initialState").DefaultStateSession} StateSessionType
 */

/**
 * @typedef {"open" | "closed" | "log"} PositionTableType
 * @typedef {Object} PositionsTableProps
 * @property {PositionTableType} type
 */

/**
 * Component that display user positions in table view.
 *
 * @param {PositionsTableProps} props Component properties.
 * @returns {JSX.Element} Positions table element.
 */
const PositionsTable = (props) => {
  const { type } = props;
  const [positions, setPositions] = useState([]);
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSessionType} Store session data.
   */
  const selectStoreSession = (state) => state.session;
  const storeSession = useSelector(selectStoreSession);
  const fetchPositions = async () => {
    try {
      const payload = {
        token: storeSession.tradeApi.accessToken,
      };

      if (type === "closed") {
        return await tradeApi.closedPositionsGet(payload);
      }

      if (type === "log") {
        return await tradeApi.logPositionsGet(payload);
      }

      return await tradeApi.openPositionsGet(payload);
    } catch (e) {
      alert(`ERROR: ${e.message}`);
    }

    return [];
  };

  const loadData = () => {
    fetchPositions().then((fetchData) => {
      setPositions(fetchData);
    });
  };

  const updateData = () => {
    // Only open positions needs continuos updates.
    if (type === "open") {
      loadData();
    }
  };

  useEffect(loadData, [storeSession.tradeApi.accessToken]);
  useIterval(updateData, 5000);

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
          <PositionsTableHead type={type} />
          <PositionsTableBody positions={positions} type={type} />
        </Table>
      </Box>
    </Box>
  );
};

export default PositionsTable;
