import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ProvidersProfitsTable.scss";
import { Box } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import { FormattedMessage, useIntl } from "react-intl";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { setDisplayColumn } from "../../../store/actions/settings";
import { Link } from "gatsby";

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
   * Format string to float with 2 decimals.
   * @param {string} val
   */
  const formatFloat2D = (val) => parseFloat(val).toFixed(2);
  const formatFloatAuto = (val) => {
    const valueFloat = parseFloat(val);
    return valueFloat >= 1 || valueFloat <= -1 ? valueFloat.toFixed(2) : valueFloat.toFixed(8);
  };

  const formatTime = (val) => {
    let duration = moment.duration(parseInt(val, 10) * 1000);
    let durationStr = "";
    if (duration.asDays() >= 1) {
      durationStr = duration.asDays().toFixed(1);
      durationStr += duration.asDays() > 1 ? " days" : " day";
    } else if (duration.asHours() >> 1) {
      durationStr = duration.asHours().toFixed(1);
      durationStr += duration.asHours() > 1 ? " hours" : " hour";
    } else if (duration.asMinutes() >= 1) {
      durationStr = duration.asMinutes().toFixed(1);
      durationStr += duration.asMinutes() > 1 ? " minutes" : " minute";
    } else {
      durationStr = duration.asSeconds().toFixed(1);
      durationStr += duration.asSeconds() > 1 ? " seconds" : " second";
    }

    return durationStr;
  };

  /**
   * @type {Array<Column>}
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
        customBodyRender: (val, tableMeta, updateValue) => (
          <Link to={"/signalProviders/" + tableMeta.rowData[0]}>{val}</Link>
        ),
        viewColumns: false,
      },
    },
    {
      name: "percentageProfit",
      label: "col.profit.percentage",
      options: {
        customBodyRender: (val) => <span>{formatFloat2D(val)}%</span>,
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
        customBodyRender: (val) => <span>{formatFloat2D(val)}%</span>,
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
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "maxMaxInvestment",
      label: "col.investment.max",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "maxMaxReturnOfInvestment",
      label: "col.profit.max",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "minMinDCAProfit",
      label: "col.profit.min.fromDCA",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "minMinInvestment",
      label: "col.investment.min",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "minMinReturnOfInvestment",
      label: "col.profit.min",
      options: {
        customBodyRender: formatFloatAuto,
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
      customBodyRender: formatFloatAuto,
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
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgAverageProfit",
      label: "col.position.profit.avg",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgAverageProfitPercentage",
      label: "col.position.profit.avgpercentage",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avg24h_higherPricePercentage",
      label: "col.price.timeuntilhigher.24hours",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI24h_lowerBeforeHigherPricePercentage",
      label: "col.price.lowerbeforehigher.24hours",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI24h_lowerPricePercentage",
      label: "col.price.lower.24hours",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI24h_secondsUntilHigherPrice",
      label: "col.price.timeuntilhigher.24hours",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI24h_secondsUntilLowerBeforeHigherPrice",
      label: "col.price.untillower.24hours",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI24h_secondsUntilLowerPrice",
      label: "col.price.timeuntillower.24hours",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI24h_lowerBeforeHigherPricePercentage",
      label: "col.price.lowerbeforehigher.24hours",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI3d_higherPricePercentage",
      label: "col.price.timeuntilhigher.3days",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI3d_lowerBeforeHigherPricePercentage",
      label: "col.price.lowerbeforehigher.3days",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI3d_lowerPricePercentage",
      label: "col.price.lower.3days",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI3d_secondsUntilHigherPrice",
      label: "col.price.timeuntilhigher.3days",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI3d_secondsUntilLowerBeforeHigherPrice",
      label: "col.price.untillower.3days",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI3d_secondsUntilLowerPrice",
      label: "col.price.timeuntillower.3days",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI1w_higherPricePercentage",
      label: "col.price.timeuntilhigher.1week",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI1w_lowerBeforeHigherPricePercentage",
      label: "col.price.lowerbeforehigher.1week",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI1w_lowerPricePercentage",
      label: "col.price.lower.1week",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI1w_secondsUntilHigherPrice",
      label: "col.price.timeuntilhigher.1week",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI1w_secondsUntilLowerBeforeHigherPrice",
      label: "col.price.untillower.1week",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI1w_secondsUntilLowerPrice",
      label: "col.price.timeuntillower.1week",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI1m_higherPricePercentage",
      label: "col.price.higher.1month",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI1m_lowerBeforeHigherPricePercentage",
      label: "col.price.lowerbeforehigher.1month",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI1m_lowerPricePercentage",
      label: "col.price.lower.1month",
      options: {
        customBodyRender: formatFloatAuto,
      },
    },
    {
      name: "avgI1m_secondsUntilHigherPrice",
      label: "col.price.timeuntilhigher.1month",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI1m_secondsUntilLowerBeforeHigherPrice",
      label: "col.price.untillower.1month",
      options: {
        customBodyRender: formatTime,
      },
    },
    {
      name: "avgI1m_secondsUntilLowerPrice",
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
      sort: c.options && c.options.sort ? true : false,
      display: storeSettings.displayColumns["spAnalytics"].includes(c.name),
      //   customBodyRender: (value) => <Box display="flex">{value}</Box>,
    },
  }));

  console.log(columns);

  /**
   * Process data submitted in the login form.
   *
   * @param {LoginFormSubmission} payload Submission data.
   * @returns {Void} None.
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
  }, []);

  console.log(stats);

  const options = {
    selectableRows: "none",
    responsive: "stacked",
    filter: false,
    search: false,
    print: false,
    onColumnViewChange: updateDisplayColumnSettings,
    // customRowRender:
  };

  return (
    <Box className="ProvidersProfitsTable" display="flex" flexDirection="column" width={1}>
      <MUIDataTable
        title={<FormattedMessage id="copyt.performance" />}
        data={stats}
        columns={columns}
        options={options}
      />
    </Box>
  );
};

export default ProvidersProfitsTable;
