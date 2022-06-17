import {
  Box,
  CircularProgress,
  Typography,
  Button as ButtonMui,
  useMediaQuery,
  Tabs,
  Tab,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AlignCenter, Title } from "styles/styles";
import WalletIcon from "images/wallet/wallet.svg";
import Table, { TableLayout } from "../Table";
import RewardsProgressBar from "./RewardsProgressBar";
import tradeApi from "services/tradeApiClient";
import VaultOfferModal from "./VaultOfferModal";
import styled, { css } from "styled-components";
import { ArrowBack, ChevronRight } from "@material-ui/icons";
import NumberFormat from "react-number-format";
import CoinIcon from "../CoinIcon";
import dayjs from "dayjs";
import Modal from "components/Modal";
import WalletDepositView from "../WalletDepositView";
import PrivateAreaContext from "context/PrivateAreaContext";
import InfoPanel, { BenefitsInfo } from "./InfoPanel";
import VaultMobile from "./VaultMobile";
import VaultButton from "./VaultButton";
import { Terms } from "../styles";
import VaultStakeModal from "./VaultStakeModal";

const Coin = styled.span`
  color: #65647e;
  font-size: 11px;
  margin: 0 5px 0 4px;
`;

const Value = styled(Typography)`
  font-weight: 600;
  display: flex;
  align-items: center;
  white-space: nowrap;
  justify-content: center;
`;

const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    background: linear-gradient(289.8deg, #149cad 0%, #4540c1 100%);
    border-radius: 6px;

    ${({ theme }) =>
      theme.palette.type === "light" &&
      css`
        background: linear-gradient(
          121.21deg,
          #a600fb 10.7%,
          #6f06fc 31.3%,
          #4959f5 60.13%,
          #2e8ddf 76.19%,
          #12c1c9 89.78%
        );
      `}
  }
`;

const StyledTab = styled(Tab)`
  text-transform: none;
  font-weight: 600;
`;

const StyledVaultDepositButton = styled.div`
  button {
    width: 100%;
  }
`;

const VaultView = ({ isOpen }: { isOpen: boolean }) => {
  const intl = useIntl();
  const [vaultOffers, setVaultOffers] = useState<VaultOffer[]>(null);
  const [selectedVaultOffer, setSelectedVaultOffer] = useState<VaultOffer>(null);
  const [selectedStakeVault, setSelectedStakeVault] = useState<VaultOffer>(null);
  const [depositCoin, setDepositCoin] = useState<string>(null);
  const { walletBalance, setWalletBalance } = useContext(PrivateAreaContext);
  const [coins, setCoins] = useState<WalletCoins>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tab, setTab] = useState(0);
  const [updateAt, setUpdateAt] = useState(null);

  useEffect(() => {
    if (isOpen) {
      tradeApi.getWalletCoins().then((response) => {
        setCoins(response);
      });

      tradeApi.getWalletBalance().then((response) => {
        setWalletBalance(response);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setVaultOffers(null);
      tradeApi.getVaultOffers({ status: tab === 0 ? "active" : "expired" }).then((response) => {
        setVaultOffers(response);
      });
    }
  }, [isOpen, tab, updateAt]);

  const columns = useMemo(
    () =>
      tab === 0
        ? [
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
              tooltip: intl.formatMessage({ id: "vault.minBalance.tooltip" }),
            },
            {
              Header: intl.formatMessage({ id: "vault.apr" }),
              accessor: "earn",
              tooltip: intl.formatMessage({ id: "vault.apr.tooltip" }),
            },
            {
              Header: intl.formatMessage({ id: "vault.stakingStats" }),
              accessor: "startDate",
              tooltip: intl.formatMessage({ id: "vault.stakingStats.tooltip" }),
            },
            {
              Header: intl.formatMessage({ id: "vault.paymentStarts" }),
              accessor: "distributionDate",
              tooltip: intl.formatMessage({ id: "vault.paymentStarts.tooltip" }),
            },
            {
              Header: intl.formatMessage({ id: "vault.ends" }),
              accessor: "endDate",
            },
            {
              Header: "",
              accessor: "actions",
            },
          ]
        : [
            {
              Header: "",
              accessor: "rewards",
            },
            {
              Header: intl.formatMessage({ id: "vault.offer" }),
              accessor: "offer",
            },
            {
              Header: intl.formatMessage({ id: "vault.minBalance" }),
              accessor: "minBalance",
              tooltip: intl.formatMessage({ id: "vault.minBalance.tooltip" }),
            },
            {
              Header: intl.formatMessage({ id: "vault.apr" }),
              accessor: "earn",
              tooltip: intl.formatMessage({ id: "vault.apr.tooltip" }),
            },
            {
              Header: intl.formatMessage({ id: "vault.stakingStats" }),
              accessor: "startDate",
              tooltip: intl.formatMessage({ id: "vault.stakingStats.tooltip" }),
            },
            {
              Header: intl.formatMessage({ id: "vault.paymentStarts" }),
              accessor: "distributionDate",
              tooltip: intl.formatMessage({ id: "vault.paymentStarts.tooltip" }),
            },
            {
              Header: intl.formatMessage({ id: "vault.ended" }),
              accessor: "endDate",
            },
          ],
    [tab],
  );

  const data = useMemo(
    () =>
      vaultOffers &&
      walletBalance &&
      vaultOffers.map((v) => ({
        rewards: (
          <AlignCenter>
            {tab === 0 ? (
              <RewardsProgressBar
                amount={v.rewardsTotal}
                coin={v.coinReward}
                progress={((v.rewardsTotal - v.rewardsRemaining) / v.rewardsTotal) * 100}
              />
            ) : (
              <CoinIcon coin={v.coinReward} />
            )}
          </AlignCenter>
        ),
        offer: (
          <AlignCenter>
            <Typography style={{ fontWeight: 600 }}>
              <FormattedMessage
                id={v.type === "stake" ? "wallet.staking.earnStake" : "wallet.staking.earn"}
                values={{
                  coin: v.coin,
                  reward: v.coinReward,
                  amount: <NumberFormat displayType="text" value={v.minBalance} />,
                }}
              />
              &nbsp;
              <Terms onClick={() => setSelectedVaultOffer(v)}>
                <FormattedMessage id="vault.terms" />
                <ChevronRight />
              </Terms>
            </Typography>
          </AlignCenter>
        ),
        minBalance: (
          <Value>
            <NumberFormat displayType="text" value={v.minBalance} />
            <Coin>{v.coin}</Coin>
            <CoinIcon width={16} height={16} coin={v.coin} />
          </Value>
        ),
        earn: <Value>{v.apr}%</Value>,
        startDate: <Value>{dayjs(v.startDate).format("MMM D, YYYY")}</Value>,
        distributionDate: <Value>{dayjs(v.distributionDate).format("MMM D, YYYY")}</Value>,
        endDate: <Value>{dayjs(v.endDate).format("MMM D, YYYY")}</Value>,
        actions: (
          <StyledVaultDepositButton>
            <VaultButton
              vault={v}
              balance={walletBalance[v.coin]?.availableBalance || 0}
              onDeposit={() => setDepositCoin(v.coin)}
              onStake={() => setSelectedStakeVault(v)}
              depositEnabled={coins && coins[v.coin]?.allowDeposit}
            />
          </StyledVaultDepositButton>
        ),
      })),
    [vaultOffers, tab, walletBalance, coins],
  );

  return (
    <>
      {selectedVaultOffer && (
        <VaultOfferModal
          onClose={() => setSelectedVaultOffer(null)}
          open={true}
          vault={selectedVaultOffer}
        />
      )}
      {depositCoin && (
        <Modal
          onClose={() => setDepositCoin(null)}
          newTheme={true}
          persist={false}
          size="medium"
          state={true}
        >
          <WalletDepositView coins={coins} coin={depositCoin} />
        </Modal>
      )}
      {selectedStakeVault && (
        <VaultStakeModal
          onClose={() => setSelectedStakeVault(null)}
          onSuccess={() => {
            setUpdateAt(new Date());
            setSelectedStakeVault(null);
          }}
          open={true}
          vaultProject={selectedStakeVault}
          coins={coins}
          onDepositMore={() => setDepositCoin(selectedStakeVault.coin)}
          onOpenOffer={() => setSelectedVaultOffer(selectedStakeVault)}
        />
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
      <Box mt="28px">
        {data && walletBalance && coins ? (
          <>
            <StyledTabs onChange={(e, v) => setTab(v)} value={tab} style={{ marginBottom: "16px" }}>
              <StyledTab label={<FormattedMessage id="vault.active" />} />
              <StyledTab label={<FormattedMessage id="vault.expired" />} />
            </StyledTabs>
            {isMobile ? (
              <VaultMobile
                vaults={vaultOffers}
                type={tab === 0 ? "active" : "expired"}
                onDeposit={(coin) => setDepositCoin(coin)}
                onStake={(vaultProject) => setSelectedStakeVault(vaultProject)}
                balance={walletBalance}
                coins={coins}
              />
            ) : (
              <TableLayout>
                <Table data={data} columns={columns} />
              </TableLayout>
            )}
          </>
        ) : (
          <Box display="flex" flex={1} justifyContent="center">
            <CircularProgress color="primary" size={40} />
          </Box>
        )}
      </Box>
    </>
  );
};
export default VaultView;
