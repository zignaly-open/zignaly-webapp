import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import WalletIcon from "images/wallet/wallet.svg";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import Button from "components/Button";
import tradeApi from "services/tradeApiClient";
import useInterval from "hooks/useInterval";
import { AmountBox, CoinAmount } from "../WalletWithdrawConfirm";
import CoinIcon from "../CoinIcon";
import { SwapHorizOutlined } from "@material-ui/icons";
import { isMobile, Title } from "styles/styles";
import NumberFormat from "react-number-format";

const SecondaryText = styled(Typography)`
  color: ${(props) => props.theme.newTheme.secondaryText};
  font-weight: 600;
`;

const AmountLabel = styled(Typography)`
  color: ${(props) => props.theme.newTheme.secondaryText};
  font-weight: 600;
  font-size: 18px;
`;

const AmountSwapBox = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    margin-top: 5px;
  }

  img {
    margin-right: 4px;
  }
`;

const Divider = styled.span`
  background: ${({ theme }) => (theme.palette.type === "dark" ? "#222249" : "#ACB6FF")};
  width: 100%;
  height: 1px;
  align-self: center;
  margin: 32px 0 10px;
  display: flex;

  ${isMobile(`
    display: none;
  `)};
`;

interface SwapZIGConfirmProps {
  amount: number;
  coinFrom: string;
  coinTo: string;
  internalId: string;
  onCancel: () => void;
}

const SwapZIGConfirm = ({
  coinFrom,
  coinTo,
  amount,
  internalId,
  onCancel,
}: SwapZIGConfirmProps) => {
  const [swapInfo, setSwapInfo] = useState<GetSwapPriceRes>(null);
  const amountTo = swapInfo ? amount * swapInfo.price : null;
  // const priceExpired = dayjs(swapInfo.expiration).isBefore(dayjs());

  const updateSwapInfo = () => {
    tradeApi.generateBuyPrice({ from: coinFrom, to: coinTo }).then((response) => {
      setSwapInfo(response);
    });
  };

  useInterval(
    () => {
      setSwapInfo(null);
      updateSwapInfo();
    },
    10000,
    false,
  );
  useEffect(updateSwapInfo, []);

  const swap = () => {};

  return (
    <>
      <Title>
        <img src={WalletIcon} width={40} height={40} />
        <FormattedMessage id="wallet.zig.swap.title" />
      </Title>
      <Box px="82px" py="18px">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" justifyContent="center">
            <AmountSwapBox>
              <AmountLabel>
                <FormattedMessage id="transfer.internal.form.from" />
              </AmountLabel>
              <Box display="flex" flexDirection="row">
                <CoinIcon coin={coinFrom} />
                <CoinAmount value={amount} coin={coinFrom} />
              </Box>
            </AmountSwapBox>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
            <SwapHorizOutlined style={{ fontSize: "48px" }} />
          </Box>
          <Box display="flex" justifyContent="center">
            <AmountSwapBox>
              <AmountLabel>
                <FormattedMessage id="transfer.internal.form.to" />
              </AmountLabel>
              <Box display="flex" flexDirection="row">
                <CoinIcon coin={coinTo} />
                <CoinAmount value={amountTo} coin={coinTo} />
              </Box>
            </AmountSwapBox>
          </Box>
        </Box>
        <Divider />
        <Box display="flex" my={3}>
          <SecondaryText>
            <FormattedMessage id="wallet.zig.rate" />
          </SecondaryText>
          <Typography style={{ fontWeight: 600, display: "flex" }}>
            &nbsp;1&nbsp;{coinTo}&nbsp;=&nbsp;
            {swapInfo ? (
              <NumberFormat
                value={swapInfo?.price}
                thousandSeparator={true}
                displayType="text"
                suffix={` ${coinFrom}`}
              />
            ) : (
              <CircularProgress size={21} />
            )}
          </Typography>
        </Box>
      </Box>
      <AmountBox primary>
        <AmountLabel big={true}>
          <FormattedMessage id="wallet.withdraw.receive" />
        </AmountLabel>
        <Box display="flex" alignItems="center">
          <div style={{ marginRight: "4px" }}>
            <CoinIcon coin={coinTo} />
          </div>
          <CoinAmount big={true} value={amountTo} coin={coinTo} />
        </Box>
      </AmountBox>
      <Box display="flex" flexDirection="column" mt="64px" alignItems="center">
        <Button
          onClick={swap}
          disabled={!swapInfo}
          variant="contained"
          style={{ minWidth: "144px" }}
        >
          <FormattedMessage id="wallet.zig.swap.now" />
        </Button>
        <Button onClick={onCancel} variant="text" style={{ marginTop: "8px" }}>
          <FormattedMessage id="accounts.back" />
        </Button>
      </Box>
    </>
  );
};
export default SwapZIGConfirm;
