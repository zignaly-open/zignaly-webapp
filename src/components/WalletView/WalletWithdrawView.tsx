import React, { useEffect, useState } from "react";
import WalletIcon from "images/wallet/wallet.svg";
import { FormattedMessage } from "react-intl";
import { isMobile, Label, Modal, TextDesc, Title } from "styles/styles";
import styled from "styled-components";
import {
  Box,
  CircularProgress,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import tradeApi from "services/tradeApiClient";
import CustomSelect from "components/CustomSelect";
import CopyIcon from "images/exchangeAccount/copy.svg";
import useClipboard from "hooks/useClipboard";
import QRCode from "qrcode.react";
import InfoIcon from "images/wallet/info.svg";
import { ErrorOutlineOutlined } from "@material-ui/icons";
import { NetworkCautionMessage } from "./WalletDepositView";
import { StyledCustomSelect } from "./styles";
import CustomButton from "components/CustomButton";

const AmountInput = styled(OutlinedInput)``;

const Button = styled(CustomButton)`
  margin-right: 8px;
  min-width: 121px;
`;

interface WalletDepositViewProps {
  coins: WalletCoins;
  coin?: string;
}

const WalletWithdrawView = ({ coins, coin = "ZIG", setPath, path }: WalletDepositViewProps) => {
  const coinData = coins ? coins[coin] : null;
  const networkOptions = coinData ? coinData.networks.map((n) => n.network) : [];
  const [network, setNetwork] = useState("");

  useEffect(() => {
    if (coinData) {
      // Select first option
      setNetwork(coinData.networks[0].network);
    }
  }, [coinData]);

  return (
    <Modal p={5}>
      <Title>
        <Box alignItems="center" display="flex">
          <img src={WalletIcon} width={40} height={40} />
          <FormattedMessage id="wallet.type.withdraw" /> ZIG
        </Box>
      </Title>
      <TextDesc>
        <FormattedMessage id="wallet.withdraw.desc" values={{ coin: "ZIG" }} />
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
      <NetworkCautionMessage network={network} />
      <Label style={{ marginTop: "24px" }}>
        <FormattedMessage id="wallet.withdraw.address" />
      </Label>
      <AmountInput
        className="customInput"
        endAdornment={
          <InputAdornment position="end">
            <FormattedMessage id="transfer.internal.max" />
          </InputAdornment>
        }
      />
      <Box display="flex" flexDirection="row" mt="12px">
        <Button className="textPurple borderPurple" onClick={() => setPath("")}>
          <FormattedMessage id="confirm.cancel" />
        </Button>
        <Button className="bgPurple" onClick={() => setPath("verify")}>
          <FormattedMessage id="wallet.withdraw.continue" />
        </Button>
      </Box>
    </Modal>
  );
};
export default WalletWithdrawView;
