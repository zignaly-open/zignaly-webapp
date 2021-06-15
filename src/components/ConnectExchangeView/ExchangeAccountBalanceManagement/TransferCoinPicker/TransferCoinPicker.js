import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, Typography } from "@material-ui/core";
import CustomSelect from "../../../CustomSelect";
import { formatFloat } from "../../../../utils/format";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 */

/**
 * @typedef {Object} TransferCoinPickerTablePropTypes
 * @property {string} label Dropdown label.
 * @property {function} onChange Callback to select coin,
 * @property {Array<string>} coins Coins list.
 * @property {ExchangeAsset} asset Selected asset.
 * @property {string} selectedCoin Selected coin name.
 */

/**
 * Provides a dropdown to select a coin with balance info.
 *
 * @param {TransferCoinPickerTablePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TransferCoinPicker = ({ label, onChange, coins, asset, selectedCoin }) => {
  const intl = useIntl();

  return (
    <Box className="transferCoinPicker">
      <CustomSelect
        label={intl.formatMessage({ id: label })}
        labelPlacement="top"
        onChange={onChange}
        options={coins}
        placeholder={intl.formatMessage({ id: "deposit.selectcoin" })}
        search={true}
        value={selectedCoin}
      />
      {asset && (
        <Box className="balanceBox">
          <BalanceLine amount={asset.balanceTotal} label="deposit.current" unit={selectedCoin} />
          <BalanceLine amount={asset.balanceLocked} label="deposit.inorder" unit={selectedCoin} />
          <BalanceLine amount={asset.balanceFree} label="deposit.available" unit={selectedCoin} />
        </Box>
      )}
    </Box>
  );
};

/**
 * @typedef {Object} BalanceLinePropTypes
 * @property {string} label Line Label id
 * @property {string} amount Line Amount
 * @property {string} unit Line Unit
 */

/**
 * @param {BalanceLinePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const BalanceLine = ({ label, amount, unit }) => (
  <Box className="balanceLine" display="flex" flexDirection="row" justifyContent="space-between">
    <Typography className="bold" variant="body1">
      <FormattedMessage id={label} />
    </Typography>
    <Box>
      {formatFloat(amount)} {unit}
    </Box>
  </Box>
);

export default TransferCoinPicker;
