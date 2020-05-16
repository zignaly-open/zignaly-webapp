import React, { useEffect, useState } from "react";
import "./PositionsTable.scss";
import { Box, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import * as TradeApiTypes from "../../../services/tradeApiClient.types";

const PositionsTable = (props) => {
  const [positions, setPositions] = useState([]);
  const authenticateUser = async () => {
    const loginPayload = {
      email: "mailxuftg1pxzk@example.test",
      password: "abracadabra",
    };

    return await tradeApi.userLogin(loginPayload);
  };

  const loadPositions = async () => {
    const userEntity = await authenticateUser();
    const sessionPayload = {
      token: userEntity.token,
    };

    const positions = await tradeApi.openPositionsGet(sessionPayload);
    setPositions(positions);
  };

  useEffect(() => {
    loadPositions();
  }, []);

  /**
   * @type {TradeApiTypes.UserPositionsCollection} positionsCollection
   */
  const positionsCollection = positions;

  return (
    <Box
      className="positionsTable"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box className="tableBox" display="flex" flexDirection="row" justifyContent="center">
        <Table className="table">
          <TableHead className="head">
            <TableRow className="row">
              <TableCell align="left" className="cell">
                Time
              </TableCell>
              <TableCell align="left" className="cell">
                Type
              </TableCell>
              <TableCell align="left" className="cell">
                Pair
              </TableCell>
              <TableCell align="left" className="cell">
                Trader
              </TableCell>
              <TableCell align="left" className="cell">
                Invested
              </TableCell>
              <TableCell align="left" className="cell">
                Entry Price
              </TableCell>
              <TableCell align="left" className="cell">
                Current Price
              </TableCell>
              <TableCell align="left" className="cell">
                P/L %
              </TableCell>
              <TableCell align="left" className="cell">
                P/L #
              </TableCell>
              <TableCell align="left" className="cell">
                Net Profit
              </TableCell>
              <TableCell align="left" className="cell">
                Risk
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="body">
            {positionsCollection.map((position) => (
              <TableRow key={position.positionId} className="row">
                <TableCell align="left" className="cell">
                  {position.openDate}
                </TableCell>
                <TableCell align="left" className="cell">
                  {position.side}
                </TableCell>
                <TableCell align="left" className="cell">
                  {"data"}
                </TableCell>
                <TableCell align="left" className="cell">
                  {"data"}
                </TableCell>
                <TableCell align="left" className="cell">
                  {"time"}
                </TableCell>
                <TableCell align="left" className="cell">
                  {"data"}
                </TableCell>
                <TableCell align="left" className="cell">
                  {"data"}
                </TableCell>
                <TableCell align="left" className="cell">
                  {"data"}
                </TableCell>
                <TableCell align="left" className="cell">
                  {"time"}
                </TableCell>
                <TableCell align="left" className="cell">
                  {"data"}
                </TableCell>
                <TableCell align="left" className="cell">
                  {"time"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default PositionsTable;
