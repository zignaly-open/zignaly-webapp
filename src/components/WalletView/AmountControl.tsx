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
  balance: string;
  decimals?: number;
  setBalanceMax: () => void;
  coin: string;
  label?: string;
}

const AmountControl = ({
  errors,
  control,
  balance,
  decimals,
  setBalanceMax,
  coin,
  label = "withdraw.amount",
}: AmountControlProps) => {
  const intl = useIntl();
  return (
    <FormControl error={Boolean(errors.amount)} fullWidth>
      <Label style={{ marginTop: "24px" }}>
        <FormattedMessage id={label} />
      </Label>
      <CustomNumberInput
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
            min: (value) => value > 0 || intl.formatMessage({ id: "form.error.withdraw.min" }),
            max: (value) =>
              value <= balance || intl.formatMessage({ id: "form.error.withdraw.max" }),
            // step: checkDecimals,
          },
        }}
        name="amount"
      />
      {errors.amount && <FormHelperText>{errors.amount.message}</FormHelperText>}
      <Box display="flex" mt="16px">
        <SecondaryText>
          <FormattedMessage id="wallet.balance" />
        </SecondaryText>
        <BalanceLabel>
          <NumberFormat
            value={balance}
            displayType="text"
            thousandSeparator={true}
            decimalScale={decimals}
          />
          &nbsp;{coin}
        </BalanceLabel>
      </Box>
    </FormControl>
  );
};

export default AmountControl;
