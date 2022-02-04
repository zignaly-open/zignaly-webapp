import React, { useEffect, useState } from "react";
import CustomModal from "components/Modal";
import { isMobile, Modal, TextDesc, Title } from "styles/styles";
import { FormattedMessage } from "react-intl";
import WalletIcon from "images/wallet/wallet.svg";
import Button from "components/Button";
import styled, { css } from "styled-components";
import { CircularProgress, Typography } from "@material-ui/core";
import OpenArrowIcon from "images/launchpad/openArrow.inline.svg";
import { buyCryptoURL } from "utils/affiliateURLs";
import DepositUSDT from "./DepositUSDT";
import { useStoreUserSelector } from "hooks/useStoreUserSelector";
import tradeApi from "services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import SwapZIG from "./SwapZIG";

const Divider = styled.span`
  background: ${({ theme }) => (theme.palette.type === "dark" ? "#222249" : "#CCCAEF")};
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
            <FormattedMessage id="zigpad.buy" />
            &nbsp;USDT
          </Button>
        </ButtonBox>
      </ButtonsContainer>
    </>
  );
};

interface BuyZIGModalProps {
  onClose: () => void;
  open: boolean;
}

const BuyZIGModal = ({ open, onClose }: BuyZIGModalProps) => {
  const storeUser = useStoreUserSelector();
  const dispatch = useDispatch();
  const [accountsBalances, setAccountsBalances] = useState<BalanceExchange[]>(null);
  const hasUSDT = accountsBalances && accountsBalances.find((a) => a.balance > 0);

  const fetchBalances = async () => {
    const zignalyExchangeAccounts = storeUser.userData.exchanges.filter(
      (e) => e.exchangeName.toLowerCase() === "zignaly",
    );

    const res = await Promise.all(
      zignalyExchangeAccounts.map(async (account) => {
        return await tradeApi
          .exchangeAssetsGet({ internalId: account.internalId })
          .then((data) => {
            return {
              exchangeId: account.internalId,
              balance: parseFloat(data.USDT.balanceFree),
              networks: data.USDT.networks,
              name: account.internalName,
            };
          })
          .catch((e) => {
            dispatch(showErrorAlert(e));
          });
      }),
    );
    setAccountsBalances(res);
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <Modal>
        {accountsBalances === null ? (
          <CircularProgress color="primary" size={40} />
        ) : !hasUSDT ? (
          <DepositUSDTChoices accountsBalances={accountsBalances} />
        ) : (
          <SwapZIG coinFrom="USDT" coinTo="ZIG" accountsBalances={accountsBalances} />
        )}
      </Modal>
    </CustomModal>
  );
};
export default BuyZIGModal;
