import React, { useCallback, useContext, useEffect, useState } from "react";
import WalletIcon from "images/wallet/wallet.svg";
import ZigCoinIcon from "images/wallet/zignaly-coin.svg";
import ListIcon from "images/wallet/list.svg";
import { FormattedMessage } from "react-intl";
import { Panel, SubTitle, Title } from "styles/styles";
import styled, { css } from "styled-components";
import {
  Button as MuiButton,
  Box,
  ClickAwayListener,
  Tooltip,
  Typography,
} from "@material-ui/core";
import tradeApi from "services/tradeApiClient";
import CustomButton from "components/CustomButton";
import Modal from "components/Modal";
import WalletDepositView from "./WalletDepositView";
import PrivateAreaContext from "context/PrivateAreaContext";
import { ChevronRight } from "@material-ui/icons";
import WalletTransactions from "./WalletTransactions";
import BalanceChain from "./BalanceChain";
import { TitleIcon } from "./styles";

const CategIconStyled = styled.img`
  margin: 31px 14px 0 0;
`;

const StyledPanel = styled(Panel)`
  display: flex;
  justify-content: space-around;
  padding: 40px 0;
`;

const Rate = styled.span`
  color: #65647e;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.66px;
  line-height: 14px;
  margin: 0 8px;
  text-transform: uppercase;
`;

const Amount = styled.span`
  /* color: #f3f4f6; */
  font-size: 32px;
  font-weight: 500;
  letter-spacing: 0.66px;
  line-height: 40px;
`;

const ZigBig = styled.span`
  /* color: #9864ef; */
  color: ${(props) => props.theme.palette.text.secondary};
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 16px;
  margin-left: 6px;
`;

const Zig = styled.span`
  /* color: #9864ef; */
  color: ${(props) => props.theme.palette.text.secondary};
  font-size: 12px;
  letter-spacing: 1px;
  line-height: 16px;
  margin-left: 4px;
`;

const Button = styled(CustomButton)`
  margin-right: 8px;
  min-width: 121px;
`;

const TextMain = styled(Typography)`
  /* color: #9ca3af; */
  font-size: 32px;
  font-weight: 500;
  /* line-height: 40px; */
  letter-spacing: 0.66px;
`;

const TextCaption = styled(Typography)`
  /* color: #f3f4f6; */
  font-size: 16px;
  /* line-height: 20px; */
  letter-spacing: 0.33px;
  margin-top: 20px;
`;

const Divider = styled.span`
  background: ${({ theme }) => (theme.palette.type === "dark" ? "#222249" : "#ACB6FF")};
  width: 1px;
  height: 128px;
  align-self: center;
`;

const ChevronRightStyled = styled(ChevronRight)`
  color: #65647e;
  cursor: pointer;
`;

interface PanelItemProps {
  row?: boolean;
}
const PanelItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: ${(props: PanelItemProps) => (props.row ? "row" : "column")};
  margin: 0 3%;
  max-width: 300px;
  ${(props) =>
    props.row &&
    css`
      justify-content: center;
    `}
`;

const ButtonBuy = styled(MuiButton)`
  display: flex;
  padding: 4px 12px 4px 16px;
  /* box-shadow: 0px 4px 8px -4px rgba(90, 81, 245, 0.25); */
  border-radius: 4px;
  border: 1px solid;
  font-size: 13px;
  border-image: linear-gradient(
    312.12deg,
    rgba(134, 113, 247, 0.33) 14.16%,
    rgba(126, 201, 249, 0.33) 83.59%
  );
  border-image-slice: 1;
  text-transform: none;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  /* background: transparent; */
`;
const StyledTooltip = styled.div`
  .MuiTooltip-tooltip {
    background: #f3f4f6;
    box-shadow: 0px 4px 8px -4px rgba(90, 81, 245, 0.25);
    border-radius: 3px;
    padding: 8px 16px;
  }
`;

// const TooltipContainer = styled((props) => (
//   <Tooltip classes={{ popper: props.className }} {...props} />
// ))`
//   & .MuiTooltip-tooltip {
//     background-color: papayawhip;
//     color: #000;
//   }
// `;

const TooltipContainer = styled.div`
  font-weight: 600;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  a {
    text-decoration: none;
  }
`;

const TypographyTooltip = styled.span`
  color: #0c0d21;
  margin-bottom: 3px;
`;

const RateText = styled.span`
  margin-top: 2px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.newTheme.secondaryText};
  font-weight: 600;
  font-size: 16px;
`;

const WalletView = () => {
  const { walletBalance } = useContext(PrivateAreaContext);
  const [path, setPath] = useState("");
  const [rateZIG, setRateZIG] = useState<number>(null);
  // const [balances, setBalances] = useState<WalletBalance>(null);
  const [coins, setCoins] = useState<WalletCoins>(null);
  const balanceZIG = walletBalance?.ZIG?.total || 0;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  useEffect(() => {
    // tradeApi.getWalletBalance().then((response) => {
    //   setBalances(response);
    // });
    tradeApi.convertPreview({ from: "ZIG", to: "USDT", qty: 1 }).then((response) => {
      setRateZIG(response.lastPrice);
    });

    tradeApi.getWalletCoins().then((response) => {
      setCoins(response);
    });
  }, []);

  const BuyZig = useCallback(
    () => (
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <StyledTooltip>
          <Tooltip
            interactive
            placement="right"
            onClose={handleTooltipClose}
            open={tooltipOpen}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            PopperProps={{
              disablePortal: true,
            }}
            title={
              <TooltipContainer>
                <TypographyTooltip>
                  <FormattedMessage id="wallet.buy.tooltip" />
                </TypographyTooltip>
                <a href="https://ascendex.com" rel="noreferrer" target="_blank">
                  AscendEX &gt;
                </a>
                <a href="https://mexc.com" rel="noreferrer" target="_blank">
                  MEXC &gt;
                </a>
              </TooltipContainer>
            }
          >
            <ButtonBuy onClick={handleTooltipOpen}>
              <FormattedMessage id="wallet.buy" />
              <ChevronRightStyled />
            </ButtonBuy>
          </Tooltip>
        </StyledTooltip>
      </ClickAwayListener>
    ),
    [tooltipOpen],
  );

  return (
    <Box p={5}>
      <Modal
        // onClose={() => dispatch(showCreateTrader(false))}
        onClose={() => setPath("")}
        newTheme={true}
        persist={false}
        size="medium"
        state={path === "deposit"}
      >
        <WalletDepositView coins={coins} />
      </Modal>
      <Title>
        <Box alignItems="center" display="flex">
          <TitleIcon height="30px" src={WalletIcon} width="33px" />
          <FormattedMessage id="wallet.zig" />
        </Box>
      </Title>
      <StyledPanel>
        <PanelItem row>
          <CategIconStyled height={66} src={ZigCoinIcon} width={66} />
          <Box display="flex" flexDirection="column">
            <SubTitle>
              <FormattedMessage id="wallet.totalbalance" />
            </SubTitle>
            <Amount>
              {balanceZIG}
              <ZigBig>ZIG</ZigBig>
            </Amount>
            <RateText>
              ${balanceZIG * rateZIG}
              <Rate>@{rateZIG}/ZIG</Rate>
              {/* <ArrowIcon width={32} height={32} src={WalletIcon} /> */}
            </RateText>
            <BalanceChain coins={coins} walletBalance={walletBalance} />
            <Box display="flex" flexDirection="row" mt={2.25}>
              <Button className="textPurple borderPurple" href="#exchangeAccounts">
                <FormattedMessage id="accounts.withdraw" />
              </Button>
              {/* <Button className="bgPurple" href="#deposit"> */}
              <Button className="bgPurple" onClick={() => setPath("deposit")}>
                <FormattedMessage id="accounts.deposit" />
              </Button>
            </Box>

            {walletBalance && !walletBalance.ZIG && (
              <Box mt={2}>
                <BuyZig />
              </Box>
            )}
          </Box>
        </PanelItem>
        <Divider />
        <PanelItem>
          <SubTitle>
            <FormattedMessage id="wallet.rewards" />
          </SubTitle>
          <TextMain>
            <FormattedMessage id="wallet.rewards.soon" />
          </TextMain>
          <TextCaption>
            <FormattedMessage id="wallet.rewards.soon.desc" />
          </TextCaption>
        </PanelItem>
        <Divider />
        <PanelItem>
          <SubTitle>
            <FormattedMessage id="wallet.staking" />
          </SubTitle>
          <TextMain>
            <FormattedMessage id="wallet.staking.soon" />
          </TextMain>
          <TextCaption>
            <FormattedMessage id="wallet.staking.soon.desc" />
          </TextCaption>
        </PanelItem>
      </StyledPanel>
      <Title>
        <Box alignItems="center" display="flex" mt="64px">
          <TitleIcon height="22px" src={ListIcon} width="27px" />
          <FormattedMessage id="wallet.transactions" />
        </Box>
      </Title>
      <WalletTransactions />
    </Box>
  );
};

export default WalletView;
