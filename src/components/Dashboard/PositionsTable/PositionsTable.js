import React, { useEffect, useState } from "react";
import "./PositionsTable.scss";
import { Box, Table } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import PositionsTableHead from "./PositionsTableHead";
import PositionsTableBody from "./PositionsTableBody";

const PositionsTable = () => {
  const [positions, setPositions] = useState([]);
  const authenticateUser = async () => {
    const loginPayload = {
      email: "mailxuftg1pxzk@example.test",
      password: "abracadabra",
    };

    return await tradeApi.userLogin(loginPayload);
  };

  useEffect(() => {
    const loadPositions = async () => {
      try {
        const userEntity = await authenticateUser();
        const sessionPayload = {
          token: userEntity.token,
        };
        const responseData = await tradeApi.openPositionsGet(sessionPayload);
        setPositions(responseData);
      } catch (e) {
        // TODO: Display error in alert.
      }
    };

    loadPositions();
  }, []);

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
