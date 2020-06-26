import React, { useEffect, useState } from "react";
import Table from "../../../../Table";
import { Box } from "@material-ui/core";
import useStoreSessionSelector from "../../../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../../../services/tradeApiClient";
import "./ConvertTable.scss";
import { FormattedMessage } from "react-intl";
import { FormatedDateTime } from "../../../../../utils/format";

/**
 * @typedef {Object} DepositHistoryTablePropTypes
 * @property {string} internalId Exchange account internal id.
 */

/**
 * Provides a table to convert assets.
 *
 * @param {DepositHistoryTablePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ConvertTable = ({ assets, onSelect }) => {
  let columns = [
    {
      name: "coin",
      label: "col.coin",
    },
    {
      name: "availableBalance",
      label: "col.balance.available",
    },
    {
      name: "btcValue",
      label: "col.valueBTC",
    },
    {
      name: "usdtValue",
      label: "col.valueUSDT",
    },
    {
      name: "approxBNBValue",
      label: "col.valueBNBapprox",
    },
  ];

  /**
   * @typedef {import("mui-datatables").MUIDataTableOptions} MUIDataTableOptions
   *
   */
  /**
   * @type {MUIDataTableOptions}
   */
  const options = {
    selectableRows: "multiple",
    onRowSelectionChange: onSelect,
  };

  return (
    <Box className="convertTable" display="flex" flexDirection="column" width={1}>
      <Table
        columns={columns}
        data={assets}
        persistKey="convertAssets"
        title={<FormattedMessage id="accounts.deposit.history" />}
        options={options}
      />
    </Box>
  );
};

export default ConvertTable;
