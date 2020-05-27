import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./ProvidersProfitsTable.scss";
import { Box, Table, TableContainer, Paper } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import ProvidersProfitsTableHead from "./ProvidersProfitsTableHead";
import ProvidersProfitsTableBody from "./ProvidersProfitsTableBody";

/**
 * @typedef {import("../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../store/initialState").DefaultStateSession} StateSessionType
 */

/**
 * @typedef Column
 * @property {string} name
 * @property {string} id
 * @property {string} [parse]
 * @property {number} [digits]
 * @property {boolean} show
 * @property {boolean} [excludeFromShowHideColumn]
 */

/**
 * @type {Array<Column>}
 */
const columns = [
  { name: "name", id: "col.name", show: true, excludeFromShowHideColumn: true },
  {
    name: "percentageProfit",
    id: "col.protit-percentage",
    show: true,
    parse: "float",
    digits: 2,
  },
  { name: "signals", id: "col.totalsignals", show: true, parse: "int" },
  { name: "sumPositions", id: "col.positions.total", show: true, parse: "int" },
  {
    name: "winRate",
    id: "col.winrate",
    show: true,
    parse: "float",
    digits: 2,
  },
  { name: "sumClosedPositions", id: "col.position.closed", show: true, parse: "int" },
  { name: "avgAverageClosingTime", id: "col.averageclosing", show: true, parse: "time" },
  { name: "sumSoldBySignal", id: "col.soldbysignal", show: true, parse: "int" },
  { name: "sumSoldByStopLoss", id: "col.soldbystop", show: true, parse: "int" },
  { name: "sumSoldByTakeProfit", id: "col.soldbytake", show: true, parse: "int" },

  { name: "quote", id: "Quote", show: false, excludeFromShowHideColumn: true },
  {
    name: "maxMaxDCAProfit",
    id: "Max Profits from DCA",
    show: false,
    parse: "float",
    digits: false,
  },
  {
    name: "maxMaxInvestment",
    id: "Max Investment",
    show: false,
    parse: "float",
    digits: false,
  },
  {
    name: "maxMaxReturnOfInvestment",
    id: "Max Profit",
    show: false,
    parse: "float",
    digits: false,
  },
  {
    name: "maxSlowerClosedPositionInSeconds",
    id: "Slower Closing Time",
    show: false,
    parse: "time",
  },
  {
    name: "minFasterClosedPositionInSeconds",
    id: "Faster Closing Time",
    show: false,
    parse: "time",
  },
  {
    name: "minMinDCAProfit",
    id: "Min Profits from DCA",
    show: false,
    parse: "float",
    digits: false,
  },
  {
    name: "minMinInvestment",
    id: "Min Investment",
    show: false,
    parse: "float",
    digits: false,
  },
  {
    name: "minMinReturnOfInvestment",
    id: "Min Profit",
    show: false,
    parse: "float",
    digits: false,
  },
  { name: "sumDCALosses", id: "DCAs Lost", show: false, parse: "int" },
  { name: "sumDCAWins", id: "DCA Won", show: false, parse: "int" },
  { name: "sumDCAs", id: "Total DCAs", show: false, parse: "int" },
  { name: "sumLosses", id: "Positions Lost", show: false, parse: "int" },
  {
    name: "sumReturnOfInvestment",
    id: "Return of Investment",
    show: false,
    parse: "float",
    digits: false,
  },
  { name: "sumSoldByOther", id: "Exit by Other", show: false, parse: "int" },

  { name: "sumSoldByTTL", id: "Exit by TTL", show: false, parse: "int" },
  { name: "sumSoldByTrailingStop", id: "Exit by Trailing-Stop", show: false, parse: "int" },
  { name: "sumSoldManually", id: "Exit Manually", show: false, parse: "int" },
  {
    name: "sumTotalInvested",
    id: "Total Invested",
    show: false,
    parse: "float",
    digits: false,
  },
  { name: "sumTotalProfit", id: "Total Profits", show: false, parse: "float", digits: false },
  { name: "sumUnclosedPositions", id: "Positions Still Opened", show: false, parse: "int" },
  { name: "sumWins", id: "Positions Won", show: false, parse: "int" },
  { name: "avgAverageDCAsPerPosition", id: "Avg DCAs per Position", show: false, parse: "int" },
  {
    name: "avgAveragePositionSize",
    id: "Avg Position Size",
    show: false,
    parse: "float",
    digits: false,
  },
  {
    name: "avgAverageProfit",
    id: "Avg Profit per Position",
    show: false,
    parse: "float",
    digits: false,
  },
  {
    name: "avgAverageProfitPercentage",
    id: "Avg Profit per Position (%)",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI1m_higherPricePercentage",
    id: "Higher Price in 1m",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI1m_lowerBeforeHigherPricePercentage",
    id: "Lower Price Before Higher in 1m",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI1m_lowerPricePercentage",
    id: "Lower price in 1m",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI1m_secondsUntilHigherPrice",
    id: "Time Until Higher Price in 1m",
    show: false,
    parse: "time",
  },
  {
    name: "avgI1m_secondsUntilLowerBeforeHigherPrice",
    id: "Time Until Lower Price Before Higher in 1m",
    show: false,
    parse: "time",
  },
  {
    name: "avgI1m_secondsUntilLowerPrice",
    id: "Time Until Lower Price in 1m",
    show: false,
    parse: "time",
  },
  {
    name: "avgI1w_higherPricePercentage",
    id: "Higher Price in 1w",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI1w_lowerBeforeHigherPricePercentage",
    id: "Lower Price Before Higher in 1w",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI1w_lowerPricePercentage",
    id: "Lower price in 1w",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI1w_secondsUntilHigherPrice",
    id: "Time Until Higher Price in 1w",
    show: false,
    parse: "time",
  },
  {
    name: "avgI1w_secondsUntilLowerBeforeHigherPrice",
    id: "Time Until Lower Price Before Higher in 1w",
    show: false,
    parse: "time",
  },
  {
    name: "avgI1w_secondsUntilLowerPrice",
    id: "Time Until Lower Price in 1w",
    show: false,
    parse: "time",
  },
  {
    name: "avgI2w_higherPricePercentage",
    id: "Higher Price in 2w",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI2w_lowerBeforeHigherPricePercentage",
    id: "Lower Price Before Higher in 2w",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI2w_lowerPricePercentage",
    id: "Lower price in 2w",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI2w_secondsUntilHigherPrice",
    id: "Time Until Higher Price in 2w",
    show: false,
    parse: "time",
  },
  {
    name: "avgI2w_secondsUntilLowerBeforeHigherPrice",
    id: "Time Until Lower Price Before Higher in 2w",
    show: false,
    parse: "time",
  },
  {
    name: "avgI2w_secondsUntilLowerPrice",
    id: "Time Until Lower Price in 2w",
    show: false,
    parse: "time",
  },
  {
    name: "avgI3d_higherPricePercentage",
    id: "Higher Price in 3d",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI3d_lowerBeforeHigherPricePercentage",
    id: "Lower Price Before Higher in 3d",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI3d_lowerPricePercentage",
    id: "Lower price in 3d",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI3d_secondsUntilHigherPrice",
    id: "Time Until Higher Price in 3d",
    show: false,
    parse: "time",
  },
  {
    name: "avgI3d_secondsUntilLowerBeforeHigherPrice",
    id: "Time Until Lower Price Before Higher in 3d",
    show: false,
    parse: "time",
  },
  {
    name: "avgI3d_secondsUntilLowerPrice",
    id: "Time Until Lower Price in 3d",
    show: false,
    parse: "time",
  },
  {
    name: "avgI3m_higherPricePercentage",
    id: "Higher Price in 3m",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI3m_lowerBeforeHigherPricePercentage",
    id: "Lower Price Before Higher in 3m",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI3m_lowerPricePercentage",
    id: "Lower price in 3m",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI3m_secondsUntilHigherPrice",
    id: "Time Until Higher Price in 3m",
    show: false,
    parse: "time",
  },
  {
    name: "avgI3m_secondsUntilLowerBeforeHigherPrice",
    id: "Time Until Lower Price Before Higher in 3m",
    show: false,
    parse: "time",
  },
  {
    name: "avgI3m_secondsUntilLowerPrice",
    id: "Time Until Lower Price in 3m",
    show: false,
    parse: "time",
  },
  {
    name: "avgI24h_higherPricePercentage",
    id: "Higher Price in 24h",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI24h_lowerBeforeHigherPricePercentage",
    id: "Lower Price Before Higher in 24h",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI24h_lowerPricePercentage",
    id: "Lower price in 24h",
    show: false,
    parse: "float",
    digits: 2,
  },
  {
    name: "avgI24h_secondsUntilHigherPrice",
    id: "Time Until Higher Price in 24h",
    show: false,
    parse: "time",
  },
  {
    name: "avgI24h_secondsUntilLowerBeforeHigherPrice",
    id: "Time Until Lower Price Before Higher in 24h",
    show: false,
    parse: "time",
  },
  {
    name: "avgI24h_secondsUntilLowerPrice",
    id: "Time Until Lower Price in 24h",
    show: false,
    parse: "time",
  },
];

const ProvidersProfitsTable = () => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSessionType} Store session data.
   */
  const selectStoreSession = (state) => state.session;
  const storeSession = useSelector(selectStoreSession);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const loadProvidersStats = async () => {
      try {
        const payload = {
          token: storeSession.tradeApi.accessToken,
          ro: true,
          quote: "BTC",
          base: "all",
          timeFrame: "2months",
          DCAFilter: "withoutDCA",
        };
        const responseData = await tradeApi.providersStatsGet(payload);
        setStats(responseData);
      } catch (e) {
        // TODO: Display error in alert.
      }
    };

    loadProvidersStats();
  }, []);

  return (
    <Box className="ProvidersProfitsTable" display="flex" flexDirection="column" width={1}>
      <TableContainer component={Paper}>
        <Table className="table">
          <ProvidersProfitsTableHead columns={columns} />
          <ProvidersProfitsTableBody stats={stats} columns={columns} />
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProvidersProfitsTable;
