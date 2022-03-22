import React from "react";
import { Box } from "@mui/material";
import { formatFloat } from "../../../utils/format";
import Table from "../../Table";
// import { formatNumber } from "../../../utils/formatters";

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
 * @property {'futuresDailyBalance'} persistKey Key to save display columns settings.
 * @property {Array<UserEquityEntity>} list
 * @property {Array<String>} quotes
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const FuturesHistoryTable = ({ title, persistKey, list, quotes }) => {
  let data = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // /**
  //  * Format Yes/No value.
  //  * @param {Number} val Val.
  //  * @returns {React.ReactNode} Formatted node.
  //  */
  // const renderPercentage = (val) => <span>{formatNumber(val, 2)}%</span>;

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
      name: "pnlUSDT",
      label: "col.dailyprofitlossUSDT",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "pnlBTC",
      label: "col.dailyprofitlossBTC",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "sumPnlUSDT",
      label: "col.cumprofitlossUSDT",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "sumPnlBTC",
      label: "col.cumprofitlossBTC",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "netTransferUSDT",
      label: "col.nettransferUSDT",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "netTransferBTC",
      label: "col.nettransferBTC",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "totalWalletUSDT",
      label: "col.walletbalanceUSDT",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "totalWalletBTC",
      label: "col.walletbalanceBTC",
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
    for (let i = 0; i < quotes.length; i++) {
      let obj = {
        name: "",
        label: { id: "", quote: "" },
        options: {
          customBodyRender: formatFloat,
        },
      };
      if (quotes[i] !== "ETH" && quotes[i] !== "BNB") {
        obj.name = "free" + quotes[i];
        obj.label.id = "col.freequote";
        obj.label.quote = quotes[i];
        /* @ts-ignore */
        columns.push(obj);
      }
    }
    for (let i = 0; i < quotes.length; i++) {
      let obj = {
        name: "",
        label: { id: "", quote: "" },
        options: {
          customBodyRender: formatFloat,
        },
      };

      obj.name = "locked" + quotes[i];
      obj.label.id = "col.lockedquote";
      obj.label.quote = quotes[i];
      /* @ts-ignore */
      columns.push(obj);
    }
  };

  dynamicColumns();

  return (
    <Box className="futuresHistoryTable" display="flex" flexDirection="column" width={1}>
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

export default FuturesHistoryTable;
