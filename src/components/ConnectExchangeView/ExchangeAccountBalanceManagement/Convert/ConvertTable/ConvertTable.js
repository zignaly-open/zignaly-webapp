import React from "react";
import Table from "../../../../Table";
import { formatPrice } from "../../../../../utils/formatters";
import { Box, CircularProgress } from "@mui/material";
import "./ConvertTable.scss";

/**
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableOptions} MUIDataTableOptions
 * @typedef {import("mui-datatables").MUIDataTableOptions['onRowSelectionChange']} OnRowSelectionChange
 */

/**
 * @typedef {import("../../../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 */

/**
 * @typedef {Array<ExchangeAsset & {coin: string}>} ExchangeAssetsWithName
 */

/**
 * @typedef {Object} DepositHistoryTablePropTypes
 * @property {ExchangeAssetsWithName} assets Exchange assets that can be converted.
 * @property {OnRowSelectionChange} onSelect Coin selected callback.
 * @property {Array<Number>} rowsSelected Selected rows indexes.
 * @property {boolean} loading Flag to indicate if data is loading.
 */

/**
 * Provides a table to convert assets.
 *
 * @param {DepositHistoryTablePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ConvertTable = ({ assets, onSelect, rowsSelected, loading }) => {
  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  let columns = [
    {
      name: "coin",
      label: "col.coin",
    },
    {
      name: "balanceFree",
      label: "col.balance.available",
      options: {
        customBodyRender: (val) => formatPrice(val),
      },
    },
    {
      name: "balanceFreeBTC",
      label: "col.valueBTC",
      options: {
        customBodyRender: (val) => formatPrice(val),
      },
    },
    {
      name: "balanceFreeUSDT",
      label: "col.valueUSDT",
      options: {
        customBodyRender: (val) => formatPrice(val),
      },
    },
    {
      name: "balanceTotalExchCoin",
      label: "col.valueBNBapprox",
      options: {
        customBodyRender: (val) => formatPrice(val),
      },
    },
  ];

  /**
   * @type {MUIDataTableOptions}
   */
  const options = {
    selectableRows: "multiple",
    onRowSelectionChange: onSelect,
    rowsSelected,
    sortOrder: {
      name: "col.balance.available",
      direction: "desc",
    },
  };

  return (
    <Box className="convertTable" display="flex" flexDirection="column" width={1}>
      {loading ? (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      ) : (
        <Table
          columns={columns}
          components={{
            TableToolbarSelect: () => <></>,
            TableToolbar: () => <></>,
          }}
          data={assets}
          options={options}
          persistKey="convertAssets"
          title=""
        />
      )}
    </Box>
  );
};

export default ConvertTable;
