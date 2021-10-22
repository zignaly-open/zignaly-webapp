import React, { useEffect, useState } from "react";
import WalletIcon from "images/wallet/wallet.svg";
import ZigCoinIcon from "images/wallet/zignaly-coin.svg";
import { FormattedMessage } from "react-intl";
import { Modal, Panel, SubTitle, TextDesc, Title } from "styles/styles";
import styled from "styled-components";
import { Box, OutlinedInput } from "@material-ui/core";
import tradeApi from "services/tradeApiClient";
import CustomButton from "components/CustomButton";
import CustomSelect from "components/CustomSelect";
import DepositQRCodes from "components/ConnectExchangeView/ExchangeAccountBalanceManagement/Deposit/DepositQRCodes";

const WalletDepositView = () => {
  const coin = "ZIG";
  const [networks, setNetworks] = useState<WalletNetwork[]>([]);
  const networkOptions = networks.map((n) => n.network);
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState<WalletAddress>(null);

  // const onNetworkChange = (selectedNetwork) => {
  //   console.log(selectedNetwork);
  // };

  useEffect(() => {
    tradeApi.getWalletCoins().then((response) => {
      const coinData = response[coin];
      if (coinData) {
        setNetworks(coinData.networks);
        // Select first option
        setNetwork(coinData.networks[0].network);
      }
    });
  }, []);

  useEffect(() => {
    if (network) {
      tradeApi.getWalletDepositAddress(network, coin).then((response) => {
        setAddress(response);
      });
    }
  }, [network]);

  return (
    <Modal p={5}>
      <Title>
        <Box alignItems="center" display="flex">
          <img height="30px" src={WalletIcon} width="33px" />
          <FormattedMessage id="accounts.deposit" /> ZIG
        </Box>
      </Title>
      <TextDesc>
        <FormattedMessage id="wallet.deposit.desc" values={{ coin: "ZIG" }} />
      </TextDesc>
      <br />
      <CustomSelect
        labelPlacement="top"
        onChange={setNetwork}
        options={networkOptions}
        value={network}
      />
      <br />
      <OutlinedInput className="customInput" readOnly value={address?.address} />
      <br />
      <FormattedMessage id="wallet.deposit.caution" />
      <FormattedMessage id="wallet.deposit.notsure" />
      {address && <DepositQRCodes address={{ ...address, tag: address.memo }} />}
    </Modal>
  );
};
export default WalletDepositView;
