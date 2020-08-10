import React from "react";
import "./ContractsTable.scss";
import { Box } from "@material-ui/core";
import Table from "../../../../Table";
import { formatFloat } from "../../../../../utils/format";
import { Link } from "gatsby";

/**
 * @typedef {import("../../../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../../../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("../../../../../services/tradeApiClient.types").ExchangeContractsObject} ExchangeContractsObject
 * @typedef {import("@material-ui/core/styles").ThemeOptions} ThemeOptions
 * @typedef {import("@material-ui/core/styles").Theme} Theme
 * @typedef {import("../../../../../utils/composePositionsDataTable").DataTableContent} DataTableContent
 */

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {Array<ExchangeContractsObject>} list
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const ContractsTable = ({ title, list }) => {
  const tablePersistsKey = "contractsTable";

  /**
   * Compose all action buttons element for a given position.
   *
   * @param {String} positionId Position entity to compose buttons for.
   * @returns {JSX.Element} Composed JSX element.
   */
  function composePositionLinkButton(positionId) {
    return <Link to={`/position/${positionId}`}>{positionId}</Link>;
  }

  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  let columns = [
    {
      name: "positionId",
      label: "col.positionid",
      options: {
        customBodyRender: composePositionLinkButton,
      },
    },
    {
      name: "symbol",
      label: "col.orders.symbol",
    },
    {
      name: "amount",
      label: "col.amount",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "leverage",
      label: "col.leverage",
    },
    {
      name: "liquidationprice",
      label: "col.contracts.liquidationprice",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "side",
      label: "col.side",
    },
    {
      name: "entryprice",
      label: "col.entryprice",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "markprice",
      label: "col.contracts.markprice",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "margin",
      label: "col.contracts.margin",
    },
  ];

  return (
    <>
      <Box className="contractsTable" display="flex" flexDirection="column" width={1}>
        <Table columns={columns} data={list} persistKey={tablePersistsKey} title={title} />
      </Box>
    </>
  );
};

export default ContractsTable;
