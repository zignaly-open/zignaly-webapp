import React, { useEffect, useState } from "react";
import WalletIcon from "images/wallet/wallet.svg";
import { FormattedMessage } from "react-intl";
import { Input, isMobile, Label, Modal, TextDesc, Title } from "styles/styles";
import styled from "styled-components";
import { Box, CircularProgress, IconButton, OutlinedInput, Typography } from "@material-ui/core";
import ZignalyIcon from "images/exchanges/zignaly.svg";
import CopyIcon from "images/exchangeAccount/copy.svg";
import useClipboard from "hooks/useClipboard";
import QRCode from "qrcode.react";
import { ErrorOutlineOutlined, FileCopyOutlined } from "@material-ui/icons";
import { Control } from "../styles";
import Select from "../Select";
import { getChainIcon } from "utils/chain";
import CoinIcon from "../CoinIcon";
import { NetworkCautionMessage } from "../WalletDepositView";
import useExchangeDepositAddress from "hooks/useExchangeDepositAddress";
import { CoinNetwork } from "services/tradeApiClient.types";

const CopyButton = styled(FileCopyOutlined)`
  cursor: pointer;
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

interface BalanceExchange {
  exchangeId: string;
  name: string;
  balance: number;
  networks: CoinNetwork[];
}

interface DepositUSDTProps {
  accountsBalances: BalanceExchange[];
  coin?: string;
}

const DepositUSDT = ({ accountsBalances, coin = "USDT" }: DepositUSDTProps) => {
  const networkOptions = accountsBalances[0].networks.map((n) => ({
    value: n.network,
    label: n.name,
    icon: getChainIcon(n.network),
  }));
  const [network, setNetwork] = useState("");
  const networkData = accountsBalances[0].networks.find((n) => n.network === network);
  const copyToClipboard = useClipboard();
  const [internalId, setInternalId] = useState(null);
  const address = useExchangeDepositAddress(internalId, coin, networkData);
  const exchangeOptions = accountsBalances.map((a) => ({
    value: a.exchangeId,
    label: a.name,
    icon: ZignalyIcon,
  }));

  return (
    <Modal>
      <Title>
        <img src={WalletIcon} width={40} height={40} />
        <FormattedMessage id="accounts.deposit" /> {coin}
      </Title>
      <TextDesc>
        <FormattedMessage id="wallet.zig.deposit.subtitle" values={{ coin }} />
      </TextDesc>
      <Control>
        <Label>
          <FormattedMessage id="transfer.internal.coin" />
        </Label>
        <Box display="flex" alignItems="center" pt="2px">
          <CoinIcon width={32} height={32} coin={coin} />
          <TypographyToken>{coin}</TypographyToken>
        </Box>
      </Control>
      <Control>
        <Label>
          <FormattedMessage id="wallet.zig.deposit.exchangeaccount" />
        </Label>
        <Select
          values={exchangeOptions}
          fullWidth
          value={internalId}
          handleChange={(e) => setInternalId(e.target.value)}
        />
      </Control>
      <Control>
        <Label>
          <FormattedMessage id="deposit.network" />
        </Label>
        <Select
          values={networkOptions}
          fullWidth
          value={network}
          handleChange={(e) => setNetwork(e.target.value)}
        />
      </Control>
      {address?.tag && (
        <Control>
          <Label>
            <FormattedMessage id="wallet.withdraw.memo" />
          </Label>
          <OutlinedInput
            className="customInput"
            readOnly
            value={address.tag}
            endAdornment={
              <CopyButton
                alt="copy"
                className="copy"
                onClick={() => copyToClipboard(address.tag, "deposit.memo.copied")}
                src={CopyIcon}
                width={24}
                height={24}
              />
            }
          />
          <QRCodeContainer>
            <QRCode size={200} value={address.tag} />
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
                  <IconButton
                    aria-label="Copy"
                    onClick={() => copyToClipboard(address.address, "deposit.address.copied")}
                  >
                    <FileCopyOutlined width={24} height={24} />
                  </IconButton>
                }
              />
              {networkData && <NetworkCautionMessage network={networkData.name} coin={coin} />}
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
export default DepositUSDT;
