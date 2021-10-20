import React, { useEffect, useState } from "react";
import WalletIcon from "images/wallet/wallet.svg";
import ZigCoinIcon from "images/wallet/zignaly-coin.svg";
import { FormattedMessage } from "react-intl";
import { Panel, SubTitle, Title } from "styles/styles";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import tradeApi from "services/tradeApiClient";
import CustomButton from "components/CustomButton";
import Modal from "components/Modal";
import WalletDepositView from "./WalletDepositView";

const TitleIcon = styled.img`
  /* background: linear-gradient(
    121.21deg,
    #a600fb 10.7%,
    #6f06fc 31.3%,
    #4959f5 60.13%,
    #2e8ddf 76.19%,
    #12c1c9 89.78%
  ); */
`;

const CategIconStyled = styled.img`
  /* height: 30px; */
  margin: 31px 14px 0 0;
`;

const ArrowIcon = styled.img`
  background: green;
  height: 30px;
  margin-right: 14px;
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
  color: #f3f4f6;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: 0.66px;
  line-height: 40px;
`;

const Zig = styled.span`
  color: #9864ef;
  font-size: 12px;
  letter-spacing: 1px;
  line-height: 16px;
`;

const Button = styled(CustomButton)`
  margin-right: 8px;
  min-width: 121px;
`;

// const PanelStyled = styled(Panel)`
//   margin-bottom: 20px;
// `;

const WalletView = () => {
  const [path, setPath] = useState("");
  useEffect(() => {
    tradeApi.getWalletBalance().then((response) => {
      console.log(response);
    });

    tradeApi.getWalletCoins().then((response) => {
      console.log(response);
    });
  }, []);

  return (
    <Box p={5}>
      <Modal
        // onClose={() => dispatch(showCreateTrader(false))}
        onClose={() => setPath("")}
        persist={false}
        size="large"
        state={path === "deposit"}
      >
        <WalletDepositView />
      </Modal>
      <Title>
        <Box display="flex" alignItems="center">
          <TitleIcon width="33px" height="30px" src={WalletIcon} />
          <FormattedMessage id="wallet.zig" />
        </Box>
      </Title>
      <Panel display="flex" mt="20px" p="40px">
        <CategIconStyled width={32} height={32} src={ZigCoinIcon} />
        <Box display="flex" flexDirection="column">
          <SubTitle>
            <FormattedMessage id="wallet.totalbalance" />
          </SubTitle>
          <Amount>1,200,000 ZIG</Amount>
          <div>
            $45,000
            <Rate>@0.00375/ZIG</Rate>
            <ArrowIcon width={32} height={32} src={WalletIcon} />
          </div>
          <Box display="flex" flexDirection="row">
            600,000 <Zig>ZIG</Zig>
          </Box>
          <Box display="flex" flexDirection="row">
            <Button className="textPurple borderPurple" href="#exchangeAccounts">
              <FormattedMessage id="accounts.withdraw" />
            </Button>
            {/* <Button className="bgPurple" href="#deposit"> */}
            <Button className="bgPurple" onClick={() => setPath("deposit")}>
              <FormattedMessage id="accounts.deposit" />
            </Button>
          </Box>
        </Box>
      </Panel>
      <Title>
        <Box display="flex" alignItems="center">
          <TitleIcon width="33px" height="30px" src={WalletIcon} />
          <FormattedMessage id="wallet.transactions" />
        </Box>
      </Title>
    </Box>
  );
};

export default WalletView;
