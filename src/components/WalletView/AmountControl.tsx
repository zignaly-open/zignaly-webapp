import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Label } from "styles/styles";
import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  Button as ButtonMui,
  Typography,
} from "@material-ui/core";
import CustomNumberInput from "components/Forms/CustomNumberInput";
import NumberFormat from "react-number-format";
import styled from "styled-components";
import { floatify } from "utils/format";

const SecondaryText = styled(Typography)`
  color: ${(props) => props.theme.newTheme.secondaryText};
  font-weight: 600;
  font-size: 14px;
`;

const BalanceLabel = styled(Typography)`
  font-weight: 600;
  font-size: 14px;
  margin-left: 4px;
`;

interface AmountControlProps {
  errors: any;
  control: any;
  balance?: BalanceData | number;
  decimals?: number;
  setBalanceMax: () => void;
  coin: string;
  label?: string;
  balanceLabel?: string;
  minAmount?: number;
  maxAmount?: number;
  newDesign?: boolean;
  lockedDesc?: string;
  minAmmountErrMsg?: string;
  showLockedBalance?: boolean;
}

const AmountControl = ({
  errors,
  control,
  balance,
  decimals,
  setBalanceMax,
  coin,
  label = "withdraw.amount",
  balanceLabel = "deposit.available",
  newDesign = false,
  minAmount = 0,
  maxAmount,
  lockedDesc,
  minAmmountErrMsg,
  showLockedBalance = false,
}: AmountControlProps) => {
  const intl = useIntl();
  const lockedBalance =
    typeof balance === "object" ? balance?.balance - balance?.availableBalance : 0;
  const availableBalance = typeof balance === "object" ? balance.availableBalance : balance;

  return (
    <FormControl error={Boolean(errors.amount)} fullWidth>
      <Label style={{ marginTop: "24px" }}>
        <FormattedMessage id={label} />
      </Label>
      <CustomNumberInput
        newDesign={newDesign}
        showErrorMessage={false}
        errors={errors}
        endAdornment={
          <InputAdornment position="end" style={{ padding: 0 }}>
            <ButtonMui onClick={setBalanceMax}>
              <FormattedMessage id="transfer.internal.max" />
            </ButtonMui>
          </InputAdornment>
        }
        control={control}
        rules={{
          // required: true,
          validate: {
            min: (value) =>
              minAmount !== null && minAmount !== undefined
                ? parseFloat(value) >= minAmount ||
                  intl.formatMessage(
                    { id: minAmmountErrMsg || "convert.min" },
                    { amount: minAmount, coin },
                  )
                : true,
            max: (value) =>
              typeof balance === "object" && parseFloat(value) > balance.availableBalance
                ? intl.formatMessage({ id: "form.error.withdraw.max" })
                : !maxAmount ||
                  parseFloat(value) <= maxAmount ||
                  intl.formatMessage({ id: "wallet.zig.swap.max" }, { amount: maxAmount, coin }),
            // step: checkDecimals,
          },
        }}
        name="amount"
      />
      {errors.amount && <FormHelperText>{errors.amount.message}</FormHelperText>}
      {balance && (
        <Box display="flex" mt="16px">
          <SecondaryText>
            <FormattedMessage id={balanceLabel} />
          </SecondaryText>
          <BalanceLabel>
            <NumberFormat
              value={availableBalance}
              displayType="text"
              thousandSeparator={true}
              decimalScale={decimals}
            />
            &nbsp;{coin}
          </BalanceLabel>
        </Box>
      )}
      {showLockedBalance && lockedBalance > 0 && (
        <>
          <Box display="flex">
            <SecondaryText>
              <FormattedMessage id="wallet.locked" />
            </SecondaryText>
            <BalanceLabel>
              <NumberFormat
                value={floatify(lockedBalance)}
                displayType="text"
                thousandSeparator={true}
                decimalScale={decimals}
              />
              &nbsp;{coin}
            </BalanceLabel>
          </Box>
          <Typography style={{ marginTop: "18px" }} color="textSecondary">
            <FormattedMessage id={lockedDesc || "wallet.locked.desc"} />
          </Typography>
        </>
      )}
    </FormControl>
  );
};

export default AmountControl;
