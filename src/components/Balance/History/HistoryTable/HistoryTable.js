import React from "react";
import "./HistoryTable.scss";
import { Box, createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { formatFloat } from "../../../../utils/format";
import Table from "../../../Table";

/**
 * @typedef {import("../../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("../../../../store/initialState").UserEquityEntity} UserEquityEntity
 */

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {'ctAnalytics'|'spAnalytics'|'dailyBalance'} persistKey Key to save display columns settings.
 * @property {Array<UserEquityEntity>} list
 * @property {Array<String>} quotes
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersProfitsTable = ({ title, persistKey, list, quotes }) => {
  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */

  let columns = [
    {
      name: "date",
      label: "col.date",
      options: {
        display: "true",
        viewColumns: true,
      },
    },
    {
      name: "totalUSDT",
      label: "col.totalUSDT",
      options: {
        display: "true",
        viewColumns: true,
        customBodyRender: formatFloat,
      },
    },
    {
      name: "totalBTC",
      label: "col.totalBTC",
      options: {
        display: "true",
        viewColumns: true,
        customBodyRender: formatFloat,
      },
    },
    {
      name: "freeUSDT",
      label: "col.totalUSDTfree",
      options: {
        display: "true",
        viewColumns: true,
        customBodyRender: formatFloat,
      },
    },
    {
      name: "freeBTC",
      label: "col.totalBTCfree",
      options: {
        display: "true",
        viewColumns: true,
        customBodyRender: formatFloat,
      },
    },
    {
      name: "lockedUSDT",
      label: "col.totalUSDTalloc",
      options: {
        display: "true",
        viewColumns: true,
        customBodyRender: formatFloat,
      },
    },
    {
      name: "lockedBTC",
      label: "col.totalBTCalloc",
      options: {
        display: "true",
        viewColumns: true,
        customBodyRender: formatFloat,
      },
    },
    {
      name: "freeBNB",
      label: "col.freeBNB",
    },
    {
      name: "freeETH",
      label: "col.freeETH",
    },
  ];

  const dynamicColumns = () => {
    for (let a = 0; a < quotes.length; a++) {
      let obj = { name: "", label: "" };
      if (quotes[a] !== "ETH" || quotes[a] !== "BNB") {
        obj.name = "free" + quotes[a];
        obj.label = "col.free" + quotes[a];
      }
      columns.push(obj);
    }
    for (let a = 0; a < quotes.length; a++) {
      let obj = { name: "", label: "" };
      if (quotes[a] !== "ETH" || quotes[a] !== "BNB") {
        obj.name = "locked" + quotes[a];
        obj.label = "col.locked" + quotes[a];
      }
      columns.push(obj);
    }
  };

  dynamicColumns();

  const getMuiTheme = () =>
    createMuiTheme({
      /**
       * @type {*}
       */
      overrides: {
        MUIDataTableHeadCell: {
          root: {
            // Don't wrap small headers and avoid wrapping long headers too much
            minWidth: "128px",
          },
        },
      },
    });

  return (
    <Box className="historyTable" display="flex" flexDirection="column" width={1}>
      <MuiThemeProvider theme={(outerTheme) => ({ ...getMuiTheme(), outerTheme })}>
        <Table columns={columns} data={list} persistKey={persistKey} title={title} />
      </MuiThemeProvider>
    </Box>
  );
};

export default ProvidersProfitsTable;
