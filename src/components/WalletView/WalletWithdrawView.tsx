import React, { useEffect, useState } from "react";
import WalletIcon from "images/wallet/wallet.svg";
import { FormattedMessage, useIntl } from "react-intl";
import { Label, Modal, TextDesc, Title } from "styles/styles";
import styled from "styled-components";
import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import CustomSelect from "components/CustomSelect";
import { NetworkCautionMessage } from "./WalletDepositView";
import { StyledCustomSelect } from "./styles";
import CustomButton from "components/CustomButton";
import WalletWithdrawConfirm from "./WalletWithdrawConfirm";
import { useForm } from "react-hook-form";
import AmountControl from "./AmountControl";

const Button = styled(CustomButton)`
  margin-right: 8px;
  min-width: 121px;
`;

interface WalletDepositViewProps {
  coins: WalletCoins;
  coin: string;
  balance: Record<string, string>;
  onClose: () => void;
}

const WalletWithdrawView = ({ coins, coin, balance, onClose }: WalletDepositViewProps) => {
  const coinData = coins ? coins[coin] : null;
  const networkOptions = coinData
    ? coinData.networks.map((n) => ({ val: n.network, label: n.name }))
    : [];
  const [network, setNetwork] = useState("");
  const balanceAmount = (balance && balance[network]) || { balance: 0, availableBalance: 0 };
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
        coin={coinData}
        onClose={onClose}
        onCancel={() => setWithdrawData(null)}
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
              <FormattedMessage id="wallet.type.withdraw" /> {coin}
            </Box>
          </Title>
          <form onSubmit={handleSubmit(submitForm)}>
            <TextDesc>
              <FormattedMessage id="wallet.withdraw.desc" values={{ coin }} />
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
            <NetworkCautionMessage network={network} coin={coin} />
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

            <AmountControl
              balance={balanceAmount}
              setBalanceMax={setBalanceMax}
              decimals={coinData?.decimals}
              errors={errors}
              control={control}
              coin={coin}
              label="wallet.withdraw.amount"
            />

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
