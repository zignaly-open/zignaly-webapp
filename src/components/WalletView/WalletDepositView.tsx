import React, { useEffect, useState } from "react";
import WalletIcon from "images/wallet/wallet.svg";
import ZigCoinIcon from "images/wallet/zignaly-coin.svg";
import { FormattedMessage } from "react-intl";
import { Label, Modal, Panel, SubTitle, TextDesc, Title } from "styles/styles";
import styled from "styled-components";
import { Box, CircularProgress, OutlinedInput, Typography } from "@material-ui/core";
import tradeApi from "services/tradeApiClient";
import CustomButton from "components/CustomButton";
import CustomSelect from "components/CustomSelect";
import DepositQRCodes from "components/ConnectExchangeView/ExchangeAccountBalanceManagement/Deposit/DepositQRCodes";
import { TitleIcon } from "./styles";
import CopyIcon from "images/exchangeAccount/copy.svg";
import useClipboard from "hooks/useClipboard";
import QRCode from "qrcode.react";

const StyledCustomSelect = styled.div`
  margin-top: 64px;

  .selectLabel {
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 2px;
  }

  .customSelect {
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .customSelectControl {
    width: 100%;
  }
`;

const CopyButton = styled.img`
  cursor: pointer;
`;

interface WalletDepositViewProps {
  coins: WalletCoins;
}

const WalletDepositView = ({ coins }: WalletDepositViewProps) => {
  const coin = "ZIG";
  const [networks, setNetworks] = useState<WalletNetwork[]>([]);
  const networkOptions = networks.map((n) => n.network);
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState<WalletAddress>(null);
  const copyToClipboard = useClipboard();

  // const onNetworkChange = (selectedNetwork) => {
  //   console.log(selectedNetwork);
  // };

  useEffect(() => {
    // tradeApi.getWalletCoins().then((response) => {
    if (!coins) return;

    const coinData = coins[coin];
    if (coinData) {
      setNetworks(coinData.networks);
      // Select first option
      setNetwork(coinData.networks[0].network);
    }
    // });
  }, [coins]);

  useEffect(() => {
    if (network) {
      setAddress(null);
      tradeApi.getWalletDepositAddress(network, coin).then((response) => {
        setAddress(response);
      });
    }
  }, [network]);

  const copyAddress = () => {
    copyToClipboard(address?.address, "deposit.address.copied");
  };

  return (
    <Modal p={5}>
      <Title>
        <Box alignItems="center" display="flex">
          <TitleIcon height="30px" src={WalletIcon} width="33px" />
          <FormattedMessage id="accounts.deposit" /> ZIG
        </Box>
      </Title>
      <TextDesc>
        <FormattedMessage id="wallet.deposit.desc" values={{ coin: "ZIG" }} />
      </TextDesc>
      <br />
      <StyledCustomSelect>
        <CustomSelect
          labelPlacement="top"
          onChange={setNetwork}
          options={networkOptions}
          value={network}
          label={<FormattedMessage id="deposit.network" />}
        />
      </StyledCustomSelect>
      <Label>
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
                onClick={copyAddress}
                src={CopyIcon}
                width={24}
                height={24}
              />
            }
          />
          <Box justifyContent="center" display="flex" mt="68px">
            <QRCode size={200} value={address.address} />

            {/* {address.tag && (
        <Box className="qrCode">
          <Typography variant="body1">
            {address.currency} <FormattedMessage id="withdraw.memo" />
          </Typography>
          <QRCode value={address.tag} />
        </Box>
      )} */}
          </Box>
        </>
      ) : (
        <CircularProgress size={21} style={{ margin: "0 auto" }} />
      )}
      {/* <FormattedMessage id="wallet.deposit.caution" /> */}
      {/* <FormattedMessage id="wallet.deposit.notsure" /> */}
    </Modal>
  );
};
export default WalletDepositView;
