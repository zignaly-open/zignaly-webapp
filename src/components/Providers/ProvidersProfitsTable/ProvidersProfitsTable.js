import React, { useMemo } from "react";
import "./ProvidersProfitsTable.scss";
import { Box } from "@material-ui/core";
import { MuiThemeProvider, useTheme } from "@material-ui/core/styles";
import { Link } from "gatsby";
import WinRate from "./WinRate";
import { formatFloat, formatFloat2Dec, formatTime } from "../../../utils/format";
import Table from "../../Table";
import ProviderLogo from "../../Provider/ProviderHeader/ProviderLogo";
import { merge } from "lodash";

/**
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("../../../services/tradeApiClient.types").ProvidersStatsCollection} ProvidersStatsCollection
 * @typedef {import("@material-ui/core/styles").ThemeOptions} ThemeOptions
 * @typedef {import("@material-ui/core/styles").Theme} Theme
 */

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {ProvidersStatsCollection} stats Table stats data.
 * @property {string} persistKey Key to save display columns settings.
 * @property {string} type Type of providers.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersProfitsTable = ({ stats, title, persistKey, type }) => {
  const theme = useTheme();

  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  let columns = [
    {
      name: "providerId",
      options: {
        display: "false",
        viewColumns: false,
      },
    },
    {
      name: "logoUrl",
      label: "col.provider.logo",
      options: {
        customBodyRender: (val, tableMeta) => {
          return <ProviderLogo size="30px" title={tableMeta.rowData[2]} url={val} />;
        },
        // setCellProps: (value) => ({
        //   className: "test",
        //   style: {
        //     textAlign: "center",
        //   },
        // }),
        setCellHeaderProps: () => ({ align: "center" }),
        setCellProps: () => ({ align: "center" }),
        viewColumns: false,
        sort: false,
      },
    },
    {
      name: "name",
      label: "col.name",
      options: {
        customBodyRender: (val, tableMeta) => (
          <Link
            to={`${type === "signalp" ? "/signalProviders" : "/copyTraders"}/${
              tableMeta.rowData[0]
            }`}
          >
            {val}
          </Link>
        ),
        viewColumns: false,
      },
    },
    {
      name: "percentageProfit",
      label: "col.profit.percentage",
      options: {
        customBodyRender: (val) => (
          <span className={parseFloat(val) >= 0 ? "green" : "red"}>{formatFloat2Dec(val)}%</span>
        ),
        sort: true,
      },
    },
    {
      name: "sumTotalProfit",
      label: "col.profit.total",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "sumTotalInvested",
      label: "col.invested.total",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "sumReturnOfInvestment",
      label: "col.investment.return",
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
      name: "avgAveragePositionSize",
      label: "col.position.size.avg",
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
      name: "minMinInvestment",
      label: "col.investment.min",
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
      name: "minMinReturnOfInvestment",
      label: "col.profit.min",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "maxMaxDCAProfit",
      label: "col.profit.max.fromDCA",
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
        customBodyRender: (val) => <WinRate val={parseFloat(val)} />,
      },
    },
    {
      name: "sumClosedPositions",
      label: "col.position.closed",
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
      name: "sumLosses",
      label: "col.positions.lost",
    },
    {
      name: "avgAverageClosingTime",
      label: "col.position.closingtime.avg",
      options: {
        customBodyRender: formatTime,
      },
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
      name: "sumDCAs",
      label: "col.dca.total",
    },
    {
      name: "avgAverageDCAsPerPosition",
      label: "col.position.dca.avg",
      options: {
        customBodyRender: formatFloat2Dec,
      },
    },
    {
      name: "sumDCAWins",
      label: "col.dca.won",
    },
    {
      name: "sumDCALosses",
      label: "col.dca.lost",
    },
    {
      name: "sumSoldBySignal",
      label: "col.exit.signal",
    },
    {
      name: "sumSoldByStopLoss",
      label: "col.exit.stoploss",
    },
    {
      name: "sumSoldByTTL",
      label: "col.exit.ttl",
    },
    {
      name: "sumSoldByTakeProfit",
      label: "col.exit.takeprofit",
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
      name: "avgI24hHigherPricePercentage",
      label: "col.price.timeuntilhigher.24hours",
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
      name: "avgI24hLowerBeforeHigherPricePercentage",
      label: "col.price.lowerbeforehigher.24hours",
      options: {
        customBodyRender: formatFloat,
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
      name: "avgI24hLowerPricePercentage",
      label: "col.price.lower.24hours",
      options: {
        customBodyRender: formatFloat,
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
      name: "avgI3dHigherPricePercentage",
      label: "col.price.timeuntilhigher.3days",
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
      name: "avgI3dLowerBeforeHigherPricePercentage",
      label: "col.price.lowerbeforehigher.3days",
      options: {
        customBodyRender: formatFloat,
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
      name: "avgI3dLowerPricePercentage",
      label: "col.price.lower.3days",
      options: {
        customBodyRender: formatFloat,
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
      name: "avgI1wSecondsUntilHigherPrice",
      label: "col.price.timeuntilhigher.1week",
      options: {
        customBodyRender: formatTime,
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
      name: "avgI1wSecondsUntilLowerBeforeHigherPrice",
      label: "col.price.untillower.1week",
      options: {
        customBodyRender: formatTime,
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
      name: "avgI1mSecondsUntilHigherPrice",
      label: "col.price.timeuntilhigher.1month",
      options: {
        customBodyRender: formatTime,
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
      name: "avgI1mSecondsUntilLowerBeforeHigherPrice",
      label: "col.price.untillower.1month",
      options: {
        customBodyRender: formatTime,
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
      name: "avgI1mSecondsUntilLowerPrice",
      label: "col.price.timeuntillower.1month",
      options: {
        customBodyRender: formatTime,
      },
    },
  ];

  const options = {
    sortOrder: { name: "percentageProfit", direction: "desc" },
  };

  /**
   * @param {ThemeOptions} theme Material UI theme options.
   * @returns {Theme} Theme overridden.
   */
  const extendedTheme = useMemo(
    () =>
      merge({}, theme, {
        overrides: {
          MUIDataTableHeadCell: {
            root: {
              // Don't wrap small headers and avoid wrapping long headers too much
              minWidth: "128px",
            },
          },
        },
      }),
    [theme],
  );

  return (
    <Box className="providersProfitsTable" display="flex" flexDirection="column" width={1}>
      <MuiThemeProvider theme={extendedTheme}>
        <Table
          columns={columns}
          data={stats}
          // @ts-ignore
          options={options}
          persistKey={persistKey}
          title={title}
        />
      </MuiThemeProvider>
    </Box>
  );
};

export default ProvidersProfitsTable;
