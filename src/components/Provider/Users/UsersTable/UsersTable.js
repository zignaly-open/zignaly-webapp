import React from "react";
import "./UsersTable.scss";
import { Box } from "@material-ui/core";
import Table from "../../../Table";

/** ]
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("../../../../store/initialState").UserEquityEntity} UserEquityEntity
 */

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {string} persistKey Key to save display columns settings.
 * @property {Array<UserEquityEntity>} list
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const UsersTable = ({ title, persistKey, list }) => {
  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */

  let columns = [
    {
      name: "email",
      label: "col.users.email",
    },
    {
      name: "name",
      label: "col.users.name",
    },
    {
      name: "active",
      label: "col.users.active",
      options: {
        customBodyRender: (val) => {
          return <span className={val ? "green" : "red"}> {val ? "TRUE" : "FALSE"}</span>;
        },
      },
    },
    {
      name: "connected",
      label: "col.users.connected",
      options: {
        display: "true",
        viewColumns: true,
        customBodyRender: (val) => {
          return <span className={val ? "green" : "red"}> {val ? "TRUE" : "FALSE"}</span>;
        },
      },
    },
    {
      name: "allocatedBalance",
      label: "col.users.allocatedbalance",
    },
    {
      name: "realExchangeConnected",
      label: "col.users.realexchange",
      options: {
        customBodyRender: (val) => {
          return <span className={val ? "green" : "red"}> {val ? "TRUE" : "FALSE"}</span>;
        },
      },
    },
    {
      name: "profitsFromClosedBalance",
      label: "col.users.profits",
    },
    {
      name: "suspended",
      label: "col.users.suspended",
      options: {
        customBodyRender: (val) => {
          return <span className={val ? "greed" : "red"}> {val ? "TRUE" : "FALSE"}</span>;
        },
      },
    },
    {
      name: "code",
      label: "col.users.code",
    },
    {
      name: "cancelDate",
      label: "col.users.canceldate",
    },
  ];

  return (
    <Box className="historyTable" display="flex" flexDirection="column" width={1}>
      <Table columns={columns} data={list} persistKey={persistKey} title={title} />
    </Box>
  );
};

export default UsersTable;
