import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import "./Table.scss";
import MUIDataTable from "mui-datatables";
import { setDisplayColumn } from "../../store/actions/settings";
import { Box, createMuiTheme, MuiThemeProvider } from "@material-ui/core";

/**
 * @typedef {import("../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../store/initialState").DefaultStateSettings} DefaultStateSettings
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableOptions} MUIDataTableOptions
 * @typedef {MUIDataTableOptions["onColumnViewChange"]} OnColumnViewChange
 */

/**
 * Provides a table.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {Array<MUIDataTableColumn>} columns Table Columns.
 * @property {Array<Object>} data Table Data.
 * @property {'ctAnalytics'|'spAnalytics'} persistKey Key to save display columns settings.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 *
 */
const Table = ({ columns, data, persistKey, title }) => {
  /**
   * Select store settings data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {DefaultStateSettings} Store settings data.
   */
  const selectStoreSettings = (state) => state.settings;
  const storeSettings = useSelector(selectStoreSettings);
  const dispatch = useDispatch();
  const intl = useIntl();

  /**
   * @type {Array<MUIDataTableColumn>}
   */
  let columnsCustom = columns.map((c) => ({
    ...c,
    // Translate labels
    label: c.label ? intl.formatMessage({ id: c.label }) : "",
    options: {
      ...c.options,
      sort: !!(c.options && c.options.sort),
      // Display columns picked by the user
      display:
        (c.options && c.options.display) ||
        ((c.options && c.options.viewColumns === false) ||
        storeSettings.displayColumns[persistKey].includes(c.name)
          ? "true"
          : "false"),
    },
  }));

  /**
   * @type {MUIDataTableOptions}
   */
  const options = {
    selectableRows: "none",
    responsive: "stacked",
    filter: false,
    search: false,
    print: false,
    onColumnViewChange: (changedColumn, action) => {
      dispatch(
        setDisplayColumn({
          table: persistKey,
          changedColumn,
          action,
        }),
      );
    },
    fixedHeaderOptions: {
      xAxis: true,
      yAxis: true,
    },
  };

  // Customizing styling here to avoid lint warning camelCase class-name-format
  const getMuiTheme = () =>
    createMuiTheme({
      /**
       * @type {*}
       */
      overrides: {
        MUIDataTableHeadRow: {
          root: {
            verticalAlign: "top",
          },
        },
        MUIDataTableToolbar: {
          root: {
            // body2
            fontSize: "16px",
            fontFamily: "PlexSans-SemiBold",
            lineHeight: 1.31,
            letterSpacing: "0.61px",
          },
        },
        MUIDataTableHeadCell: {
          root: {
            // footnote
            fontSize: "11px",
            fontFamily: "PlexSans-Bold",
            textTransform: "uppercase",
            opacity: "0.6",
            lineHeight: 1.45,
            letterSpacing: "0.42px",
            minWidth: "80px",
            maxWidth: "120px",
            padding: "12px",
            whiteSpace: "nowrap",
          },
        },
        MUIDataTableBodyCell: {
          root: {
            fontSize: "14px",
            fontFamily: "PlexSans-Medium",
            minWidth: "80px",
            padding: "12px",
            whiteSpace: "nowrap",
          },
        },
      },
    });

  return (
    <Box className="customTable">
      <MuiThemeProvider
        theme={(outerTheme) => ({
          ...getMuiTheme(),
          outerTheme,
        })}
      >
        <MUIDataTable columns={columnsCustom} data={data} options={options} title={title} />
      </MuiThemeProvider>
    </Box>
  );
};

export default Table;
