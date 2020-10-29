import React, { useState } from "react";
import Table from "../../../Table";
import { FormattedMessage, useIntl } from "react-intl";
import { formatDate } from "../../../../utils/format";
import { formatPrice } from "../../../../utils/formatters";
import "./ProfitSharingTable.scss";
import AccountingFilter from "../AccountingFilter";
import { Box } from "@material-ui/core";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").ProfitSharingBalanceEntry} ProfitSharingBalanceEntry
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableOptions} MUIDataTableOptions
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Array<ProfitSharingBalanceEntry>} data
 */

/**
 * Render profit sharing balance history table.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const ProfitSharingTable = ({ data }) => {
  const [filteredData, setData] = useState(data);
  const intl = useIntl();

  const types = [
    {
      label: intl.formatMessage({
        id: "profitsharing.types.withdraw",
      }),
      val: "withdraw",
    },
    {
      label: intl.formatMessage({
        id: "profitsharing.types.deposit",
      }),
      val: "deposit",
    },
    {
      label: intl.formatMessage({
        id: "profitsharing.types.pnl",
      }),
      val: "pnl",
    },
    {
      label: intl.formatMessage({
        id: "profitsharing.types.successFee",
      }),
      val: "successFee",
    },
    {
      label: intl.formatMessage({
        id: "profitsharing.types.all",
      }),
      val: "all",
    },
  ];

  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  let columns = [
    {
      name: "date",
      label: "col.date",
      options: {
        customBodyRender: (date) => formatDate(date, "YYYY/MM/DD"),
      },
    },
    {
      name: "type",
      label: "col.orders.type",
      options: {
        customBodyRender: (type) => {
          const typeOption = types.find((t) => t.val === type);
          return typeOption ? typeOption.label : type;
        },
      },
    },
    {
      name: "amount",
      label: "col.amount",
      options: {
        customBodyRender: (amount) => formatPrice(amount),
      },
    },
  ];

  /**
   * @type {MUIDataTableOptions}
   */
  const options = {
    sortOrder: {
      name: "date",
      direction: "desc",
    },
  };

  return (
    <div className="profitSharingTable">
      <Table
        columns={columns}
        data={filteredData}
        options={options}
        // persistKey={persistKey}
        title={
          <Box display="flex" alignItems="center">
            <FormattedMessage id="profitsharing.accounting" />
            <AccountingFilter data={data} onChange={(d) => setData(d)} types={types} />
          </Box>
        }
      />
    </div>
  );
};

export default ProfitSharingTable;
