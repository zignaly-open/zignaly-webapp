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
        label={intl.formatMessage({ id: label })}
        labelPlacement="top"
        onChange={onChange}
        options={coins}
        search={true}
        value={selectedCoin}
      />
      <Box className="balanceBox">
        <BalanceLine amount={asset.balanceTotal} label="deposit.current" unit={selectedCoin} />
        <BalanceLine amount={asset.balanceLocked} label="deposit.inorder" unit={selectedCoin} />
        <BalanceLine amount={asset.balanceFree} label="deposit.available" unit={selectedCoin} />
      </Box>
    </Box>
  );
};

const BalanceLine = ({ label, amount, unit }) => (
  <Box className="balanceLine" display="flex" flexDirection="row" justifyContent="space-between">
    <Typography variant="body2">
      <FormattedMessage id={label} />
    </Typography>
    <Box>
      {formatFloat(amount)} {unit}
    </Box>
  </Box>
);

export default TransferCoinPicker;
