import React from "react";
import "./UsersTable.scss";
import { Box } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { formatFloat } from "../../../../utils/format";
import Table from "../../../Table";

/**]
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
const ProvidersProfitsTable = ({ title, persistKey, list }) => {
  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */

  let columns = [
    {
      name: "email",
      label: "col.email",
      options: {
        display: "true",
        viewColumns: true,
      },
    },
  ];


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
