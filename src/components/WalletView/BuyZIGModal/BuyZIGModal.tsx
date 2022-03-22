import React, { useEffect, useState } from "react";
import CustomModal from "components/Modal";
import { isMobile, Modal, TextDesc, Title } from "styles/styles";
import { FormattedMessage } from "react-intl";
import WalletIcon from "images/wallet/wallet.svg";
import Button from "components/Button";
import styled, { css } from "styled-components";
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import OpenArrowIcon from "images/launchpad/openArrow.inline.svg";
import { buyCryptoURL } from "utils/affiliateURLs";
import DepositUSDT from "./DepositUSDT";
import { useStoreUserSelector } from "hooks/useStoreUserSelector";
import tradeApi from "services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import SwapZIG from "./SwapZIG";
import useActivateSubAccount from "hooks/useActivateSubAccount";
import ExchangesTooltip from "../ExchangesTooltip";
import { getUserData } from "store/actions/user";

const Divider = styled.span`
  background: ${({ theme }) => (theme.palette.mode === "dark" ? "#222249" : "#CCCAEF")};
  width: 1px;
  height: 100%;
  position: absolute;

  ${isMobile(`
    display: none;
  `)}
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  position: relative;
  margin-top: 18px;

  ${isMobile(`
    flex-direction: column;
    align-items: center;
  `)}
`;

const ButtonDesc = styled(Typography)`
  color: ${({ theme }) => theme.newTheme.secondaryText};
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  text-align: center;
  justify-content: space-between;

  ${isMobile(css`
    width: 100%;
    align-items: center;

    &:last-child {
      margin-top: 14px;
    }

    button,
    a {
      width: 200px;
    }
  `)}

  p {
    margin-bottom: 10px;
    font-size: 15px;
  }
`;

interface DepositUSDTChoicesProps {
  accountsBalances: BalanceExchange[];
}

const DepositUSDTChoices = ({ accountsBalances }: DepositUSDTChoicesProps) => {
  const [depositUSDT, showDepositUSDT] = useState(false);

  if (depositUSDT) {
    return <DepositUSDT accountsBalances={accountsBalances} />;
  }

  return (
    <>
      <Title>
        <img src={WalletIcon} width={40} height={40} />
        <FormattedMessage id="wallet.zig.deposit.title" values={{ coin: "USDT" }} />
      </Title>
      <TextDesc>
        <FormattedMessage id="wallet.zig.deposit" values={{ coin: "USDT" }} />
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
      </TextDesc>
      <ButtonsContainer>
        <ButtonBox>
          <ButtonDesc>
            <FormattedMessage id="wallet.zig.deposit.desc" />
          </ButtonDesc>
          <Button onClick={() => showDepositUSDT(true)}>
            <FormattedMessage id="accounts.deposit" />
            &nbsp;USDT
          </Button>
        </ButtonBox>
        <Divider />
        <ButtonBox>
          <ButtonDesc>
            <FormattedMessage id="wallet.zig.buy.desc" />
          </ButtonDesc>
          <Button href={buyCryptoURL} target="_blank" endIcon={<OpenArrowIcon />}>
            <FormattedMessage id="wallet.zig.buyCoin" values={{ coin: "USDT" }} />
          </Button>
        </ButtonBox>
      </ButtonsContainer>
    </>
  );
};

interface BuyZIGModalProps {
  onClose: () => void;
  onDone: () => void;
  open: boolean;
}

const BuyZIGModal = ({ open, onClose, onDone }: BuyZIGModalProps) => {
  const storeUser = useStoreUserSelector();
  const dispatch = useDispatch();
  const [accountsBalances, setAccountsBalances] = useState<BalanceExchange[]>(null);
  const [showDeposit, setShowDeposit] = useState(null);
  const [creating, setCreating] = useState(false);
  const [reloadBalance, setReloadBalance] = useState(null);

  const zignalyExchangeAccounts = storeUser.userData.exchanges.filter(
    (e) => e.exchangeName.toLowerCase() === "zignaly",
  );
  const zignalyExchangeAccountsActivated = zignalyExchangeAccounts.filter((e) => e.activated);

  // Activate default zignaly exchange account if needed
  const accountToActivate = zignalyExchangeAccounts.find((a) => !a.activated);
  useActivateSubAccount(accountToActivate, () => {
    setReloadBalance(new Date());
  });

  const fetchBalances = async () => {
    if (!zignalyExchangeAccountsActivated.length) {
      // No zignaly exchange account
      return;
    }

    const res = [] as BalanceExchange[];

    await Promise.all(
      zignalyExchangeAccountsActivated.map(async (account) => {
        return await tradeApi
          .exchangeAssetsGet({ internalId: account.internalId })
          .then((data) => {
            res.push({
              exchangeId: account.internalId,
              balance: parseFloat(data.USDT.balanceFree),
              networks: data.USDT.networks,
              name: account.internalName,
            });
          })
          .catch((e) => {
            dispatch(showErrorAlert(e));
          });
      }),
    );
    setAccountsBalances(res);
    const hasUSDT = res.find((a) => a.balance > 0);
    setShowDeposit(!hasUSDT);
  };

  useEffect(() => {
    fetchBalances();
  }, [storeUser.userData.exchanges, reloadBalance]);

  // Create a new zignaly exchange account
  const createExchangeAccount = () => {
    setCreating(true);
    tradeApi
      .exchangeAdd({
        exchangeId: "5e662c1c3e3b24c186ed9c24",
        internalName: "My Account",
        exchangeType: "spot",
      })
      .then(() => {
        dispatch(getUserData(true));
      })
      .catch(() => {
        setCreating(false);
      });
  };

  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <Modal>
        {!zignalyExchangeAccounts.length ? (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Typography>
              <FormattedMessage id="wallet.zig.createAccount" />
            </Typography>
            <Button
              onClick={createExchangeAccount}
              style={{ marginTop: "24px" }}
              loading={creating}
            >
              <FormattedMessage id="action.continue" />
            </Button>
          </Box>
        ) : !zignalyExchangeAccountsActivated.length || showDeposit === null ? (
          <CircularProgress color="primary" size={40} style={{ margin: "0 auto" }} />
        ) : showDeposit ? (
          <DepositUSDTChoices accountsBalances={accountsBalances} />
        ) : (
          <SwapZIG
            coinFrom="USDT"
            coinTo="ZIG"
            accountsBalances={accountsBalances}
            onDepositMore={() => setShowDeposit(true)}
            onDone={onDone}
          />
        )}
      </Modal>
    </CustomModal>
  );
};
export default BuyZIGModal;
