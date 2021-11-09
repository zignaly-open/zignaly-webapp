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
  Button as ButtonMui,
  Typography,
} from "@material-ui/core";
import CustomSelect from "components/CustomSelect";
import { NetworkCautionMessage } from "./WalletDepositView";
import { StyledCustomSelect } from "./styles";
import CustomButton from "components/CustomButton";
import WalletWithdrawConfirm from "./WalletWithdrawConfirm";
import { useForm } from "react-hook-form";
import CustomNumberInput from "components/Forms/CustomNumberInput";
import NumberFormat from "react-number-format";

const Button = styled(CustomButton)`
  margin-right: 8px;
  min-width: 121px;
`;

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

const ButtonMax = styled(ButtonMui)``;

interface WalletDepositViewProps {
  coins: WalletCoins;
  coin?: string;
  balance: Record<string, string>;
  onClose: () => void;
}

const WalletWithdrawView = ({ coins, coin = "ZIG", balance, onClose }: WalletDepositViewProps) => {
  const coinData = coins ? coins[coin] : null;
  const networkOptions = coinData
    ? coinData.networks.map((n) => ({ val: n.network, label: n.name }))
    : [];
  const [network, setNetwork] = useState("");
  const balanceAmount = (balance && balance[network]) || 0;
  // const [path, setPath] = useState("");
  const [withdrawData, setWithdrawData] = useState(null);
  const {
    handleSubmit,
    register,
    control,
    errors,
    formState: { isValid },
    setValue,
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
        networkName={networkOptions.find((o) => o.val === network).label}
        amount={withdrawData.amount}
        coin={coin}
        onClose={() => setWithdrawData(null)}
      />
    );
  }

  const setBalanceMax = () => {
    setValue("amount", balanceAmount);
  };

  const submitForm = (data) => {
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
                onChange={(v) => setNetwork(v.val)}
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
                  <InputAdornment position="end" style={{ padding: 0 }}>
                    <ButtonMax onClick={setBalanceMax}>
                      <FormattedMessage id="transfer.internal.max" />
                    </ButtonMax>
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
              <Box display="flex" mt="16px">
                <SecondaryText>
                  <FormattedMessage id="wallet.balance" />
                </SecondaryText>
                <BalanceLabel>
                  <NumberFormat
                    value={balanceAmount}
                    displayType="text"
                    thousandSeparator={true}
                    decimalScale={2}
                  />
                  &nbsp;{coin}
                </BalanceLabel>
              </Box>
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
