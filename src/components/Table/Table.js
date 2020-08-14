import React, { useMemo, useState, useEffect } from "react";
import { size } from "lodash";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import "./Table.scss";
import MUIDataTable from "mui-datatables";
import { setDisplayColumn, setRowsPerPage } from "../../store/actions/settings";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import { Box, Hidden, IconButton, Tooltip } from "@material-ui/core";
import { MuiThemeProvider, useTheme } from "@material-ui/core/styles";
import { merge } from "lodash";
import TableChartIcon from "@material-ui/icons/TableChart";

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
 * Provides a table.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {Array<MUIDataTableColumn>} columns Table Columns.
 * @property {Array<Object>} data Table Data.
 * @property {string} [persistKey] Key to save display columns settings.
 * @property {MUIDataTableOptions} [options] Table options.
 * @property {*} [components] Custom table components.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 *
 */
const Table = ({ columns, data, persistKey, title, options: customOptions, components }) => {
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();
  const intl = useIntl();
  const countRows = size(data);
  const theme = useTheme();

  /**
   * Functionn to create column labels.
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
    } else {
      return "";
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
        (c.options && c.options.display) ||
        ((c.options && c.options.viewColumns === false) ||
        (persistKey &&
          storeSettings.displayColumns[persistKey] &&
          (storeSettings.displayColumns[persistKey].includes(c.name) ||
            storeSettings.displayColumns[persistKey].includes(c.label)))
          ? "true"
          : "false"),
    },
  }));

  /**
   * @type {MUIDataTableOptions}
   */
  let options = {
    selectableRows: "none", // @ts-ignore
    responsive: "vertical", // vertical
    customToolbar: () => {
      return (
        <Hidden smUp>
          <Tooltip placement="bottom" title="Change View">
            <IconButton onClick={changeResponsiveView}>
              <TableChartIcon />
            </IconButton>
          </Tooltip>
        </Hidden>
      );
    },
    filter: false,
    search: false,
    print: false,
    sort: true,
    pagination: countRows > 10,
    rowsPerPageOptions: [10, 25, 50, 100],
    rowsPerPage: (persistKey && storeSettings.rowsPerPage[persistKey]) || 10,
    onChangeRowsPerPage: (numberOfRows) => {
      if (persistKey) {
        dispatch(setRowsPerPage({ numberOfRows, table: persistKey }));
      }
    },
    // onViewColumnsChange
    onColumnViewChange: (changedColumn, action) => {
      dispatch(
        setDisplayColumn({
          table: persistKey,
          changedColumn,
          action,
        }),
      );
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
    ...customOptions,
  };

  const [tableOptions, setOptions] = useState(options);

  const initOptions = () => {
    setOptions({ ...tableOptions, ...customOptions });
  };

  useEffect(initOptions, [customOptions]);

  const changeResponsiveView = () => {
    // @ts-ignore
    if (options.responsive === "vertical") {
      // @ts-ignore
      options = { ...tableOptions, responsive: "standard" };
      setOptions(options);
    } else {
      // @ts-ignore
      options = { ...tableOptions, responsive: "vertical" };
      setOptions(options);
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
          // @ts-ignore (wait for datatables types v3)
          components={components}
          data={data}
          options={tableOptions}
          title={title}
        />
      </MuiThemeProvider>
    </Box>
  );
};

export default React.memo(Table);
