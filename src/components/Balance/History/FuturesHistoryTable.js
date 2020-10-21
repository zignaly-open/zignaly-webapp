import React from "react";
import { Box } from "@material-ui/core";
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
      name: "totalUSDT",
      label: "col.dailyprofitloss",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "totalUSDT",
      label: "col.cumprofitloss",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "totalUSDT",
      label: "col.nettransfer",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "totalUSDT",
      label: "col.walletbalance",
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
    console.log(quotes);
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

  console.log(columns);

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
