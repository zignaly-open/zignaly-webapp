import React, { useEffect, useState } from "react";
import WalletIcon from "images/wallet/wallet.svg";
import { FormattedMessage, useIntl } from "react-intl";
import { Input, Label, Modal, TextDesc, Title } from "styles/styles";
import styled from "styled-components";
import { Box, CircularProgress, FormControl, FormHelperText } from "@material-ui/core";
import { Control } from "./styles";
import CustomButton from "components/CustomButton";
import WalletWithdrawConfirm from "./WalletWithdrawConfirm";
import { useForm } from "react-hook-form";
import AmountControl from "./AmountControl";
import { Alert } from "@material-ui/lab";
import Select from "./Select";
import { getChainIcon } from "utils/chain";

const Button = styled(CustomButton)`
  margin-right: 8px;
  min-width: 121px;
`;

const FormControlStyled = styled(FormControl)`
  margin-bottom: 24px;
`;

interface WalletDepositViewProps {
  coins: WalletCoins;
  coin: string;
  balance: Record<string, BalanceData>;
  onClose: () => void;
}

const WalletWithdrawView = ({ coins, coin, balance, onClose }: WalletDepositViewProps) => {
  const coinData = coins ? coins[coin] : null;
  const networkOptions = coinData
    ? coinData.networks.map((n) => ({
        value: n.network,
        label: n.name,
        icon: getChainIcon(n.network),
      }))
    : [];
  const [network, setNetwork] = useState("");
  const networkData = coinData?.networks.find((n) => n.network === network);
  const withdrawDisabled = false;
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
    trigger,
  } = useForm({ mode: "onChange" });
  const intl = useIntl();

  useEffect(() => {
    if (coinData && balance) {
      // If only one network has balance, select it
      const res = Object.entries(balance).filter(
        ([key, balances]) => key !== "total" && balances.availableBalance > 0,
      );
      if (res.length === 1) {
        setNetwork(res[0][0]);
      }
    }
  }, [coinData, balance]);

  if (withdrawData) {
    return (
      <WalletWithdrawConfirm
        address={withdrawData.address}
        network={network}
        memo={withdrawData.memo}
        networkName={networkOptions.find((o) => o.value === network).label}
        amount={withdrawData.amount}
        coin={coinData}
        onClose={onClose}
        onCancel={() => setWithdrawData(null)}
      />
    );
  }

  const setBalanceMax = () => {
    setValue("amount", balanceAmount.availableBalance);
    trigger("amount");
  };

  const submitForm = (data) => {
    setWithdrawData(data);
  };

  return (
    <Modal>
      {balance && coinData ? (
        <>
          <Title>
            <img src={WalletIcon} width={40} height={40} />
            <FormattedMessage id="wallet.type.withdraw" /> {coin}
          </Title>
          <form onSubmit={handleSubmit(submitForm)}>
            <TextDesc>
              <FormattedMessage id="wallet.withdraw.desc" values={{ coin }} />
            </TextDesc>
            <Control>
              <Label>
                <FormattedMessage id="deposit.network" />
              </Label>
              <Select
                values={networkOptions}
                fullWidth
                value={network}
                handleChange={(e) => setNetwork(e.target.value)}
              />
            </Control>
            {withdrawDisabled ? (
              <Alert style={{ marginTop: "10px" }} severity="error">
                Due to the recent hack on Ascendex (
                <a
                  href="https://twitter.com/AscendEX_Global/status/1469886844787691528"
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  https://twitter.com/AscendEX_Global/status/1469886844787691528
                </a>
                ), withdrawals have been disabled. We expect to re-activate them in the following
                hours.
              </Alert>
            ) : (
              <>
                {/* {networkData && <NetworkCautionMessage network={networkData.name} coin={coin} />} */}
                <FormControlStyled error={errors.address} fullWidth>
                  <Label style={{ marginTop: "24px" }}>
                    <FormattedMessage id="wallet.withdraw.address" />
                  </Label>
                  <Input
                    placeholder={intl.formatMessage({ id: "wallet.withdraw.address.paste" })}
                    fullWidth
                    name="address"
                    inputRef={register({
                      required: true,
                      pattern: {
                        value: RegExp(networkData?.addressRegex),
                        message: intl.formatMessage({ id: "wallet.withdraw.address.invalid" }),
                      },
                    })}
                  />
                  {errors.address && <FormHelperText>{errors.address.message}</FormHelperText>}
                </FormControlStyled>

                {networkData?.memoRegex && (
                  <FormControlStyled error={errors.memo} fullWidth>
                    <Label style={{ marginTop: "24px" }}>
                      <FormattedMessage id="wallet.withdraw.memo" />
                    </Label>
                    <Input
                      fullWidth
                      name="memo"
                      inputRef={register({
                        required: true,
                        pattern: {
                          value: RegExp(networkData?.memoRegex),
                          message: intl.formatMessage({ id: "wallet.withdraw.memo.invalid" }),
                        },
                      })}
                    />
                    {errors.memo && <FormHelperText>{errors.memo.message}</FormHelperText>}
                  </FormControlStyled>
                )}

                <Control>
                  <AmountControl
                    balance={balanceAmount}
                    setBalanceMax={setBalanceMax}
                    decimals={coinData?.decimals}
                    errors={errors}
                    control={control}
                    coin={coin}
                    label="wallet.withdraw.amount"
                    newDesign={true}
                  />
                </Control>

                <Box display="flex" flexDirection="row" mt="64px">
                  <Button className="textPurple borderPurple" onClick={onClose}>
                    <FormattedMessage id="confirm.cancel" />
                  </Button>
                  <Button className="bgPurple" type="submit" disabled={!isValid}>
                    <FormattedMessage id="wallet.withdraw.continue" />
                  </Button>
                </Box>
              </>
            )}
          </form>
        </>
      ) : (
        <CircularProgress style={{ margin: "0 auto" }} />
      )}
    </Modal>
  );
};
export default WalletWithdrawView;
