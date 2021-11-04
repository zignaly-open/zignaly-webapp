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

const WalletWithdrawConfirm = ({ coins, coin = "ZIG", setPath, path }: WalletDepositViewProps) => {
  const withdraw = () => {};

  return (
    <Modal p={5}>
      <Title>
        <Box alignItems="center" display="flex">
          <img src={WalletIcon} width={40} height={40} />
          <FormattedMessage id="wallet.withdraw.confirm" />
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
          <FormattedMessage id="accounts.back" />
        </Button>
        <Button className="bgPurple" onClick={withdraw}>
          <FormattedMessage id="wallet.withdraw.now" />
        </Button>
      </Box>
    </Modal>
  );
};
export default WalletWithdrawConfirm;
