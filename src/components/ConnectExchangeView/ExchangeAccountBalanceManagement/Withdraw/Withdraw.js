import React, { useEffect, useContext, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  FormControlLabel,
  OutlinedInput,
  FormControl,
} from "@material-ui/core";
import "./Withdraw.scss";
import TransferCoinPicker from "../TransferCoinPicker";
import TipBox from "../TipBox";
import copyToClipboard from "../../../../hooks/useClipboard";
import ModalPathContext from "../../ModalPathContext";
import { FormattedMessage, useIntl } from "react-intl";
import useAssetsSelect from "../../../../hooks/useAssetsSelect";
import AlertIcon from "../../../../images/exchangeAccount/alert.svg";
import BalanceManagement from "../BalanceManagement";
import NetworksToggleGroup from "../NetworksToggleGroup";
import CustomButton from "../../../CustomButton";
import { formatFloat } from "../../../../utils/format";

const ExchangeAccountWithdraw = () => {
  const {
    pathParams: { selectedAccount },
    setTitle,
  } = useContext(ModalPathContext);
  const intl = useIntl();

  const {
    selectedAssetName,
    setSelectedAsset,
    assetsList,
    selectedAsset,
    selectedNetwork,
    setSelectedNetwork,
  } = useAssetsSelect(selectedAccount.internalId);
  console.log(selectedAsset);

  useEffect(() => {
    setTitle(selectedAccount.internalName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const NetworkColumn = () => (
    <Box className="networkColumn">
      <NetworksToggleGroup
        networks={selectedAsset.networks}
        setSelectedNetwork={setSelectedNetwork}
        selectedNetwork={selectedNetwork}
      />
      {/* <FormControl required error={error} component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Pick two</FormLabel>
        <OutlinedInput />
      </FormControl> */}
      {/* <FormControlLabel
        fullWidth={true}
        control={<OutlinedInput fullWidth={true} />}
        label={<FormattedMessage id="withdraw.address" values={{ coin: selectedAssetName }} />}
        labelPlacement="top"
      /> */}
      <FormControl fullWidth={true} className="controlInput">
        <Box display="flex" flexDirection="row" className="labelBox">
          <label>
            <Typography variant="body1">
              <FormattedMessage id="withdraw.address" values={{ coin: selectedAssetName }} />
            </Typography>
          </label>
        </Box>
        <OutlinedInput fullWidth={true} />
        {/* <InputLabel htmlFor="my-input">Email address</InputLabel> */}
        {/* <Input id="my-input" aria-describedby="my-helper-text" /> */}
        {/* <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText> */}
      </FormControl>

      <FormControl fullWidth={true} className="controlInput">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <label>
            <Typography variant="body1">
              <FormattedMessage id="withdraw.amount" />
            </Typography>
          </label>
          <Typography className="callout2">
            <span className="labelAvailable">
              <FormattedMessage id="deposit.available" />
            </span>
            <b>
              {selectedAssetName} {formatFloat(selectedAsset.balanceFree)}
            </b>
          </Typography>
        </Box>
        <OutlinedInput fullWidth={true} />
      </FormControl>
      <Typography className="callout1 minAmount">
        <FormattedMessage id="withdraw.minimum" />
        <b>
          {selectedAssetName} {selectedNetwork.withdrawMin}
        </b>
      </Typography>
      {/* <FormControlLabel
        control={<OutlinedInput fullWidth={true} />}
        label={
          <Box display="flex" flexDirection="row">
            <FormattedMessage id="withdraw.amount" />
            <FormattedMessage id="deposit.available" />
            {selectedAssetName} {selectedNetwork.balanceFree}
          </Box>
        }
        labelPlacement="top"
      /> */}
      <Box display="flex" flexDirection="row" justifyContent="space-between" width={1} mb="24px">
        <Typography variant="body2">
          <FormattedMessage id="withdraw.fee" />
        </Typography>
        <Typography variant="body2">
          {selectedAssetName} {selectedNetwork.withdrawFee}
        </Typography>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="space-between" width={1}>
        <Typography variant="body2">
          <FormattedMessage id="withdraw.get" />
        </Typography>
        <Typography variant="body2">
          {selectedAssetName} {selectedNetwork.withdrawFee}
        </Typography>
      </Box>
      <CustomButton className="bgPurple" disabled={false} onClick={() => {}}>
        <Typography variant="body2">
          <FormattedMessage id="deposit.address.copy" />
        </Typography>
      </CustomButton>
    </Box>
  );

  return (
    <BalanceManagement>
      <Box className="exchangeAccountWithdraw">
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
              <Box className="transferDesc">
                <Typography variant="body1">
                  <FormattedMessage id="withdraw.description" />
                </Typography>
              </Box>
              <Box className="transferColumnsBox" display="flex" flexDirection="row">
                <Box className="coinColumn">
                  <TransferCoinPicker
                    label="withdraw.choosecoin"
                    asset={selectedAsset}
                    coins={assetsList}
                    onChange={setSelectedAsset}
                    selectedCoin={selectedAssetName}
                  />
                  <TipBox
                    icon={AlertIcon}
                    title="withdraw.crowdfund"
                    description="withdraw.crowdfund.note"
                  />
                </Box>
                <NetworkColumn />
              </Box>
            </Box>
          )}
          {/* <DepositHistoryTable internalId={selectedAccount.internalId} /> */}
        </Box>
      </Box>
    </BalanceManagement>
  );
};

export default ExchangeAccountWithdraw;
