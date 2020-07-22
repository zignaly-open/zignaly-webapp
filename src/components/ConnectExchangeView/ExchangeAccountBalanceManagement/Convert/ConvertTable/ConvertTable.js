import React from "react";
import Table from "../../../../Table";
import { Box, CircularProgress } from "@material-ui/core";
import "./ConvertTable.scss";

/**
 * @typedef {import("../../../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 */

/**
 * @typedef {Array<ExchangeAsset & {coin: string}>} ExchangeAssetsWithName
 */

/**
 * @typedef {Object} DepositHistoryTablePropTypes
 * @property {ExchangeAssetsWithName} assets Exchange assets that can be converted.
 * @property {function} onSelect Coin selected callback.
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
  let columns = [
    {
      name: "coin",
      label: "col.coin",
    },
    {
      name: "balanceFree",
      label: "col.balance.available",
    },
    {
      name: "balanceFreeBTC",
      label: "col.valueBTC",
    },
    {
      name: "balanceFreeUSDT",
      label: "col.valueUSDT",
    },
    {
      name: "balanceTotalExchCoin",
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
    // @ts-ignore (wait for datatables types v3)
    onRowSelectionChange: onSelect,
    rowsSelected,
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
