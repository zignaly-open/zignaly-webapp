import React, { useState } from "react";
import Table from "../../../Table";
import { FormattedMessage, useIntl } from "react-intl";
import { formatDate } from "../../../../utils/format";
import { formatPrice } from "../../../../utils/formatters";
import "./ProfitSharingTable.scss";
import AccountingFilter from "../AccountingFilter";
import { Box, Tooltip } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import { pnlRetainInfoUrl } from "utils/affiliateURLs";
import { TooltipWithUrl } from "components/TotalEquityBar/EquityPart/EquityPart";

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
        customBodyRenderLite: (dataIndex) => {
          const rowData = data[dataIndex];
          const showTooltip = rowData.type.toLowerCase() === "pnl" && rowData.amount === 0;
          return (
            <Box alignItems="center" display="flex" flexDirection="row">
              <span>{formatPrice(rowData.amount)}</span>
              {showTooltip && (
                <Tooltip
                  interactive
                  placement="top"
                  title={
                    <TooltipWithUrl
                      message="profitsharing.types.pnl.tooltip"
                      url={pnlRetainInfoUrl}
                    />
                  }
                >
                  <HelpIcon className="helpIcon" />
                </Tooltip>
              )}
            </Box>
          );
        },
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
          <Box alignItems="center" display="flex">
            <FormattedMessage id="profitsharing.accounting" />
            <AccountingFilter data={data} onChange={(d) => setData(d)} types={types} />
          </Box>
        }
      />
    </div>
  );
};

export default ProfitSharingTable;
