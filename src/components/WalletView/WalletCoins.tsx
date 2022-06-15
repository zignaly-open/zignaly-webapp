import { Box, CircularProgress, Tooltip, Typography } from "@material-ui/core";
import React, { useMemo, useState } from "react";
import { AlignCenter, isMobile } from "styles/styles";
import { FormattedMessage, useIntl } from "react-intl";
import NumberFormat from "react-number-format";
import Table, { TableLayout } from "./Table";
import styled, { css } from "styled-components";
import CustomButton from "components/CustomButton";
import CoinIcon from "./CoinIcon";
import { Rate } from "./styles";
import { Add, ChevronRight } from "@material-ui/icons";
import { useStoreUserData } from "hooks/useStoreUserSelector";
import WalletPopover from "./WalletPopover";

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

const ChevronRightStyled = styled(ChevronRight)`
  color: #65647e;
  cursor: pointer;
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

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event: React.MouseEvent<any>, coin: string) => {
    setAnchorEl({ anchor: event.currentTarget, coin });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const makeData = (coin: string, balance: BalanceData) => {
    const coinData = coins ? coins[coin] : null;
    const offer = coinData && offers?.find((o) => o.coin === coinData.name);

    return {
      coin: (
        <CoinCell>
          <CoinIcon coin={coin} />
          <Box display="flex" flexDirection="column" ml="16px" justifyContent="center">
            <Box display="flex" alignItems="center">
              <TypographyAmount>
                <NumberFormat
                  value={balance.balance}
                  displayType="text"
                  thousandSeparator={true}
                  decimalScale={coinData?.decimals}
                />
              </TypographyAmount>
              <TypographyToken>{coin}</TypographyToken>
              {(balance.staked > 0 || balance.unstaking > 0) && coinData && (
                <>
                  <ChevronRightStyled onClick={(e) => handleClick(e, coin)} />
                  <WalletPopover
                    anchorEl={anchorEl?.coin === coin ? anchorEl.anchor : null}
                    balance={walletBalance[coin]}
                    coin={coinData}
                    handleClose={handleClose}
                  />
                </>
              )}
            </Box>
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
                  value={balance.balance * coinData.usdPrice}
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
                id={
                  offer.type === "stake"
                    ? "wallet.staking.earnStake.short"
                    : "wallet.staking.earn.short"
                }
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

  const addDummyCoin = (coin: string) => {
    if (!walletBalance[coin] && coins && coins[coin]) {
      // Force coin in the deposit list
      walletBalance[coin] = {
        availableBalance: 0,
        balance: 0,
        locked: 0,
        staked: 0,
        unstaking: 0,
      };
    }
  };

  const data = useMemo(() => {
    if (walletBalance) {
      ["NEOFI", "MHUNT", "PDD"].forEach((c) => {
        addDummyCoin(c);
      });
    }

    return Object.entries(walletBalance || {}).reduce((accData, [coin, balance]) => {
      if (coin !== "ZIG") {
        accData.push(makeData(coin, balance));
      }
      return accData;
    }, []);
  }, [walletBalance, coins, offers, anchorEl]);

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
