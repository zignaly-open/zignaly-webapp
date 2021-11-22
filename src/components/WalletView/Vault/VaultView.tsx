import { Box, CircularProgress, Typography } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Title, TypographyBolder } from "styles/styles";
import WalletIcon from "images/wallet/wallet.svg";
import Table, { TableLayout } from "../Table";
import RewardsProgressBar from "./RewardsProgressBar";
import tradeApi from "services/tradeApiClient";
import VaultOfferModal from "./VaultOfferModal";
import styled from "styled-components";
import { ChevronRight } from "@material-ui/icons";
import NumberFormat from "react-number-format";
import CoinIcon from "../CoinIcon";
import dayjs from "dayjs";

const Terms = styled.a`
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 17px;
  font-weight: 600;
  font-size: 12px;
  text-decoration: none;
  color: ${({ theme }) => theme.newTheme.linkText};
`;

const Coin = styled.span`
  color: #65647e;
  font-size: 11px;
  margin: 0 5px 0 4px;
`;

const Balance = styled(Typography)`
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const VaultView = () => {
  const intl = useIntl();
  const [vaults, setVaults] = useState<Vault[]>(null);
  const [selectedVault, setSelectedVault] = useState<Vault>(null);

  useEffect(() => {
    tradeApi.getVaults().then((response) => {
      setVaults(response);
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({ id: "vault.rewardsRemaning" }),
        accessor: "rewards",
      },
      {
        Header: intl.formatMessage({ id: "vault.offer" }),
        accessor: "offer",
      },
      {
        Header: intl.formatMessage({ id: "vault.minBalance" }),
        accessor: "minBalance",
      },
      {
        Header: intl.formatMessage({ id: "vault.earn" }),
        accessor: "earn",
      },
      {
        Header: intl.formatMessage({ id: "vault.starts" }),
        accessor: "startDate",
      },
      {
        Header: intl.formatMessage({ id: "vault.ends" }),
        accessor: "endDate",
      },
    ],
    [],
  );

  const data = useMemo(
    () =>
      vaults &&
      vaults.map((v) => ({
        rewards: <RewardsProgressBar vault={v} />,
        offer: (
          <>
            <Typography style={{ fontWeight: 600, display: "flex" }}>
              <FormattedMessage
                id="wallet.staking.earn"
                values={{ coin: v.coin, reward: v.coinReward, amount: v.minDeposit }}
              />
              <Terms onClick={() => setSelectedVault(v)}>
                <FormattedMessage id="vault.terms" />
                <ChevronRight />
              </Terms>
            </Typography>
          </>
        ),
        minBalance: (
          <Balance>
            <NumberFormat displayType="text" value={v.minDeposit} />
            <Coin>{v.coin}</Coin>
            <CoinIcon width={16} height={16} coin={v.coin} />
          </Balance>
        ),
        earn: (
          <Balance>
            <NumberFormat displayType="text" value={v.rewardsTotal} />
            <Coin>{v.coinReward}</Coin>
            <CoinIcon width={16} height={16} coin={v.coinReward} />
          </Balance>
        ),
        startDate: (
          <Typography style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
            {dayjs(v.startDate).format("MMM D, YYYY")}
          </Typography>
        ),
        endtDate: (
          <Typography style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
            {dayjs(v.endDate).format("MMM D, YYYY")}
          </Typography>
        ),
      })),
    [vaults],
  );

  return (
    <Box p={5}>
      {selectedVault && (
        <VaultOfferModal onClose={() => setSelectedVault(null)} open={true} vault={selectedVault} />
      )}
      <Title>
        <img src={WalletIcon} width={40} height={40} />
        <FormattedMessage id="vault.title" />
      </Title>
      {data ? (
        <TableLayout>
          <Table data={data} columns={columns} />
        </TableLayout>
      ) : (
        <Box display="flex" flex={1} justifyContent="center">
          <CircularProgress color="primary" size={40} />
        </Box>
      )}
    </Box>
  );
};
export default VaultView;
