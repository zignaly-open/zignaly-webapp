import React, { useEffect, useState } from "react";
import WalletIcon from "images/wallet/wallet.svg";
import { FormattedMessage } from "react-intl";
import { isMobile, Label, Modal, TextDesc, Title } from "styles/styles";
import styled, { css } from "styled-components";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import tradeApi from "services/tradeApiClient";
import CustomButton from "components/CustomButton";
import NumberFormat from "react-number-format";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import useInterval from "hooks/useInterval";
import { getChainIcon } from "utils/chain";
import CustomModal from "components/Modal";
import TwoFAForm from "components/Forms/TwoFAForm";
import { useStoreUserData } from "hooks/useStoreUserSelector";

const Button = styled(CustomButton)`
  margin-right: 8px;
  min-width: 121px;
`;

const AmountBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #413ba0;
  padding: 16px;
  border-radius: 16px;
  box-sizing: border-box;
  position: relative;

  &:first-child {
    margin-right: 16px;
  }

  ${(props) =>
    props.primary &&
    css`
      height: 120px;

      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        padding: 2px;
        background: linear-gradient(312.12deg, #8671f7 14.16%, #7ec9f9 83.59%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
        mask-composite: exclude;
      }
    `}
`;

const AmountLabel = styled(Typography)`
  color: ${(props) => props.theme.newTheme.purple};
  font-weight: 600;
  font-size: ${(props) => (props.big ? "20px" : "12px")};
  margin-bottom: 8px;
`;

const Coin = styled(Typography)`
  color: ${(props) => props.theme.newTheme.purple};
  margin-left: 4px;
  font-weight: 600;
  font-size: ${(props) => (props.big ? "32px" : "18px")};
  line-height: 24px;
`;

const AmountTypography = styled(Typography)`
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;

  ${(props) =>
    props.big &&
    css`
      line-height: 60px;
      font-size: 48px;
    `}

  margin-left: 4px;
`;

const StyledPanel = styled.div`
  background-color: ${({ theme }) => theme.newTheme.backgroundAltColor};
  color: ${(props) => props.theme.newTheme.secondaryText};
  border: 1px dashed ${({ theme }) => (theme.palette.type === "dark" ? "#5A51F5" : "#996BDE")};
  padding: 20px 35px;
  margin-top: 16px;
  border-radius: 8px;
`;
interface WalletWithdrawConfirmProps {
  address: string;
  memo: string;
  amount: string;
  network: string;
  networkName: string;
  coin: WalletCoin;
  onClose: () => void;
  onCancel: () => void;
}

const WalletWithdrawConfirm = ({
  address,
  amount,
  onClose,
  onCancel,
  network,
  networkName,
  coin,
  memo,
}: WalletWithdrawConfirmProps) => {
  const [fee, setFee] = useState<GetNetworkFeeRes>(null);
  const dispatch = useDispatch();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const amountReceived = fee ? parseFloat(amount) - parseFloat(fee.floatFee) : 0;
  const userData = useStoreUserData();
  const [twoFAModal, showTwoFAModal] = useState(false);

  const loadFee = () => {
    if (!done) {
      tradeApi
        .getNetworkFee({ network, currency: coin.name })
        .then((response) => {
          setFee(response);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };
  useEffect(loadFee, []);
  useInterval(loadFee, 7500, false);

  const withdraw = (code?: string) => {
    setLoading(true);

    tradeApi
      .walletWithdraw({
        network,
        currency: coin.name,
        address,
        amount,
        fee: fee.key,
        memo,
        ...(code && { code }),
      })
      .then(() => {
        setDone(true);
        showTwoFAModal(false);
      })
      .catch((e) => {
        setLoading(false);
        dispatch(showErrorAlert(e));
      });
  };

  const check2FA = () => {
    if (userData.ask2FA) {
      showTwoFAModal(true);
    } else {
      withdraw();
    }
  };

  const CoinAmount = ({ value, big = false }: { value: string; big?: boolean }) => (
    <Box display="flex" flexDirection="row" alignItems="center">
      <AmountTypography big={big}>
        <NumberFormat
          value={value}
          displayType="text"
          thousandSeparator={true}
          decimalScale={coin.decimals}
        />
      </AmountTypography>
      <Coin big={big}>{coin.name}</Coin>
    </Box>
  );

  return (
    <Modal>
      <CustomModal
        onClose={() => showTwoFAModal(false)}
        persist={false}
        size="small"
        state={twoFAModal}
      >
        <TwoFAForm onComplete={withdraw} />
      </CustomModal>
      <Title>
        <img src={WalletIcon} width={40} height={40} />
        {!done ? (
          <FormattedMessage id="wallet.withdraw.confirm" />
        ) : (
          <FormattedMessage id="wallet.withdraw.sent" />
        )}
      </Title>
      <TextDesc>
        {done ? (
          <FormattedMessage id="wallet.withdraw.sent.desc" />
        ) : (
          <FormattedMessage id="wallet.withdraw.confirm.desc" values={{ coin: "ZIG" }} />
        )}
      </TextDesc>
      <br />
      {!done ? (
        <>
          <Label>
            <FormattedMessage id="wallet.withdraw.network" />
          </Label>
          <Box display="flex" mt="16px" alignItems="center">
            <img width={64} height={64} src={getChainIcon(network)} />
            <Typography style={{ fontSize: "24px", marginLeft: "16px" }}>{networkName}</Typography>
          </Box>
          <Label style={{ marginTop: "24px" }}>
            <FormattedMessage id="wallet.withdraw.address" />
          </Label>
          <StyledPanel>{address}</StyledPanel>
          <Box display="flex" mt="64px" mb="16px">
            <AmountBox flex={2}>
              <AmountLabel>
                <FormattedMessage id="wallet.withdraw.amount" />
              </AmountLabel>
              <CoinAmount value={amount} />
            </AmountBox>
            <AmountBox flex={1}>
              <AmountLabel>
                <FormattedMessage id="wallet.withdraw.fee" />
              </AmountLabel>
              {fee ? (
                <CoinAmount value={fee.floatFee} />
              ) : (
                <CircularProgress size={21} style={{ margin: "0 auto" }} />
              )}
            </AmountBox>
          </Box>
          <AmountBox primary>
            <AmountLabel big={true}>
              <FormattedMessage id="wallet.withdraw.receive" />
            </AmountLabel>
            {fee ? (
              <CoinAmount big={true} value={amountReceived} />
            ) : (
              <CircularProgress size={21} style={{ margin: "0 auto" }} />
            )}
          </AmountBox>
          <Box display="flex" flexDirection="row" mt="64px">
            <Button className="textPurple borderPurple" onClick={onCancel}>
              <FormattedMessage id="accounts.back" />
            </Button>
            <Button
              className="bgPurple"
              onClick={check2FA}
              disabled={amountReceived <= 0}
              loading={loading}
            >
              <FormattedMessage id="wallet.withdraw.now" />
            </Button>
          </Box>
        </>
      ) : (
        <Box display="flex" flexDirection="row" mt="8px">
          <Button className="bgPurple" onClick={onClose}>
            {/* <FormattedMessage id="wallet.withdraw.view" /> */}
            <FormattedMessage id="accounts.done" />
          </Button>
        </Box>
      )}
    </Modal>
  );
};
export default WalletWithdrawConfirm;
