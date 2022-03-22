import React from "react";
import { Box } from "@mui/material";
import { formatFloat } from "../../../utils/format";
import Table from "../../Table";
import { formatNumber } from "../../../utils/formatters";

/**
 * @typedef {import("../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("mui-datatables").MUIDataTableOptions} MUIDataTableOptions
 * @typedef {import("../../../store/initialState").UserEquityEntity} UserEquityEntity
 */

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {'dailyBalance'} persistKey Key to save display columns settings.
 * @property {Array<UserEquityEntity>} list
 * @property {Array<String>} quotes
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const HistoryTable = ({ title, persistKey, list, quotes }) => {
  let data = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  /**
   * Format Yes/No value.
   * @param {Number} val Val.
   * @returns {React.ReactNode} Formatted node.
   */
  const renderPercentage = (val) => <span>{formatNumber(val, 2)}%</span>;
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
        customBodyRender: formatFloat,
      },
    },
    {
      name: "totalBTC",
      label: "col.totalBTC",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "totalFreeUSDT",
      label: "col.totalUSDTfree",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "totalFreeBTC",
      label: "col.totalBTCfree",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "totalLockedUSDT",
      label: "col.totalUSDTalloc",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "totalLockedBTC",
      label: "col.totalBTCalloc",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "availablePercentage",
      label: "col.availablePercentage",
      options: {
        customBodyRender: renderPercentage,
      },
    },
    {
      name: "investedPercentage",
      label: "col.investedPercentage",
      options: {
        customBodyRender: renderPercentage,
      },
    },
    {
      name: "freeBNB",
      /* @ts-ignore */
      label: { id: "col.freequote", quote: "BNB" },
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "freeETH",
      /* @ts-ignore */
      label: { id: "col.freequote", quote: "ETH" },
      options: {
        customBodyRender: formatFloat,
      },
    },
  ];

  /**
   * @type {MUIDataTableOptions}
   */
  const options = {
    sortOrder: { name: "date", direction: "desc" },
  };

  const dynamicColumns = () => {
    for (let a = 0; a < quotes.length; a++) {
      let obj = {
        name: "",
        label: { id: "", quote: "" },
        options: {
          customBodyRender: formatFloat,
        },
      };
      if (quotes[a] !== "ETH" && quotes[a] !== "BNB") {
        obj.name = "free" + quotes[a];
        obj.label.id = "col.freequote";
        /* @ts-ignore */
        obj.label.quote = quotes[a];
        /* @ts-ignore */
        columns.push(obj);
      }
    }
    for (let a = 0; a < quotes.length; a++) {
      let obj = {
        name: "",
        label: { id: "", quote: "" },
        options: {
          customBodyRender: formatFloat,
        },
      };

      obj.name = "locked" + quotes[a];
      obj.label.id = "col.lockedquote";
      /* @ts-ignore */
      obj.label.quote = quotes[a];
      /* @ts-ignore */
      columns.push(obj);
    }
  };

  dynamicColumns();

  return (
    <Box className="historyTable" display="flex" flexDirection="column" width={1}>
      <Table
        columns={columns}
        data={data}
        options={options}
        persistKey={persistKey}
        title={title}
      />
    </Box>
  );
};

export default HistoryTable;
