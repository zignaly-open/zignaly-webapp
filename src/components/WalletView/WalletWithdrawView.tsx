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
import tradeApi from "services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";

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
  onDone: () => void;
  setPath: (path: string) => void;
}

const WalletWithdrawView = ({
  coins,
  coin,
  balance,
  onClose,
  onDone,
  setPath,
}: WalletDepositViewProps) => {
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
    watch,
  } = useForm({ mode: "onChange" });
  const intl = useIntl();
  const dispatch = useDispatch();
  const [minAmount, setMinAmount] = useState(null);
  const amount = watch("amount");

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

  useEffect(() => {
    if (network) {
      tradeApi
        .getNetworkFee({ network, currency: coin })
        .then((response) => {
          setMinAmount(response.feeCurrency === coin ? response.floatFee : 0);
          if (amount) {
            // Update amount verification check. Without timeout, ROF doesn't check against updated minAmount...
            setTimeout(() => {
              trigger("amount");
            }, 0);
          }
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  }, [network]);

  if (withdrawData) {
    return (
      <WalletWithdrawConfirm
        address={withdrawData.address}
        amount={withdrawData.amount}
        coin={coinData}
        memo={withdrawData.memo}
        network={network}
        networkName={networkOptions.find((o) => o.value === network).label}
        onCancel={() => setWithdrawData(null)}
        onClose={onClose}
        onDone={onDone}
        setPath={setPath}
        zigCoin={coins?.ZIG}
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
                ZIG withdrawal is under maintenance until approximately 4pm UTC.
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
                    minAmount={minAmount}
                    showLockedBalance={true}
                  />
                </Control>

                <Box display="flex" flexDirection="row" mt="64px">
                  <Button className="textPurple borderPurple" onClick={onClose}>
                    <FormattedMessage id="confirm.cancel" />
                  </Button>
                  <Button
                    className="bgPurple"
                    type="submit"
                    disabled={!isValid || minAmount === null}
                  >
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
