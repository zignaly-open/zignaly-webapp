import React from "react";
import "./CoinsTable.scss";
import { Box } from "@material-ui/core";
import { formatFloat } from "../../../../utils/format";
import Table from "../../../Table";

/**
 * @typedef {import("../../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("../../../../services/tradeApiClient.types").UserExchangeAssetObject} UserExchangeAssetObject
 * @typedef {import("@material-ui/core/styles").ThemeOptions} ThemeOptions
 * @typedef {import("@material-ui/core/styles").Theme} Theme
 */

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {string} persistKey Key to save display columns settings.
 * @property {Array<UserExchangeAssetObject>} list
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const CoinsTable = ({ title, persistKey, list }) => {
  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  let columns = [
    {
      name: "coin",
      label: "col.coins.coin",
    },
    {
      name: "name",
      label: "col.coins.name",
    },
    {
      name: "balanceTotal",
      label: "col.coins.total",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "balanceFree",
      label: "col.coins.available",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "balanceLocked",
      label: "col.coins.locked",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "balanceTotalBTC",
      label: "col.coins.btcvalue",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "balanceTotalUSDT",
      label: "col.coins.usdtvalue",
      options: {
        customBodyRender: formatFloat,
      },
    },
  ];

  return (
    <Box className="coinsTable" display="flex" flexDirection="column" width={1}>
      <Table columns={columns} data={list} persistKey={persistKey} title={title} />
    </Box>
  );
};

export default CoinsTable;
