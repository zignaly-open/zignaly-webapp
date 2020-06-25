import React, { useEffect, useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ModalPathContext from "../../ModalPathContext";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import "./Deposit.scss";
import CustomButton from "../../../CustomButton";
import MastercardIcon from "../../../../images/exchangeAccount/mastercard.svg";
import VisaIcon from "../../../../images/exchangeAccount/visa.svg";
import TimeIcon from "../../../../images/exchangeAccount/time.svg";
import BtcIcon from "../../../../images/exchangeAccount/btc.svg";
import CopyIcon from "../../../../images/exchangeAccount/copy.svg";
import useExchangeDepositAddress from "../../../../hooks/useExchangeDepositAddress";
import useAssetsSelect from "../../../../hooks/useAssetsSelect";
import useClipboard from "../../../../hooks/useClipboard";
import DepositHistoryTable from "./DepositHistoryTable";
import TransferCoinPicker from "../TransferCoinPicker";
import { buyCryptoURL } from "../../../../utils/affiliateURLs";
import BalanceManagement from "../BalanceManagement";
import NetworksToggleGroup from "../NetworksToggleGroup";
import TipBox from "../TipBox";

const ExchangeAccountDeposit = () => {
  const {
    pathParams: { selectedAccount },
    setTitle,
  } = useContext(ModalPathContext);
  const intl = useIntl();
  const copyToClipboard = useClipboard();

  const {
    selectedAssetName,
    setSelectedAsset,
    assetsList,
    selectedAsset,
    selectedNetwork,
    setSelectedNetwork,
  } = useAssetsSelect(selectedAccount.internalId, selectedAccount.exchangeType);

  const depositAddress = useExchangeDepositAddress(
    selectedAccount.internalId,
    selectedAssetName,
    selectedNetwork && selectedNetwork.network,
  );

  useEffect(() => {
    setTitle(selectedAccount.internalName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyAddress = () => {
    depositAddress && copyToClipboard(depositAddress.address, "deposit.address.copied");
  };

  const copyMemo = () => {
    depositAddress && copyToClipboard(depositAddress.tag, "deposit.memo.copied");
  };

  const showQRCode = () => {};

  return (
    <BalanceManagement>
      <Box className="exchangeAccountDeposit">
        <Box className="buyCryptoBox">
          <Typography variant="h3">
            <FormattedMessage id="deposit.buy" />
          </Typography>
          <Typography variant="body1">
            <FormattedMessage id="deposit.buy.how" />
          </Typography>
          <CustomButton className="bgPurple" href={buyCryptoURL} target="_blank">
            <Typography variant="body2">
              <FormattedMessage id="deposit.buy.creditcard" />
            </Typography>
          </CustomButton>
          <Box className="creditCard" flexDirection="row">
            <img alt="Visa" src={VisaIcon} />
            <img alt="MasterCard" src={MastercardIcon} />
          </Box>
        </Box>
        <Box className="transferBox">
          {!assetsList.length || !selectedNetwork ? (
            <Box
              className="loadProgress"
              display="flex"
              flexDirection="row"
              justifyContent="center"
            >
              <CircularProgress disableShrink />
            </Box>
          ) : (
            <Box>
              <Typography variant="h3">
                <FormattedMessage id="deposit.transfer" />
              </Typography>
              <Box className="transferDesc">
                <Typography variant="body1">
                  <FormattedMessage id="deposit.transfer.description" />
                </Typography>
              </Box>
              <Box className="transferColumnsBox" display="flex" flexDirection="row">
                <Box className="coinColumn">
                  <TransferCoinPicker
                    label="deposit.choosecoin"
                    asset={selectedAsset}
                    coins={assetsList}
                    onChange={setSelectedAsset}
                    selectedCoin={selectedAssetName}
                  />
                  <Box className="tipBox">
                    <img src={TimeIcon} />
                    <Typography variant="body2">
                      <FormattedMessage id="deposit.waitingtime" />
                    </Typography>
                    <Typography variant="body1">
                      <FormattedMessage id="deposit.processing" />
                    </Typography>
                  </Box>
                </Box>
                <Box className="networkColumn">
                  <NetworksToggleGroup
                    networks={selectedAsset.networks}
                    setSelectedNetwork={setSelectedNetwork}
                    selectedNetwork={selectedNetwork}
                  />
                  <Typography variant="body1" className="addressLabel">
                    {selectedAssetName} <FormattedMessage id="deposit.address" />
                  </Typography>
                  <Box display="flex" flexDirection="row">
                    {depositAddress ? (
                      <Typography variant="body2" className="address">
                        {depositAddress.address}
                      </Typography>
                    ) : (
                      <CircularProgress disableShrink size={21} />
                    )}
                    <img src={CopyIcon} alt="copy" onClick={copyAddress} className="copy" />
                  </Box>
                  {depositAddress && depositAddress.tag && (
                    <Box>
                      <Typography variant="body1" className="addressLabel">
                        {selectedAssetName} <FormattedMessage id="withdraw.memo" />
                      </Typography>
                      <Box display="flex" flexDirection="row">
                        <Typography variant="body2">{depositAddress.tag}</Typography>
                        <img src={CopyIcon} alt="copy" onClick={copyMemo} className="copy" />
                      </Box>
                    </Box>
                  )}
                  <Box display="flex" flexDirection="row" className="addressButtons">
                    <CustomButton
                      className="bgPurple"
                      disabled={!depositAddress}
                      onClick={copyAddress}
                    >
                      <Typography variant="body2">
                        <FormattedMessage id="deposit.address.copy" />
                      </Typography>
                    </CustomButton>
                    <CustomButton
                      className="borderPurple textPurple"
                      disabled={!depositAddress}
                      onClick={showQRCode}
                    >
                      <Typography variant="body2">
                        <FormattedMessage id="deposit.address.qr" />
                      </Typography>
                    </CustomButton>
                  </Box>
                  <TipBox
                    icon={BtcIcon}
                    title={
                      <FormattedMessage
                        id="deposit.note.onlysend"
                        values={{ coin: selectedAssetName }}
                      />
                    }
                    description="deposit.loss"
                  />
                </Box>
              </Box>
            </Box>
          )}
          <DepositHistoryTable internalId={selectedAccount.internalId} />
        </Box>
      </Box>
    </BalanceManagement>
  );
};

export default ExchangeAccountDeposit;
