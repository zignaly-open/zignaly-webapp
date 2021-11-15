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
import { Add } from "@material-ui/icons";

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

const WalletCoins = ({ walletBalance, coins, setPath }: WalletCoinsProps) => {
  const intl = useIntl();

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
        Cell: ({ row }) => {
          const { coinData } = row.original;
          return (
            <AlignCenter>
              <Button className="textPurple" onClick={() => setPath(`withdraw/${coinData.name}`)}>
                <FormattedMessage id="accounts.withdraw" />
              </Button>
              <Button
                className="textPurple borderPurple"
                onClick={() => setPath(`deposit/${coinData.name}`)}
              >
                <FormattedMessage id="accounts.deposit" />
              </Button>
            </AlignCenter>
          );
        },
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
                <NumberFormat
                  value={networkBalance}
                  displayType="text"
                  thousandSeparator={true}
                  decimalScale={coinData?.decimals}
                />
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
      coinData,
    };
  };

  const data = useMemo(
    () =>
      Object.entries(walletBalance || {}).reduce((accData, [coin, networkBalances]) => {
        Object.entries(networkBalances).forEach(([key, networkBalance]) => {
          if (coin !== "ZIG" && key !== "total") {
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
    <Box style={{ textAlign: "center" }}>
      {data.length > 0 && (
        <TableLayout>
          <Table data={data} columns={columns} />
        </TableLayout>
      )}
      <Button startIcon={<Add />} onClick={() => setPath("deposit")}>
        <FormattedMessage id="wallet.addcoin" />
      </Button>
    </Box>
  );
};

export default WalletCoins;
