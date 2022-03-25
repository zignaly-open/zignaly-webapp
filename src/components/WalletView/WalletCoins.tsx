import { Box, CircularProgress, Tooltip, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { AlignCenter, isMobile } from "styles/styles";
import { FormattedMessage, useIntl } from "react-intl";
import NumberFormat from "react-number-format";
import Table, { TableLayout } from "./Table";
import styled, { css } from "styled-components";
import CustomButton from "components/CustomButton";
import CoinIcon from "./CoinIcon";
import { Rate } from "./styles";
import { Add } from "@material-ui/icons";
import { useStoreUserData } from "hooks/useStoreUserSelector";

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

const EarnButton = styled(CustomButton)`
  min-width: auto;

  span {
    display: flex;
    flex-direction: column;
    color: ${(props) => props.theme.newTheme.secondaryText};
    font-size: 12px;
  }

  .MuiButton-label span {
    font-weight: 600;
    font-size: 16px;
    color: ${(props) => props.theme.newTheme.green};
  }
`;

const CoinCell = styled.div`
  display: flex;
  margin-left: 42px;

  ${isMobile(css`
    margin: 0;
  `)}
`;

interface WalletCoinsProps {
  walletBalance: WalletBalance;
  coins: WalletCoins;
  offers: VaultOffer[];
  setSelectedVaultOffer: (offer: VaultOffer) => void;
  setPath: (path: string) => void;
}

const WalletCoins = ({
  offers,
  walletBalance,
  coins,
  setPath,
  setSelectedVaultOffer,
}: WalletCoinsProps) => {
  const intl = useIntl();
  const userData = useStoreUserData();

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({ id: "col.coin" }).toLowerCase(),
        accessor: "coin",
      },
      {
        Header: intl.formatMessage({ id: "col.value" }).toLowerCase(),
        accessor: "value",
      },
      {
        Header: "",
        accessor: "earn",
      },
      {
        Header: intl.formatMessage({ id: "col.actions" }).toLowerCase(),
        id: "actions",
        Cell: ({ row }) => {
          const { coinData } = row.original;
          return (
            <AlignCenter>
              {coinData?.allowDeposit && (
                <Button className="textPurple" onClick={() => setPath(`deposit/${coinData.name}`)}>
                  <FormattedMessage id="accounts.deposit" />
                </Button>
              )}
              <Button className="textPurple" onClick={() => setPath(`withdraw/${coinData.name}`)}>
                <FormattedMessage id="accounts.withdraw" />
              </Button>
            </AlignCenter>
          );
        },
      },
    ],
    [],
  );

  const makeData = (coin: string, network: string, networkBalance: BalanceData) => {
    const coinData = coins ? coins[coin] : null;
    const networkData = coinData?.networks.find((n) => n.network === network);
    const offer = coinData && offers?.find((o) => o.coin === coinData.name);

    return {
      coin: (
        <CoinCell>
          <CoinIcon coin={coin} />
          <Box display="flex" flexDirection="column" ml="16px" alignItems="flex-start">
            <Box display="flex" alignItems="center" mb="4px">
              <TypographyAmount>
                <NumberFormat
                  value={networkBalance.balance}
                  displayType="text"
                  thousandSeparator={true}
                  decimalScale={coinData?.decimals}
                />
              </TypographyAmount>
              <TypographyToken>{coin}</TypographyToken>
            </Box>
            <TypographySecondary>{networkData?.name}</TypographySecondary>
          </Box>
        </CoinCell>
      ),
      value: (
        <AlignCenter direction="column">
          {coinData ? (
            <Box display="flex" alignItems="center">
              <Typography style={{ fontWeight: 600 }}>
                <NumberFormat
                  prefix="$"
                  value={networkBalance.balance * coinData.usdPrice}
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
      earn: (
        <div style={{ minWidth: "123px" }}>
          {offer && (
            <EarnButton onClick={() => setSelectedVaultOffer(offer)}>
              <FormattedMessage
                id="wallet.staking.earn.short"
                values={{
                  coin: coinData.name,
                  reward: offer.coinReward,
                  span: (chunks: string) => <span>{chunks}</span>,
                }}
              />
            </EarnButton>
          )}
        </div>
      ),
      coinData,
    };
  };

  const data = useMemo(() => {
    if (walletBalance && !walletBalance.NEOFI) {
      // Force NEOFI in the list
      walletBalance.NEOFI = {
        dummy: {
          availableBalance: 0,
          balance: 0,
        },
      };
    }
    return Object.entries(walletBalance || {}).reduce((accData, [coin, networkBalances]) => {
      Object.entries(networkBalances).forEach(([key, networkBalance]) => {
        if (coin !== "ZIG" && key !== "total") {
          accData.push(makeData(coin, key, networkBalance));
        }
      });
      return accData;
    }, []);
  }, [walletBalance, coins, offers]);

  if (!walletBalance) {
    return null;
  }

  return (
    <Box style={{ textAlign: "center" }}>
      {data.length > 0 && (
        <TableLayout>
          <Table data={data} columns={columns} />
        </TableLayout>
      )}
      {userData.isAdmin && (
        <Button startIcon={<Add />} onClick={() => setPath("deposit")}>
          <FormattedMessage id="wallet.addcoin" />
        </Button>
      )}
    </Box>
  );
};

export default WalletCoins;
