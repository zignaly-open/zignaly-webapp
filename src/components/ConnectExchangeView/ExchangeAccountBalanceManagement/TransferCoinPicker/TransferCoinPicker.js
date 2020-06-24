import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, Typography } from "@material-ui/core";
import "./TransferCoinPicker.scss";
import CustomSelect from "../../../CustomSelect";
import { formatFloat } from "../../../../utils/format";

const TransferCoinPicker = ({ label, onChange, coins, asset, selectedCoin }) => {
  const intl = useIntl();

  return (
    <Box className="transferCoinPicker">
      <CustomSelect
        options={coins}
        label={intl.formatMessage({ id: label })}
        search={true}
        onChange={onChange}
        value={selectedCoin}
        labelPlacement="top"
      />
      <Box className="balanceBox">
        <BalanceLine label="deposit.current" amount={asset.balanceTotal} unit={selectedCoin} />
        <BalanceLine label="deposit.inorder" amount={asset.balanceLocked} unit={selectedCoin} />
        <BalanceLine label="deposit.available" amount={asset.balanceFree} unit={selectedCoin} />
      </Box>
    </Box>
  );
};

const BalanceLine = ({ label, amount, unit }) => (
  <Box display="flex" flexDirection="row" justifyContent="space-between" className="balanceLine">
    <Typography variant="body2">
      <FormattedMessage id={label} />
    </Typography>
    <Box>
      {formatFloat(amount)} {unit}
    </Box>
  </Box>
);

export default TransferCoinPicker;
