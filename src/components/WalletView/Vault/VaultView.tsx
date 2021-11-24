import { Box, CircularProgress, Typography, Button as ButtonMui } from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Title } from "styles/styles";
import WalletIcon from "images/wallet/wallet.svg";
import Table, { TableLayout } from "../Table";
import RewardsProgressBar from "./RewardsProgressBar";
import tradeApi from "services/tradeApiClient";
import VaultOfferModal from "./VaultOfferModal";
import styled from "styled-components";
import { ArrowBack, ChevronRight } from "@material-ui/icons";
import NumberFormat from "react-number-format";
import CoinIcon from "../CoinIcon";
import dayjs from "dayjs";
import CustomButton from "components/CustomButton";
import Modal from "components/Modal";
import WalletDepositView from "../WalletDepositView";
import PrivateAreaContext from "context/PrivateAreaContext";
import InfoPanel, { BenefitsInfo } from "./InfoPanel";

const Button = styled(CustomButton)`
  min-width: 160px;
`;

const ActivatedButton = styled.div`
  width: 160px;
  background: rgba(38, 196, 193, 0.28);
  border-radius: 40px;
  padding: 12px 24px;
  display: flex;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #b1f7ca;
`;

const Terms = styled.a`
  line-height: 16px;
  text-transform: uppercase;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
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

const VaultView = ({ isOpen }) => {
  const intl = useIntl();
  const [vaults, setVaults] = useState<Vault[]>(null);
  const [selectedVault, setSelectedVault] = useState<Vault>(null);
  const [depositCoin, setDepositCoin] = useState<string>(null);
  const { walletBalance, setWalletBalance } = useContext(PrivateAreaContext);
  const [coins, setCoins] = useState<WalletCoins>(null);

  useEffect(() => {
    if (isOpen) {
      tradeApi.getWalletCoins().then((response) => {
        setCoins(response);
      });

      tradeApi.getWalletBalance().then((response) => {
        setWalletBalance(response);
      });

      tradeApi.getVaults({ status: "active" }).then((response) => {
        setVaults(response);
      });
    }
  }, [isOpen]);

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
      {
        Header: "",
        accessor: "actions",
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
            <Typography style={{ fontWeight: 600 }}>
              <FormattedMessage
                id="wallet.staking.earn"
                values={{ coin: v.coin, reward: v.coinReward, amount: v.minBalance }}
              />
              &nbsp;
              <Terms onClick={() => setSelectedVault(v)}>
                <FormattedMessage id="vault.terms" />
                <ChevronRight />
              </Terms>
            </Typography>
          </>
        ),
        minBalance: (
          <Balance>
            <NumberFormat displayType="text" value={v.minBalance} />
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
        endDate: (
          <Typography style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
            {dayjs(v.endDate).format("MMM D, YYYY")}
          </Typography>
        ),
        actions:
          walletBalance && walletBalance[v.coin].total.availableBalance >= v.minBalance ? (
            <ActivatedButton>
              <FormattedMessage id="vault.activated" />
            </ActivatedButton>
          ) : (
            <Button className="textPurple borderPurple" onClick={() => setDepositCoin(v.coin)}>
              <FormattedMessage id="accounts.deposit" />
              &nbsp;
              <NumberFormat
                value={v.minBalance}
                displayType="text"
                suffix={` ${v.coin}`}
                style={{ whiteSpace: "nowrap" }}
              />
            </Button>
          ),
      })),
    [vaults],
  );

  return (
    <Box p={5}>
      {selectedVault && (
        <VaultOfferModal onClose={() => setSelectedVault(null)} open={true} vault={selectedVault} />
      )}
      {depositCoin && (
        <Modal
          onClose={() => setDepositCoin(null)}
          newTheme={true}
          persist={false}
          size="medium"
          state={true}
        >
          <WalletDepositView
            coins={coins}
            onClose={() => setDepositCoin(null)}
            coin={depositCoin}
          />
        </Modal>
      )}
      <Title>
        <ButtonMui href="#wallet" variant="outlined" color="grid.content" startIcon={<ArrowBack />}>
          <FormattedMessage id="accounts.back" />
        </ButtonMui>
        <img src={WalletIcon} width={40} height={40} style={{ marginLeft: "28px" }} />
        <FormattedMessage id="vault.title" />
      </Title>
      <InfoPanel id="vaultInfo" title="vault.title" message="vault.info" />
      <BenefitsInfo />
      <Box mt="32px">
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
    </Box>
  );
};
export default VaultView;
