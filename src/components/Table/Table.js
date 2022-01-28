import React, { useMemo, useState } from "react";
import { size } from "lodash";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import "./Table.scss";
import MUIDataTable from "mui-datatables";
import {
  setDisplayColumn,
  setRowsPerPage,
  setSortColumn,
  setResponsiveTable,
} from "../../store/actions/settings";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import { Box, Hidden, IconButton, Tooltip, Typography } from "@material-ui/core";
import { MuiThemeProvider, useTheme } from "@material-ui/core/styles";
import { merge } from "lodash";
import TableChartIcon from "@material-ui/icons/TableChart";
import FilterListIcon from "@material-ui/icons/FilterList";

/**
 * @typedef {import("../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../store/initialState").DefaultStateSettings} DefaultStateSettings
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableOptions} MUIDataTableOptions
 * @typedef {MUIDataTableOptions["onColumnViewChange"]} OnColumnViewChange
 * @typedef {import("@material-ui/core/styles").ThemeOptions} ThemeOptions
 * @typedef {import("@material-ui/core/styles").Theme} Theme
 */

/**
 * @typedef {Object} TablePaginationOptions
 * @property {Number} total
 * @property {function(number): void} onRowsPerPageChange
 * @property {function(string, string): void} onColumnSortChange
 * @property {function(number): void} onPageChange
 */

/**
 * Provides a table.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {Array<MUIDataTableColumn>} columns Table Columns.
 * @property {Array<Object>} data Table Data.
 * @property {string} [persistKey] Key to save display columns settings.
 * @property {MUIDataTableOptions} [options] Table options.
 * @property {*} [components] Custom table components.
 * @property {Function} [toggleFilters] Custom table components.
 * @property {number} [modifiedFiltersCount] Modified Filters count.
 * @property {TablePaginationOptions} [paginationOptions] paginationOptions
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 *
 */
const Table = ({
  columns,
  data,
  persistKey,
  title,
  options: customOptions,
  components,
  toggleFilters,
  modifiedFiltersCount,
  paginationOptions,
}) => {
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();
  const intl = useIntl();
  const countRows = size(data);
  const theme = useTheme();

  const defaultReponsive =
    storeSettings.responsiveTables[persistKey] === undefined
      ? // by default responsive if more than 3 columns
        columns.length > 4
      : storeSettings.responsiveTables[persistKey];
  const [responsive, setResponsive] = useState(defaultReponsive);

  /**
   * Function to create column labels.
   *
   * @param {*} label initial data for label.
   * @returns {String} formatted label.
   */
  const createLabel = (label) => {
    if (label) {
      if (typeof label === "string") {
        return intl.formatMessage({ id: label });
      }
      if (typeof label === "object") {
        return intl.formatMessage({ id: label.id }, { quote: label.quote });
      }
    }
    return "";
  };

  /**
   * @type {Array<MUIDataTableColumn>}
   */
  let columnsCustom = columns.map((c) => ({
    ...c,
    // Translate labels
    label: createLabel(c.label),
    options: {
      ...c.options,
      // Display columns picked by the user
      display:
        (c.options
          ? "display" in c.options
            ? c.options.display !== "excluded"
              ? c.options.display
              : false
            : true
          : true) &&
        ((c.options && c.options.viewColumns === false) ||
          !persistKey ||
          (storeSettings.displayColumns[persistKey] &&
            (storeSettings.displayColumns[persistKey].includes(c.name) ||
              storeSettings.displayColumns[persistKey].includes(c.label))))
          ? "true"
          : "false",
    },
  }));

  /**
   * @type {MUIDataTableOptions}
   */
  let options = {
    selectableRows: "none",
    customToolbar: () => {
      return (
        <Hidden smUp>
          <Tooltip placement="bottom" title="Change View">
            <IconButton onClick={changeResponsiveView}>
              <TableChartIcon />
            </IconButton>
          </Tooltip>
          {toggleFilters && (
            <IconButton onClick={() => toggleFilters()}>
              <FilterListIcon />
              {modifiedFiltersCount > 0 && (
                <Typography className="modified" variant="subtitle1">
                  {modifiedFiltersCount}
                </Typography>
              )}
            </IconButton>
          )}
        </Hidden>
      );
    },
    filter: false,
    search: false,
    print: false,
    sort: true,
    pagination: Boolean(paginationOptions) || countRows > 10,
    rowsPerPageOptions: [10, 25, 50, 100],
    rowsPerPage: (persistKey && storeSettings.rowsPerPage[persistKey]) || 10,
    onChangeRowsPerPage: (numberOfRows) => {
      if (persistKey) {
        dispatch(setRowsPerPage({ numberOfRows, table: persistKey }));
      }
      if (paginationOptions) {
        paginationOptions.onRowsPerPageChange(numberOfRows);
      }
    },
    onColumnViewChange: (changedColumn, action) => {
      if (persistKey) {
        dispatch(
          setDisplayColumn({
            table: persistKey,
            changedColumn,
            action,
          }),
        );
      }
    },
    onColumnSortChange: (changedColumn, direction) => {
      if (persistKey) {
        dispatch(
          setSortColumn({
            table: persistKey,
            name: changedColumn,
            direction,
          }),
        );
      }
      if (paginationOptions) {
        paginationOptions.onColumnSortChange(changedColumn, direction);
      }
    },
    fixedHeader: true,
    textLabels: {
      body: {
        noMatch: intl.formatMessage({ id: "table.body.noMatch" }),
      },
      pagination: {
        next: intl.formatMessage({ id: "table.pagination.next" }),
        previous: intl.formatMessage({ id: "table.pagination.previous" }),
        rowsPerPage: intl.formatMessage({ id: "table.pagination.rowsPerPage" }),
        displayRows: intl.formatMessage({ id: "table.pagination.displayRows" }),
      },
      viewColumns: {
        title: intl.formatMessage({ id: "table.viewColumns.title" }),
        titleAria: intl.formatMessage({ id: "table.viewColumns.titleAria" }),
      },
    },
    customSort: (_data, colIndex, order) => {
      return _data.sort((a, b) => {
        const aVal = a.data[colIndex];
        const bVal = b.data[colIndex];
        // Handle numeric string comparison.
        const res =
          typeof aVal === "string"
            ? aVal.localeCompare(bVal, undefined, {
                numeric: true,
                sensitivity: "base",
              })
            : aVal - bVal;
        return order === "asc" ? res : -res;
      });
    },
    elevation: 1,
    // Override options with the ones passed to Table component
    ...customOptions,
    // Override sort order with the last saved option
    ...(storeSettings.sortColumns[persistKey] && {
      sortOrder: storeSettings.sortColumns[persistKey],
    }),
    responsive: responsive ? "vertical" : "standard",
    // Server side pagination
    ...(paginationOptions && {
      count: paginationOptions.total,
      serverSide: true,
      onTableChange: (action, tableState) => {
        if (action === "changePage") {
          paginationOptions.onPageChange(tableState.page);
        }
      },
    }),
  };

  const changeResponsiveView = () => {
    setResponsive(!responsive);
    if (persistKey) {
      dispatch(setResponsiveTable({ table: persistKey, responsive: !responsive }));
    }
  };

  /**
   * Customizing styling here to avoid lint warning camelCase class-name-format
   * @param {ThemeOptions} theme Material UI theme options.
   * @returns {Theme} Theme overridden.
   */
  const extendedTheme = useMemo(
    () =>
      merge({}, theme, {
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
              fontWeight: 600,
              lineHeight: 1.31,
              letterSpacing: "0.61px",
            },
          },
          MUIDataTableHeadCell: {
            root: {
              // footnote
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              opacity: "0.6",
              lineHeight: 1.45,
              letterSpacing: "0.42px",
              //   minWidth: "100px",
              padding: "12px",
            },
          },
          MUIDataTableBodyCell: {
            stackedParent: {
              padding: 0,
            },
            stackedCommon: {
              fontSize: "14px",
              fontWeight: 600,
              minWidth: "80px",
              padding: "12px",
              whiteSpace: "nowrap",
              [theme.breakpoints.down("sm")]: {
                height: "auto",
                textAlign: "left",
                whiteSpace: "normal",
                padding: "5px",
                fontSize: "14px",
              },
            },
          },
          MUIDataTablePagination: {
            root: {
              [theme.breakpoints.down("sm")]: {
                "&:last-child": {
                  paddingLeft: 0,
                },
              },
            },
            toolbar: {
              [theme.breakpoints.down("sm")]: {
                paddingLeft: 0,
              },
            },
          },
        },
      }),
    [theme],
  );

  return (
    <Box className="customTable">
      <MuiThemeProvider theme={extendedTheme}>
        <MUIDataTable
          columns={columnsCustom}
          components={components}
          data={data}
          options={options}
          title={title}
        />
      </MuiThemeProvider>
    </Box>
  );
};

export default Table;
