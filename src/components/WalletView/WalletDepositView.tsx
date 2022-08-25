import React, { useEffect, useState } from "react";
import WalletIcon from "images/wallet/wallet.svg";
import { FormattedMessage } from "react-intl";
import { Input, isMobile, Label, Modal, TextDesc, Title } from "styles/styles";
import styled from "styled-components";
import { Box, CircularProgress, IconButton, OutlinedInput, Typography } from "@material-ui/core";
import tradeApi from "services/tradeApiClient";
import CopyIcon from "images/exchangeAccount/copy.svg";
import useClipboard from "hooks/useClipboard";
import QRCode from "qrcode.react";
import { ErrorOutlineOutlined, FileCopyOutlined } from "@material-ui/icons";
import { Control } from "./styles";
import Select from "./Select";
import { getChainIcon } from "utils/chain";
import CoinIcon from "./CoinIcon";
import { useTz } from "services/tz";

const StyledErrorOutlined = styled(ErrorOutlineOutlined)`
  margin-right: 7px;
  color: ${({ theme }) => theme.newTheme.error};
`;

const TypographyError = styled(Typography)`
  color: ${({ theme }) => theme.newTheme.error};
  font-weight: 500;
  font-size: 15px;
`;

const NotSure = styled.a`
  margin-left: 17px;
  font-weight: 600;
  font-size: 12px;
  text-decoration: none;
  color: ${({ theme }) => theme.newTheme.linkText};
`;

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 38px;

  ${isMobile(`
    margin: 34px 40px;
  `)}
`;

const TypographyToken = styled(Typography)`
  font-weight: 600;
  margin-left: 8px;
  font-size: 18px;
`;

export const CopyButton = ({ value, success }: { value: string; success: string }) => {
  const copyToClipboard = useClipboard();

  return (
    <IconButton aria-label="Copy" onClick={() => copyToClipboard(value, success)}>
      <FileCopyOutlined width={24} height={24} />
    </IconButton>
  );
};

export const NetworkCautionMessage = ({ network, coin }: { network: string; coin: string }) =>
  network && (
    <Box display="flex" alignItems="center" mt={2}>
      <StyledErrorOutlined width={24} height={24} />
      <TypographyError>
        <FormattedMessage
          id="wallet.deposit.caution"
          values={{
            coin,
            network,
            b: (chunks: string) => <b>{chunks}</b>,
          }}
        />
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
  const track = useTz();
  const [selectedCoin, setSelectedCoin] = useState(coin || "ZIG");
  const coinData = coins ? coins[selectedCoin] : null;
  const networkOptions = coinData
    ? coinData.networks.map((n) => ({
        value: n.network,
        label: n.name,
        icon: getChainIcon(n.network),
      }))
    : [];
  const coinsOptions = coins ? Object.keys(coins) : [];
  const [network, setNetwork] = useState("");
  const networkData = coinData?.networks.find((n) => n.network === network);
  const [address, setAddress] = useState<WalletAddress>(null);

  useEffect(() => {
    if (network) {
      setAddress(null);
      tradeApi.getWalletDepositAddress(network, selectedCoin).then((response) => {
        setAddress(response);
      });
    }
  }, [network]);

  return (
    <Modal>
      <Title>
        <img src={WalletIcon} width={40} height={40} />
        <FormattedMessage id="accounts.deposit" /> {selectedCoin}
      </Title>
      <TextDesc>
        <FormattedMessage id="wallet.deposit.desc" values={{ coin: selectedCoin }} />
      </TextDesc>
      {!coin && (
        <Control>
          <Label>
            <FormattedMessage id="deposit.selectcoin" />
          </Label>
          <Select
            values={coinsOptions}
            fullWidth
            value={selectedCoin}
            handleChange={(e) => setSelectedCoin(e.target.value)}
          />
        </Control>
      )}
      <Control>
        <Label>
          <FormattedMessage id="transfer.internal.coin" />
        </Label>
        <Box display="flex" alignItems="center" pt="2px">
          <CoinIcon width={32} height={32} coin={selectedCoin} />
          <TypographyToken>{selectedCoin}</TypographyToken>
        </Box>
      </Control>
      <Control>
        <Label>
          <FormattedMessage id="deposit.network" />
        </Label>
        <Select
          id="select-network-zig"
          values={networkOptions}
          fullWidth
          value={network}
          handleChange={(e) => {
            track("select-network-zig");
            setNetwork(e.target.value);
          }}
        />
      </Control>
      {address?.memo && (
        <Control>
          <Label>
            <FormattedMessage id="wallet.withdraw.memo" />
          </Label>
          <OutlinedInput
            className="customInput"
            readOnly
            value={address.memo}
            endAdornment={<CopyButton value={address.address} success="deposit.memo.copied" />}
          />
          <QRCodeContainer>
            <QRCode size={200} value={address.memo} />
          </QRCodeContainer>
        </Control>
      )}
      {network && (
        <Control>
          <Label>
            <FormattedMessage id="deposit.address" />
          </Label>
          {address ? (
            <>
              <Input
                readOnly
                fullWidth
                value={address.address}
                endAdornment={
                  <CopyButton value={address.address} success="deposit.address.copied" />
                }
              />
              {networkData && (
                <NetworkCautionMessage network={networkData.name} coin={selectedCoin} />
              )}
              <QRCodeContainer>
                <QRCode size={200} value={address.address} />
              </QRCodeContainer>
            </>
          ) : (
            <CircularProgress size={21} style={{ margin: "0 auto" }} />
          )}
        </Control>
      )}
    </Modal>
  );
};
export default WalletDepositView;
