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
  font-size: 18px;
`;

const BalanceLabel = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
  margin-left: 4px;
`;

interface AmountControlProps {
  errors: any;
  control: any;
  balance: BalanceData;
  decimals?: number;
  setBalanceMax: () => void;
  coin: string;
  label?: string;
  minAmount?: number;
  maxAmount?: number;
  newDesign?: boolean;
  lockedDesc?: string;
}

const AmountControl = ({
  errors,
  control,
  balance,
  decimals,
  setBalanceMax,
  coin,
  label = "withdraw.amount",
  newDesign = false,
  minAmount,
  maxAmount,
  lockedDesc,
}: AmountControlProps) => {
  const intl = useIntl();
  const lockedBalance = balance.balance - balance.availableBalance;

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
              minAmount
                ? parseFloat(value) >= minAmount ||
                  intl.formatMessage({ id: "convert.min" }, { amount: minAmount, coin })
                : parseFloat(value) > 0,
            max: (value) =>
              parseFloat(value) > balance.availableBalance
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
      <Box display="flex" mt="16px">
        <SecondaryText>
          <FormattedMessage id="deposit.available" />
        </SecondaryText>
        <BalanceLabel>
          <NumberFormat
            value={balance.availableBalance}
            displayType="text"
            thousandSeparator={true}
            decimalScale={decimals}
          />
          &nbsp;{coin}
        </BalanceLabel>
      </Box>
      {lockedBalance > 0 && (
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
