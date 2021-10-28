import React from "react";
import { Box } from "@material-ui/core";
import { formatFloat2Dec } from "../../../../../utils/format";
import Table from "../../../../Table";
import ExchangeIcon from "../../../../ExchangeIcon";

/**
 * @typedef {import("../../../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../../../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("mui-datatables").MUIDataTableOptions} MUIDataTableOptions
 * @typedef {import("../../../../../services/tradeApiClient.types").ProfileProviderStatsSignalsObject} ProfileProviderStatsSignalsObject
 * @typedef {import("@material-ui/core/styles").ThemeOptions} ThemeOptions
 * @typedef {import("@material-ui/core/styles").Theme} Theme
 */

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {string} persistKey Key to save display columns settings.
 * @property {Array<ProfileProviderStatsSignalsObject>} list
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const StatsTable = ({ title, persistKey, list }) => {
  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  let columns = [
    {
      name: "dateReadable",
      label: "col.stats.date",
    },
    {
      name: "pair",
      label: "col.stats.pair",
    },
    {
      name: "exchange",
      label: "col.stats.exchange",
      options: {
        customBodyRender: (val) => {
          return <ExchangeIcon exchange={val.toLowerCase()} size="medium" />;
        },
      },
    },
    {
      name: "i24HighPercentage",
      label: "col.stats.24H",
      options: {
        customBodyRender: (val) => {
          return `${formatFloat2Dec(val)}%`;
        },
      },
    },
    {
      name: "i24LowPercentage",
      label: "col.stats.24L",
      options: {
        customBodyRender: (val) => {
          return `${formatFloat2Dec(val)}%`;
        },
      },
    },
    {
      name: "i3DHighPercentage",
      label: "col.stats.3DH",
      options: {
        customBodyRender: (val) => {
          return `${formatFloat2Dec(val)}%`;
        },
      },
    },
    {
      name: "i3DLowPercentage",
      label: "col.stats.3DL",
      options: {
        customBodyRender: (val) => {
          return `${formatFloat2Dec(val)}%`;
        },
      },
    },
    {
      name: "iweekHighPercentage",
      label: "col.stats.1WH",
      options: {
        customBodyRender: (val) => {
          return `${formatFloat2Dec(val)}%`;
        },
      },
    },
    {
      name: "iweekLowPercentage",
      label: "col.stats.1WL",
      options: {
        customBodyRender: (val) => {
          return `${formatFloat2Dec(val)}%`;
        },
      },
    },
    {
      name: "imonthHighPercentage",
      label: "col.stats.1MH",
      options: {
        customBodyRender: (val) => {
          return `${formatFloat2Dec(val)}%`;
        },
      },
    },
    {
      name: "imonthLowPercentage",
      label: "col.stats.1ML",
      options: {
        customBodyRender: (val) => {
          return `${formatFloat2Dec(val)}%`;
        },
      },
    },
    {
      name: "i3MonthHighPercentage",
      label: "col.stats.3MH",
      options: {
        customBodyRender: (val) => {
          return `${formatFloat2Dec(val)}%`;
        },
      },
    },
    {
      name: "i3MonthLowPercentage",
      label: "col.stats.3ML",
      options: {
        customBodyRender: (val) => {
          return `${formatFloat2Dec(val)}%`;
        },
      },
    },
  ];

  /**
   * @type {MUIDataTableOptions}
   */
  const options = {
    sortOrder: {
      name: "balanceTotalBTC",
      direction: "desc",
    },
  };

  return (
    <Box className="statsTable" display="flex" flexDirection="column" width={1}>
      <Table
        columns={columns}
        data={list}
        options={options}
        persistKey={persistKey}
        title={title}
      />
    </Box>
  );
};

export default StatsTable;
