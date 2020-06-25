import React, { useEffect, useContext } from "react";
import { FormattedMessage } from "react-intl";
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

const Deposit = () => {
  const {
    pathParams: { selectedAccount },
    setTitle,
  } = useContext(ModalPathContext);
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
    if (depositAddress) copyToClipboard(depositAddress.address, "deposit.address.copied");
  };

  const copyMemo = () => {
    if (depositAddress) copyToClipboard(depositAddress.tag, "deposit.memo.copied");
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
                    asset={selectedAsset}
                    coins={assetsList}
                    label="deposit.choosecoin"
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
                    selectedNetwork={selectedNetwork}
                    setSelectedNetwork={setSelectedNetwork}
                  />
                  <Typography className="addressLabel" variant="body1">
                    {selectedAssetName} <FormattedMessage id="deposit.address" />
                  </Typography>
                  <Box display="flex" flexDirection="row">
                    {depositAddress ? (
                      <Typography className="address" variant="body2">
                        {depositAddress.address}
                      </Typography>
                    ) : (
                      <CircularProgress disableShrink size={21} />
                    )}
                    <img alt="copy" className="copy" onClick={copyAddress} src={CopyIcon} />
                  </Box>
                  {depositAddress && depositAddress.tag && (
                    <Box>
                      <Typography className="addressLabel" variant="body1">
                        {selectedAssetName} <FormattedMessage id="withdraw.memo" />
                      </Typography>
                      <Box display="flex" flexDirection="row">
                        <Typography variant="body2">{depositAddress.tag}</Typography>
                        <img alt="copy" className="copy" onClick={copyMemo} src={CopyIcon} />
                      </Box>
                    </Box>
                  )}
                  <Box className="addressButtons" display="flex" flexDirection="row">
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
                    description="deposit.loss"
                    icon={BtcIcon}
                    title={
                      <FormattedMessage
                        id="deposit.note.onlysend"
                        values={{ coin: selectedAssetName }}
                      />
                    }
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

export default Deposit;
