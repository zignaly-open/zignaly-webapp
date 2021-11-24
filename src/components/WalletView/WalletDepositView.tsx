import React, { useEffect, useState } from "react";
import WalletIcon from "images/wallet/wallet.svg";
import { FormattedMessage } from "react-intl";
import { isMobile, Label, Modal, TextDesc, Title } from "styles/styles";
import styled from "styled-components";
import { Box, CircularProgress, OutlinedInput, Typography } from "@material-ui/core";
import tradeApi from "services/tradeApiClient";
import CustomSelect from "components/CustomSelect";
import CopyIcon from "images/exchangeAccount/copy.svg";
import useClipboard from "hooks/useClipboard";
import QRCode from "qrcode.react";
import InfoIcon from "images/wallet/info.svg";
import { ErrorOutlineOutlined } from "@material-ui/icons";
import { StyledCustomSelect } from "./styles";

const StyledErrorOutlined = styled(ErrorOutlineOutlined)`
  margin-right: 7px;
  color: ${({ theme }) => theme.newTheme.error};
`;

const TypographyError = styled(Typography)`
  color: ${({ theme }) => theme.newTheme.error};
  font-weight: 500;
  font-size: 12px;
`;

const NotSure = styled.a`
  margin-left: 17px;
  font-weight: 600;
  font-size: 12px;
  text-decoration: none;
  color: ${({ theme }) => theme.newTheme.linkText};
`;

const CopyButton = styled.img`
  cursor: pointer;
`;

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 48px;

  ${isMobile(`
    margin: 34px 40px;
  `)}
`;

export const NetworkCautionMessage = ({ network, coin }: { network: string; coin: string }) =>
  network && (
    <Box display="flex" alignItems="center" mt={2}>
      <StyledErrorOutlined width={24} height={24} />
      <TypographyError>
        <FormattedMessage id="wallet.deposit.caution" values={{ coin, network }} />
      </TypographyError>
      <NotSure href="https://help.zignaly.com" target="_blank">
        <FormattedMessage id="wallet.deposit.notsure" />
      </NotSure>
    </Box>
  );

interface WalletDepositViewProps {
  coins: WalletCoins;
  coin: string;
}

const WalletDepositView = ({ coins, coin }: WalletDepositViewProps) => {
  console.log("depo");
  const [selectedCoin, setSelectedCoin] = useState(coin || "ZIG");
  const coinData = coins ? coins[selectedCoin] : null;
  const networkOptions = coinData ? coinData.networks.map((n) => n.network) : [];
  const coinsOptions = ["ZIG", "BNB", "BTC", "BUSD", "ETH"];
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState<WalletAddress>(null);
  const copyToClipboard = useClipboard();

  useEffect(() => {
    if (coinData) {
      // Select first option
      setNetwork(coinData.networks[0].network);
    }
  }, [coinData]);

  useEffect(() => {
    if (network) {
      setAddress(null);
      tradeApi.getWalletDepositAddress(network, selectedCoin).then((response) => {
        setAddress(response);
      });
    }
  }, [network]);

  return (
    <Modal p={5}>
      <Title>
        <img src={WalletIcon} width={40} height={40} />
        <FormattedMessage id="accounts.deposit" /> {selectedCoin}
      </Title>
      <TextDesc>
        <FormattedMessage id="wallet.deposit.desc" values={{ coin: selectedCoin }} />
      </TextDesc>
      {!coin && (
        <StyledCustomSelect>
          <CustomSelect
            labelPlacement="top"
            onChange={setSelectedCoin}
            options={coinsOptions}
            value={selectedCoin}
            label={<FormattedMessage id="deposit.selectcoin" />}
          />
        </StyledCustomSelect>
      )}
      <Box style={{ margin: "24px 0 12px" }}>
        <StyledCustomSelect>
          <CustomSelect
            labelPlacement="top"
            onChange={setNetwork}
            options={networkOptions}
            value={network}
            label={<FormattedMessage id="deposit.network" />}
          />
        </StyledCustomSelect>
        {network && <NetworkCautionMessage network={network} coin={selectedCoin} />}
      </Box>
      {address?.memo && (
        <>
          <Label style={{ marginTop: "24px" }}>
            <FormattedMessage id="withdraw.memo" />
          </Label>
          <OutlinedInput
            className="customInput"
            readOnly
            value={address.memo}
            endAdornment={
              <CopyButton
                alt="copy"
                className="copy"
                onClick={() => copyToClipboard(address.memo, "deposit.memo.copied")}
                src={CopyIcon}
                width={24}
                height={24}
              />
            }
          />
          <QRCodeContainer>
            <QRCode size={200} value={address.memo} />
          </QRCodeContainer>
        </>
      )}
      <Label style={{ marginTop: "24px" }}>
        <FormattedMessage id="deposit.address" />
      </Label>
      {address ? (
        <>
          <OutlinedInput
            className="customInput"
            readOnly
            value={address.address}
            endAdornment={
              <CopyButton
                alt="copy"
                className="copy"
                onClick={() => copyToClipboard(address.address, "deposit.address.copied")}
                src={CopyIcon}
                width={24}
                height={24}
              />
            }
          />
          <QRCodeContainer>
            <QRCode size={200} value={address.address} />
          </QRCodeContainer>
        </>
      ) : (
        <CircularProgress size={21} style={{ margin: "0 auto" }} />
      )}
    </Modal>
  );
};
export default WalletDepositView;
