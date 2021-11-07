import React, { useEffect, useState } from "react";
import WalletIcon from "images/wallet/wallet.svg";
import { FormattedMessage, useIntl } from "react-intl";
import { isMobile, Label, Modal, TextDesc, Title } from "styles/styles";
import styled from "styled-components";
import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import CustomSelect from "components/CustomSelect";
import { NetworkCautionMessage } from "./WalletDepositView";
import { StyledCustomSelect } from "./styles";
import CustomButton from "components/CustomButton";
import WalletWithdrawConfirm from "./WalletWithdrawConfirm";
import { useForm } from "react-hook-form";
import NumberFormat from "react-number-format";
import CustomNumberInput from "components/Forms/CustomNumberInput";

const AmountInput = styled(OutlinedInput)``;

const Button = styled(CustomButton)`
  margin-right: 8px;
  min-width: 121px;
`;

interface WalletDepositViewProps {
  coins: WalletCoins;
  coin?: string;
  balance: Record<string, string>;
}

const WalletWithdrawView = ({ coins, coin = "ZIG", balance, onClose }: WalletDepositViewProps) => {
  const coinData = coins ? coins[coin] : null;
  const networkOptions = coinData ? coinData.networks.map((n) => n.network) : [];
  const [network, setNetwork] = useState("");
  const balanceAmount = (balance && balance[network]) || 0;
  // const [path, setPath] = useState("");
  const [withdrawData, setWithdrawData] = useState(null);
  const {
    handleSubmit,
    register,
    reset,
    control,
    errors,
    formState: { isValid },
  } = useForm({ mode: "onChange" });
  const intl = useIntl();

  useEffect(() => {
    if (coinData) {
      // Select first option
      setNetwork(coinData.networks[0].network);
    }
  }, [coinData]);

  if (withdrawData) {
    return (
      <WalletWithdrawConfirm
        address={withdrawData.address}
        network={network}
        amount={withdrawData.amount}
        coin={coin}
        onClose={() => setWithdrawData(null)}
      />
    );
  }

  const submitForm = (data) => {
    // setPath("verify");
    setWithdrawData(data);
  };

  return (
    <Modal p={5}>
      {balance ? (
        <>
          <Title>
            <Box alignItems="center" display="flex">
              <img src={WalletIcon} width={40} height={40} />
              <FormattedMessage id="wallet.type.withdraw" /> ZIG
            </Box>
          </Title>
          <form onSubmit={handleSubmit(submitForm)}>
            <TextDesc>
              <FormattedMessage id="wallet.withdraw.desc" values={{ coin: "ZIG" }} />
            </TextDesc>
            <br />
            <StyledCustomSelect>
              <CustomSelect
                labelPlacement="top"
                onChange={setNetwork}
                options={networkOptions}
                value={network}
                label={<FormattedMessage id="deposit.network" />}
              />
            </StyledCustomSelect>
            <NetworkCautionMessage network={network} />
            <FormControl error={errors.address} fullWidth>
              <Label style={{ marginTop: "24px" }}>
                <FormattedMessage id="wallet.withdraw.address" />
              </Label>
              <OutlinedInput
                className="customInput"
                inputRef={register({
                  required: true,
                  pattern: {
                    value: /^(0x)[0-9A-Fa-f]{40}$/,
                    message: intl.formatMessage({ id: "wallet.withdraw.address.invalid" }),
                  },
                })}
                name="address"
              />
              {errors.address && <FormHelperText>{errors.address.message}</FormHelperText>}
            </FormControl>
            <FormControl error={errors.amount} fullWidth>
              <Label style={{ marginTop: "24px" }}>
                <FormattedMessage id="wallet.withdraw.amount" />
              </Label>
              <CustomNumberInput
                showErrorMessage={false}
                errors={errors}
                endAdornment={
                  <InputAdornment position="end">
                    <FormattedMessage id="transfer.internal.max" />
                  </InputAdornment>
                }
                control={control}
                rules={{
                  // required: true,
                  validate: {
                    min: (value) =>
                      value > 0 || intl.formatMessage({ id: "form.error.withdraw.min" }),
                    max: (value) =>
                      value <= balanceAmount ||
                      intl.formatMessage({ id: "form.error.withdraw.max" }),
                    // step: checkDecimals,
                  },
                }}
                name="amount"
              />
              {errors.amount && <FormHelperText>{errors.amount.message}</FormHelperText>}
            </FormControl>

            <Box display="flex" flexDirection="row" mt="64px">
              <Button className="textPurple borderPurple" onClick={onClose}>
                <FormattedMessage id="confirm.cancel" />
              </Button>
              <Button className="bgPurple" type="submit" disabled={!isValid}>
                <FormattedMessage id="wallet.withdraw.continue" />
              </Button>
            </Box>
          </form>
        </>
      ) : (
        <CircularProgress style={{ margin: "0 auto" }} />
      )}
    </Modal>
  );
};
export default WalletWithdrawView;
