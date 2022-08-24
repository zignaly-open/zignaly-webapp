import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Input, Label, StyledFormControl, Title } from "styles/styles";
import WalletIcon from "images/wallet/wallet.svg";
import Select from "../Select";
import { Control } from "../styles";
import ZignalyIcon from "images/exchanges/zignaly.svg";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  Tooltip,
  Typography,
} from "@material-ui/core";
import NumberFormat from "react-number-format";
import styled from "styled-components";
import CustomNumberInput from "components/Forms/CustomNumberInput";
import Button from "components/Button";
import tradeApi from "services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import useInterval from "hooks/useInterval";
import SwapZIGConfirm from "./SwapZIGConfirm";
import ExchangesTooltip from "../ExchangesTooltip";
import dayjs from "dayjs";
import { useTz } from "services/tz";

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

interface SwapZIGProps {
  accountsBalances: BalanceExchange[];
  coinFrom?: string;
  coinTo?: string;
  onDepositMore: () => void;
  onDone: () => void;
}

const SwapZIG = ({
  coinFrom = "USDT",
  coinTo = "ZIG",
  accountsBalances,
  onDepositMore,
  onDone,
}: SwapZIGProps) => {
  const track = useTz();
  const {
    control,
    formState: { isValid },
    errors,
    setValue,
    handleSubmit,
    trigger,
    watch,
  } = useForm({ mode: "onChange" });
  const exchangeOptions = accountsBalances
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((a) => ({
      value: a.exchangeId,
      label: a.name,
      icon: ZignalyIcon,
    }));
  const selectedExchangeId = watch("internalId");
  const amountFrom = watch("amount");
  const balance = selectedExchangeId
    ? accountsBalances.find((b) => b.exchangeId === selectedExchangeId).balance
    : null;
  const intl = useIntl();
  const [swapInfo, setSwapInfo] = useState<GetSwapPriceRes>(null);
  const amountTo = swapInfo && amountFrom ? amountFrom * swapInfo.price : null;
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState<FormData>(null);
  const [loading, setLoading] = useState(false);
  const timeForMaxDiff = swapInfo
    ? Math.ceil(dayjs.unix(swapInfo.timeForMax).diff(dayjs()) / 60000)
    : 0;

  const setBalanceMax = () => {
    setValue("amount", balance);
    trigger("amount");
  };

  const updateSwapInfo = () => {
    setLoading(true);
    tradeApi
      .generateBuyPrice({ from: coinFrom, to: coinTo })
      .then((response) => {
        setSwapInfo(response);
        if (!isValid && amountFrom) {
          // Force refresh validation in case the user entered the amount before we got the swap info.
          trigger("amount");
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useInterval(
    () => {
      if (!loading) {
        updateSwapInfo();
      }
    },
    20000,
    false,
  );
  useEffect(updateSwapInfo, []);

  interface FormData {
    amount: string;
    internalId: string;
  }
  const submitForm = (data: FormData) => {
    setConfirm(data);
  };

  if (confirm) {
    return (
      <SwapZIGConfirm
        internalId={confirm.internalId}
        coinFrom={coinFrom}
        coinTo={coinTo}
        amount={parseFloat(confirm.amount)}
        onCancel={() => setConfirm(null)}
        onDone={onDone}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Title>
        <img src={WalletIcon} width={40} height={40} />
        <FormattedMessage id="wallet.zig.buy.title" values={{ coin: "ZIG" }} />
      </Title>
      <Box mb="24px">
        <Typography>
          <FormattedMessage
            id="wallet.zig.buy.exchange"
            values={{
              a: (chunk: string) => (
                <Tooltip interactive placement="bottom" title={<ExchangesTooltip />}>
                  <a className="link">{chunk}</a>
                </Tooltip>
              ),
            }}
          />
        </Typography>
      </Box>
      <Control>
        <Label>
          <FormattedMessage id="wallet.zig.deposit.exchangeaccount" />
        </Label>
        <Controller
          control={control}
          defaultValue={false}
          name="internalId"
          render={({ onChange, value }) => (
            <Select
              values={exchangeOptions}
              fullWidth
              value={value}
              handleChange={(val) => {
                track("select-account-zig");
                onChange(val);
              }}
            />
          )}
          rules={{
            required: true,
          }}
        />
      </Control>
      {selectedExchangeId && (
        <>
          <StyledFormControl error={Boolean(errors.amount)} fullWidth>
            <Label style={{ marginTop: "24px" }}>
              <FormattedMessage id="wallet.zig.swapFrom" />
            </Label>
            <CustomNumberInput
              newDesign={true}
              showErrorMessage={false}
              errors={errors}
              endAdornment={
                <InputAdornment position="end" style={{ padding: 0 }}>
                  <Button onClick={setBalanceMax} style={{ marginRight: "28px" }}>
                    <FormattedMessage id="transfer.internal.max" />
                  </Button>
                  &nbsp;{coinFrom}
                </InputAdornment>
              }
              control={control}
              rules={{
                validate: {
                  min: (value) =>
                    !swapInfo ||
                    parseFloat(value) >= swapInfo.minAmount ||
                    intl.formatMessage(
                      { id: "convert.min" },
                      { amount: swapInfo.minAmount, coin: coinFrom },
                    ),
                  max: (value) =>
                    parseFloat(value) > balance
                      ? intl.formatMessage({ id: "form.error.withdraw.max" })
                      : !swapInfo ||
                        parseFloat(value) <= swapInfo.maxAmount ||
                        intl.formatMessage(
                          {
                            id:
                              timeForMaxDiff > 0
                                ? "wallet.zig.swap.max.left"
                                : "wallet.zig.swap.max",
                          },
                          {
                            amount: swapInfo.maxAmount,
                            coin: coinFrom,
                            mins: timeForMaxDiff,
                          },
                        ),
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
                  value={balance}
                  displayType="text"
                  thousandSeparator={true}
                  decimalScale={8}
                />
                &nbsp;{coinFrom}
              </BalanceLabel>
            </Box>
          </StyledFormControl>
          <StyledFormControl error={Boolean(errors.amount)} fullWidth>
            <Label style={{ marginTop: "24px" }}>
              <FormattedMessage id="wallet.zig.swapTo" />
            </Label>
            <Input
              readOnly
              fullWidth
              value={amountTo?.toFixed(2)}
              endAdornment={coinTo}
              placeholder={intl.formatMessage({ id: "wallet.zig.received" })}
            />
          </StyledFormControl>
          <Box display="flex" flexDirection="column" mt="64px" alignItems="center">
            <Button type="submit" disabled={!isValid || !amountTo} variant="contained">
              <FormattedMessage id="wallet.withdraw.continue" />
            </Button>
            <Button onClick={onDepositMore} variant="text" style={{ marginTop: "8px" }}>
              <FormattedMessage id="wallet.zig.depositMore" values={{ coin: coinFrom }} />
            </Button>
          </Box>
        </>
      )}
    </form>
  );
};
export default SwapZIG;
