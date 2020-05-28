import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ProvidersProfitsTable.scss";
import { Box } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import { FormattedMessage, useIntl } from "react-intl";
import MUIDataTable from "mui-datatables";
import { setDisplayColumn } from "../../../store/actions/settings";
import { Link } from "gatsby";
import WinRate from "./WinRate";
import { formatFloat, formatFloat2Dec, formatTime } from "../../../utils/format";

/**
 * @typedef {import("../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableOptions} MUIDataTableOptions
 */

const ProvidersProfitsTable = () => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSessionType} Store session data.
   */
  const selectStoreSession = (state) => state.session;
  const storeSession = useSelector(selectStoreSession);
  const selectStoreSettings = (state) => state.settings;
  const storeSettings = useSelector(selectStoreSettings);
  const [stats, setStats] = useState([]);
  const intl = useIntl();
  const dispatch = useDispatch();

  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  const columns = [
    {
      name: "providerId",
      options: {
        display: false,
        viewColumns: false,
      },
    },
    {
      name: "name",
      label: "col.name",
      options: {
        customBodyRender: (val, tableMeta) => (
          <Link to={"/signalProviders/" + tableMeta.rowData[0]}>{val}</Link>
        ),
        viewColumns: false,
      },
    },
    {
      name: "percentageProfit",
      label: "col.profit.percentage",
      options: {
        customBodyRender: (val) => (
          <span className={val >= 0 ? "green" : "red"}>{formatFloat2Dec(val)}%</span>
        ),
        sort: true,
        sortDirection: "desc",
      },
    },
    {
      name: "signals",
      label: "col.totalsignals",
    },
    {
      name: "sumPositions",
      label: "col.positions.total",
    },
    {
      name: "winRate",
      label: "col.winrate",
      options: {
        customBodyRender: (val) => <WinRate val={val} />,
      },
    },
    {
      name: "sumClosedPositions",
      label: "col.position.closed",
    },
    {
      name: "avgAverageClosingTime",
      label: "col.position.closingtime.avg",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "sumSoldBySignal",
      label: "col.soldbysignal",
    },
    {
      name: "sumSoldByStopLoss",
      label: "col.soldbystop",
    },
    {
      name: "sumSoldByTakeProfit",
      label: "col.soldbytake",
    },
    {
      name: "sumSoldByTTL",
      label: "col.exit.ttl",
    },
    {
      name: "sumSoldByTrailingStop",
      label: "col.exit.trailing",
    },
    {
      name: "sumSoldManually",
      label: "col.exit.manually",
    },
    {
      name: "sumSoldByOther",
      label: "col.exit.other",
    },
    {
      name: "maxMaxDCAProfit",
      label: "col.profit.max.fromDCA",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "maxMaxInvestment",
      label: "col.investment.max",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "maxMaxReturnOfInvestment",
      label: "col.profit.max",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "minMinDCAProfit",
      label: "col.profit.min.fromDCA",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "minMinInvestment",
      label: "col.investment.min",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "minMinReturnOfInvestment",
      label: "col.profit.min",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "sumDCALosses",
      label: "col.dca.lost",
    },
    {
      name: "sumDCAWins",
      label: "col.dca.won",
    },
    {
      name: "sumDCAs",
      label: "col.dca.total",
    },
    {
      name: "sumLosses",
      label: "col.positions.lost",
    },
    {
      name: "sumTotalInvested",
      label: "col.invested.total",
      customBodyRender: formatFloat,
    },
    {
      name: "sumTotalProfit",
      label: "col.profit.total",
    },
    {
      name: "sumUnclosedPositions",
      label: "col.positions.stillopened",
    },
    {
      name: "sumWins",
      label: "col.positions.won",
    },
    {
      name: "maxSlowerClosedPositionInSeconds",
      label: "col.time.closing.slow",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "minFasterClosedPositionInSeconds",
      label: "col.time.closing.fast",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgAverageClosingTime",
      label: "col.time.closing.average",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgAverageDCAsPerPosition",
      label: "col.position.dca.avg",
    },
    {
      name: "avgAveragePositionSize",
      label: "col.position.size.avg",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgAverageProfit",
      label: "col.position.profit.avg",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgAverageProfitPercentage",
      label: "col.position.profit.avgpercentage",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI24hHigherPricePercentage",
      label: "col.price.timeuntilhigher.24hours",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI24hLowerBeforeHigherPricePercentage",
      label: "col.price.lowerbeforehigher.24hours",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI24hLowerPricePercentage",
      label: "col.price.lower.24hours",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI24hSecondsUntilHigherPrice",
      label: "col.price.timeuntilhigher.24hours",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI24hSecondsUntilLowerBeforeHigherPrice",
      label: "col.price.untillower.24hours",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI24hSecondsUntilLowerPrice",
      label: "col.price.timeuntillower.24hours",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI24hLowerBeforeHigherPricePercentage",
      label: "col.price.lowerbeforehigher.24hours",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI3dHigherPricePercentage",
      label: "col.price.timeuntilhigher.3days",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI3dLowerBeforeHigherPricePercentage",
      label: "col.price.lowerbeforehigher.3days",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI3dLowerPricePercentage",
      label: "col.price.lower.3days",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI3dSecondsUntilHigherPrice",
      label: "col.price.timeuntilhigher.3days",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI3dSecondsUntilLowerBeforeHigherPrice",
      label: "col.price.untillower.3days",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI3dSecondsUntilLowerPrice",
      label: "col.price.timeuntillower.3days",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI1wHigherPricePercentage",
      label: "col.price.timeuntilhigher.1week",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI1wLowerBeforeHigherPricePercentage",
      label: "col.price.lowerbeforehigher.1week",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI1wLowerPricePercentage",
      label: "col.price.lower.1week",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI1wSecondsUntilHigherPrice",
      label: "col.price.timeuntilhigher.1week",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI1wSecondsUntilLowerBeforeHigherPrice",
      label: "col.price.untillower.1week",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI1wSecondsUntilLowerPrice",
      label: "col.price.timeuntillower.1week",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI1mHigherPricePercentage",
      label: "col.price.higher.1month",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI1mLowerBeforeHigherPricePercentage",
      label: "col.price.lowerbeforehigher.1month",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI1mLowerPricePercentage",
      label: "col.price.lower.1month",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "avgI1mSecondsUntilHigherPrice",
      label: "col.price.timeuntilhigher.1month",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI1mSecondsUntilLowerBeforeHigherPrice",
      label: "col.price.untillower.1month",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI1mSecondsUntilLowerPrice",
      label: "col.price.timeuntillower.1month",
      options: {
        customBodyRender: formatTime,
      },
    },
  ].map((c) => ({
    ...c,
    label: c.label ? intl.formatMessage({ id: c.label }) : "",
    options: {
      ...c.options,
      sort: !!(c.options && c.options.sort),
      display: storeSettings.displayColumns.spAnalytics.includes(c.name),
    },
  }));

  /**
   * Handle column display toggle settings.
   *
   * @type {MUIDataTableOptions["onColumnViewChange"]} updateDisplayColumnSettings
   */
  const updateDisplayColumnSettings = (changedColumn, action) => {
    dispatch(setDisplayColumn({ table: "spAnalytics", changedColumn, action }));
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(stats);

  /**
   * @type {MUIDataTableOptions}
   */
  const options = {
    selectableRows: "none",
    responsive: "stacked",
    filter: false,
    search: false,
    print: false,
    onColumnViewChange: updateDisplayColumnSettings,
  };

  return (
    <Box className="ProvidersProfitsTable" display="flex" flexDirection="column" width={1}>
      <MUIDataTable
        columns={columns}
        data={stats}
        options={options}
        title={<FormattedMessage id="copyt.performance" />}
      />
    </Box>
  );
};

export default ProvidersProfitsTable;
