import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Input, Label, StyledFormControl, Title } from "styles/styles";
import WalletIcon from "images/wallet/wallet.svg";
import Select from "../Select";
import { Control } from "../styles";
import ZignalyIcon from "images/exchanges/zignaly.svg";
import { Controller, useForm } from "react-hook-form";
import { Box, FormControl, FormHelperText, InputAdornment, Typography } from "@material-ui/core";
import NumberFormat from "react-number-format";
import styled from "styled-components";
import CustomNumberInput from "components/Forms/CustomNumberInput";
import Button from "components/Button";
import tradeApi from "services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import useInterval from "hooks/useInterval";
import dayjs from "dayjs";

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

interface SwapZIGConfirmProps {
  amount: string;
  swapInfo: GenerateBuyPriceRes;
  coinFrom: string;
  coinTo: string;
}

const SwapZIGConfirm = ({
  coinFrom,
  coinTo,
  amount,
  swapInfo: swapInfoOrig,
}: SwapZIGConfirmProps) => {
  const [swapInfo, setSwapInfo] = useState<GenerateBuyPriceRes>(swapInfoOrig);
  const priceExpired = dayjs(swapInfo.expiration).isBefore(dayjs());

  const updateSwapInfo = () => {
    tradeApi.generateBuyPrice({ coinFrom, coinTo }).then((response) => {
      setSwapInfo(response);
    });
  };

  useInterval(
    () => {
      updateSwapInfo();
    },
    30000,
    false,
  );
  // todo, fetch before exp?
  useEffect(updateSwapInfo, []);

  const swap = () => {};

  return (
    <>
      <Title>
        <img src={WalletIcon} width={40} height={40} />
        <FormattedMessage id="wallet.zig.swap.title" values={{ coin: "ZIG" }} />
      </Title>
      <Box display="flex" flexDirection="row" mt="64px">
        <Button onClick={() => {}} variant="text" style={{ marginTop: "8px" }}>
          <FormattedMessage id="accounts.back" />
        </Button>
        <Button onClick={swap} disabled={priceExpired} variant="contained">
          <FormattedMessage id="wallet.zig.swap.now" />
        </Button>
      </Box>
    </>
  );
};
export default SwapZIGConfirm;
