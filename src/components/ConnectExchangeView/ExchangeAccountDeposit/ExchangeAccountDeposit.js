import React, { useEffect, useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ModalPathContext from "../ModalPathContext";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import { SubNavModalHeader } from "../../SubNavHeader";
import "./ExchangeAccountDeposit.scss";
import CustomButton from "../../CustomButton";
import MastercardIcon from "../../../images/exchangeAccount/mastercard.svg";
import VisaIcon from "../../../images/exchangeAccount/visa.svg";
import TimeIcon from "../../../images/exchangeAccount/time.svg";
import CopyIcon from "../../../images/exchangeAccount/copy.svg";
import CustomSelect from "../../CustomSelect";
import useExchangeAssets from "../../../hooks/useExchangeAssets";
import useExchangeDepositAddress from "../../../hooks/useExchangeDepositAddress";
import { isEmpty } from "lodash";
import { setSelectedExchange } from "../../../store/actions/settings";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";

const ExchangeAccountDeposit = () => {
  const {
    pathParams: { selectedAccount, previousPath },
    setTitle,
    formRef,
    setTempMessage,
    setPathParams,
  } = useContext(ModalPathContext);
  const intl = useIntl();
  const [selectedAssetName, setSelectedAsset] = useState("BTC");
  const assets = useExchangeAssets(selectedAccount.internalId);
  const selectedAsset = assets[selectedAssetName];
  const assetsOptions = Object.keys(assets).sort();
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const depositAddress = useExchangeDepositAddress(
    selectedAccount.internalId,
    selectedAssetName,
    selectedNetwork && selectedNetwork.network,
  );
  const dispatch = useDispatch();

  // Select default network
  useEffect(() => {
    if (selectedAsset) {
      setSelectedNetwork(selectedAsset.networks.find((n) => n.isDefault));
    }
  }, [selectedAsset]);

  useEffect(() => {
    setTitle(selectedAccount.internalName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(selectedAsset, selectedNetwork);

  const tabs = [
    {
      id: "deposit",
      title: "accounts.deposit",
    },
    {
      id: "withdraw",
      title: "accounts.withdraw",
    },
  ];

  /**
   * Copy content to clipboard and show alert.
   * @param {string} content
   * @param {string} successMessage
   */
  const copyToClipboard = (content, successMessage) => {
    navigator.clipboard
      .writeText(depositAddress.address)
      .then(() => {
        dispatch(showSuccessAlert("", "deposit.address.copied"));
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  const copyAddress = () => {
    copyToClipboard(depositAddress.address, "deposit.address.copied");
  };

  const copyMemo = () => {
    copyToClipboard(depositAddress.tag, "deposit.memo.copied");
  };

  const showQRCode = () => {};

  const BuyCryptoBox = () => (
    <Box className="buyCryptoBox">
      <Typography variant="h3">
        <FormattedMessage id="deposit.buy" />
      </Typography>
      <Typography variant="body1">
        <FormattedMessage id="deposit.buy.how" />
      </Typography>
      <CustomButton
        className="bgPurple"
        href="https://changelly.com/?ref_id=q0s68wsie1uf9wza"
        target="_blank"
      >
        <Typography variant="body2">
          <FormattedMessage id="deposit.buy.creditcard" />
        </Typography>
      </CustomButton>
      <Box className="creditCard" flexDirection="row">
        <img alt="Visa" src={VisaIcon} />
        <img alt="MasterCard" src={MastercardIcon} />
      </Box>
    </Box>
  );

  const CoinColumn = () => (
    <Box className="coinColumn">
      <CustomSelect
        options={assetsOptions}
        label={intl.formatMessage({ id: "deposit.choosecoin" })}
        search={true}
        onChange={setSelectedAsset}
        value={selectedAssetName}
        labelPlacement="top"
      />
      <Box className="balanceBox">
        <BalanceLine
          label="deposit.current"
          amount={selectedAsset.balanceTotal}
          unit={selectedAssetName}
        />
        <BalanceLine
          label="deposit.inorder"
          amount={selectedAsset.balanceLocked}
          unit={selectedAssetName}
        />
        <BalanceLine
          label="deposit.available"
          amount={selectedAsset.balanceFree}
          unit={selectedAssetName}
        />
      </Box>
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
  );

  const NetworkColumn = () => (
    <Box className="networkColumn">
      <Typography variant="body1">
        <FormattedMessage id="deposit.network" />
      </Typography>

      {selectedAsset.networks.length && (
        <ToggleButtonGroup
          exclusive
          value={selectedNetwork}
          onChange={(e, val) => setSelectedNetwork(val)}
          className="networkButtons"
        >
          {selectedAsset.networks.map((n) => (
            <ToggleButton key={n.name} value={n}>
              {n.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
      <Typography variant="body1" className="address">
        {selectedAssetName} <FormattedMessage id="deposit.address" />
      </Typography>
      <Box display="flex" flexDirection="row">
        {depositAddress ? (
          <Typography variant="body2">{depositAddress.address}</Typography>
        ) : (
          <CircularProgress disableShrink size={21} />
        )}{" "}
        <img src={CopyIcon} alt="copy" onClick={copyAddress} className="copy" />
      </Box>
      {depositAddress && depositAddress.tag && (
        <Box>
          <Typography variant="body1" className="address">
            {selectedAssetName} <FormattedMessage id="withdraw.memo" />
          </Typography>
          <Box display="flex" flexDirection="row">
            <Typography variant="body2">{depositAddress.tag}</Typography>
            <img src={CopyIcon} alt="copy" onClick={copyMemo} className="copy" />
          </Box>
        </Box>
      )}
      <Box display="flex" flexDirection="row" className="addressButtons">
        <CustomButton className="bgPurple" disabled={!depositAddress} onClick={copyAddress}>
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
      <Box className="tipBox">
        <img src={TimeIcon} />
        <Typography variant="body2">
          <FormattedMessage id="deposit.note.onlysend" values={{ coin: selectedAssetName }} />
        </Typography>
        <Typography variant="body1">
          <FormattedMessage id="deposit.loss" />
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box className="exchangeAccountDeposit">
      <SubNavModalHeader links={tabs} />
      <BuyCryptoBox />
      <Box className="transferBox">
        {!assetsOptions.length || !selectedNetwork ? (
          <Box className="loadProgress" display="flex" flexDirection="row" justifyContent="center">
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
              <CoinColumn />
              <NetworkColumn />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const BalanceLine = ({ label, amount, unit }) => (
  <Box display="flex" flexDirection="row" justifyContent="space-between" className="balanceLine">
    <Typography variant="body2">
      <FormattedMessage id={label} />
    </Typography>
    <Box>
      {amount} {unit}
    </Box>
  </Box>
);

export default ExchangeAccountDeposit;
