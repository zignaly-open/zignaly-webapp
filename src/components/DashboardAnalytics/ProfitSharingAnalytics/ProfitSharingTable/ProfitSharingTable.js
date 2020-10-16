import React from "react";
import Table from "../../../Table";
import { FormattedMessage } from "react-intl";
import { FormatedDateTime } from "../../../../utils/format";
import { capitalize } from "lodash";

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
  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  let columns = [
    {
      name: "type",
      label: "col.orders.type",
      options: {
        customBodyRender: capitalize,
      },
    },
    {
      name: "amount",
      label: "col.amount",
    },
    {
      name: "date",
      label: "col.date",
      options: {
        customBodyRender: FormatedDateTime,
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
        data={data}
        options={options}
        // persistKey={persistKey}
        title={<FormattedMessage id="profitsharing.accounting" />}
      />
    </div>
  );
};

export default ProfitSharingTable;
