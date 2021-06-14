import React, { useContext, useState } from "react";
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
import useActivateSubAccount from "../../../../hooks/useActivateSubAccount";
import useClipboard from "../../../../hooks/useClipboard";
import DepositHistoryTable from "./DepositHistoryTable";
import TransferCoinPicker from "../TransferCoinPicker";
import { buyCryptoURL } from "../../../../utils/affiliateURLs";
import BalanceManagement from "../BalanceManagement";
import NetworksToggleGroup from "../NetworksToggleGroup";
import TipBox from "../TipBox";
import Modal from "../../../Modal";
import DepositQRCodes from "./DepositQRCodes";
import { Alert } from "@material-ui/lab";

const Deposit = () => {
  const {
    pathParams: { selectedAccount },
    setPathParams,
  } = useContext(ModalPathContext);
  const copyToClipboard = useClipboard();

  // Initialize exchange internal id if/when account is activated
  const internalId = selectedAccount.activated ? selectedAccount.internalId : "";

  const {
    selectedAssetName,
    setSelectedAsset,
    assetsList,
    selectedAsset,
    selectedNetwork,
    setSelectedNetwork,
  } = useAssetsSelect(internalId, selectedAccount.exchangeType);

  // Activate account if needed
  useActivateSubAccount(selectedAccount, () => {
    // Update context object
    setPathParams((params) => ({
      ...params,
      selectedAccount: { ...params.selectedAccount, activated: true },
    }));
  });

  const depositAddress = useExchangeDepositAddress(internalId, selectedAssetName, selectedNetwork);

  const copyAddress = () => {
    if (depositAddress) copyToClipboard(depositAddress.address, "deposit.address.copied");
  };

  const copyMemo = () => {
    if (depositAddress) copyToClipboard(depositAddress.tag, "deposit.memo.copied");
  };

  const [isQRModalOpen, openQRModal] = useState(false);

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
            <Typography className="bold" variant="body1">
              <FormattedMessage id="deposit.buy.creditcard" />
            </Typography>
          </CustomButton>
          <Box className="creditCard" flexDirection="row">
            <img alt="Visa" src={VisaIcon} />
            <img alt="MasterCard" src={MastercardIcon} />
          </Box>
        </Box>
        <Box className="transferBox">
          {!assetsList.length ? (
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
                <Box className={`coinColumn ${selectedAsset ? "selected" : ""}`}>
                  <TransferCoinPicker
                    asset={selectedAsset}
                    coins={assetsList}
                    label="deposit.choosecoin"
                    onChange={setSelectedAsset}
                    selectedCoin={selectedAssetName}
                  />
                  {selectedAsset && (
                    <Box className="tipBox">
                      <img src={TimeIcon} />
                      <Typography className="bold" variant="body1">
                        <FormattedMessage id="deposit.waitingtime" />
                      </Typography>
                      <Typography variant="body1">
                        <FormattedMessage id="deposit.processing" />
                      </Typography>
                    </Box>
                  )}
                </Box>
                {selectedAsset && (
                  <Box className="networkColumn">
                    {selectedAsset.networks.length > 1 && (
                      <NetworksToggleGroup
                        networks={selectedAsset.networks.map((n) => n.name)}
                        selectedNetwork={selectedNetwork.name}
                        setSelectedNetwork={setSelectedNetwork}
                      />
                    )}
                    <Typography className="addressLabel" variant="body1">
                      {selectedAssetName} <FormattedMessage id="deposit.address" />
                    </Typography>
                    <Box display="flex" flexDirection="row">
                      {selectedNetwork && !selectedNetwork.withdrawEnable ? (
                        <Alert severity="error">
                          {selectedNetwork.withdrawDesc || (
                            <FormattedMessage id="withdraw.notavailable" />
                          )}
                        </Alert>
                      ) : depositAddress ? (
                        <>
                          <Typography className="address bold" variant="body1">
                            {depositAddress.address}
                          </Typography>
                          <img alt="copy" className="copy" onClick={copyAddress} src={CopyIcon} />
                        </>
                      ) : (
                        <CircularProgress disableShrink size={21} />
                      )}
                    </Box>
                    {depositAddress && depositAddress.tag && (
                      <Box>
                        <Typography className="addressLabel" variant="body1">
                          {selectedAssetName} <FormattedMessage id="withdraw.memo" />
                        </Typography>
                        <Box display="flex" flexDirection="row">
                          <Typography className="bold" variant="body1">
                            {depositAddress.tag}
                          </Typography>
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
                        <Typography className="bold" variant="body1">
                          <FormattedMessage id="deposit.address.copy" />
                        </Typography>
                      </CustomButton>
                      <Modal
                        onClose={() => openQRModal(false)}
                        persist={false}
                        size="small"
                        state={isQRModalOpen}
                      >
                        <DepositQRCodes address={depositAddress} />
                      </Modal>
                      <CustomButton
                        className="borderPurple textPurple"
                        disabled={!depositAddress}
                        onClick={() => openQRModal(true)}
                      >
                        <Typography className="bold" variant="body1">
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
                )}
              </Box>
              <Alert className="depositTimeAlert" severity="error">
                <Typography variant="body1">
                  <FormattedMessage id="deposit.time.alert" />
                </Typography>
              </Alert>
            </Box>
          )}
          <DepositHistoryTable internalId={selectedAccount.internalId} />
        </Box>
      </Box>
    </BalanceManagement>
  );
};

export default Deposit;
