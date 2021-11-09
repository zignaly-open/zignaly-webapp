import { Box, CircularProgress, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { AlignCenter } from "styles/styles";
import { FormattedMessage, useIntl } from "react-intl";
import NumberFormat from "react-number-format";
import Table, { TableLayout } from "./Table";
import styled from "styled-components";
import tradeApi from "services/tradeApiClient";
import CustomButton from "components/CustomButton";
import CoinIcon from "./CoinIcon";
import { Rate } from "./styles";

const TypographyAmount = styled(Typography)`
  font-weight: 600;
  font-size: 16px;
`;

const TypographySecondary = styled(Typography)`
  font-size: 12px;
  color: #65647e;
`;

const TypographyToken = styled(TypographySecondary)`
  font-weight: 600;
  margin-left: 4px;
`;

const Button = styled(CustomButton)`
  margin-right: 8px;
  min-width: 121px;
`;

interface WalletCoinsProps {
  walletBalance: WalletBalance;
  coins: WalletCoins;
}

const WalletCoins = ({ walletBalance, coins }: WalletCoinsProps) => {
  const intl = useIntl();

  // const balanceEntries = Object.entries(balance || {});

  // useEffect(() => {
  //   if (balance) {
  //     balanceEntries.forEach(([coin]) => {
  //       tradeApi.convertPreview({ from: coin, to: "USDT", qty: 1 }).then((response) => {
  //         setRateZIG(response.lastPrice);
  //       });
  //     });
  //   }
  // }, [balance]);

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({ id: "col.coin" }),
        accessor: "coin",
      },
      {
        Header: intl.formatMessage({ id: "col.value" }),
        accessor: "value",
      },
      {
        Header: intl.formatMessage({ id: "col.actions" }),
        id: "actions",
        Cell: ({ row }) => (
          <AlignCenter>
            <Tooltip title={<FormattedMessage id="wallet.fees.cashback.soon" />}>
              <div>
                <Button className="textPurple" disabled style={{ opacity: 0.4 }}>
                  <FormattedMessage id="accounts.withdraw" />
                </Button>
              </div>
            </Tooltip>
            <Tooltip title={<FormattedMessage id="wallet.fees.cashback.soon" />}>
              <div>
                <Button className="textPurple borderPurple">
                  <FormattedMessage id="accounts.deposit" />
                </Button>
              </div>
            </Tooltip>
          </AlignCenter>
        ),
      },
    ],
    [],
  );

  const makeData = (coin: string, network: string, networkBalance: string) => {
    const coinData = coins ? coins[coin] : null;
    const networkData = coinData?.networks.find((n) => n.network === network);

    return {
      coin: (
        <AlignCenter>
          <CoinIcon coin={coin} />
          <Box display="flex" flexDirection="column" ml="16px">
            <Box display="flex" alignItems="center" mb="4px">
              <TypographyAmount>
                <NumberFormat value={networkBalance} displayType="text" thousandSeparator={true} />
              </TypographyAmount>
              <TypographyToken>{coin}</TypographyToken>
            </Box>
            <TypographySecondary>{networkData?.name}</TypographySecondary>
          </Box>
        </AlignCenter>
      ),
      value: (
        <AlignCenter direction="column">
          {coinData ? (
            <Box display="flex" alignItems="center">
              <Typography style={{ fontWeight: 600 }}>
                <NumberFormat
                  prefix="$"
                  value={parseFloat(networkBalance) * coinData.usdPrice}
                  displayType="text"
                  thousandSeparator={true}
                  decimalScale={2}
                />
              </Typography>
              <Rate>
                @{coinData.usdPrice}/{coin}
              </Rate>
            </Box>
          ) : (
            " - "
          )}
        </AlignCenter>
      ),
    };
  };

  const data = useMemo(
    () =>
      Object.entries(walletBalance || {}).reduce((accData, [coin, networkBalances]) => {
        Object.entries(networkBalances).forEach(([key, networkBalance]) => {
          if (key !== "total") {
            accData.push(makeData(coin, key, networkBalance));
          }
        });
        return accData;
      }, []),
    [walletBalance, coins],
  );

  if (!walletBalance) {
    return (
      <Box display="flex" flex={1} justifyContent="center">
        <CircularProgress color="primary" size={40} />
      </Box>
    );
  }

  return (
    <TableLayout>
      <Table data={data} columns={columns} />
    </TableLayout>
  );
};

export default WalletCoins;
