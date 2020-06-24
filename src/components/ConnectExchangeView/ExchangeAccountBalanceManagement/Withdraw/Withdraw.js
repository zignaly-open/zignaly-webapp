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
import { useForm } from "react-hook-form";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";

const ExchangeAccountWithdraw = () => {
  const {
    pathParams: { selectedAccount },
    setTitle,
  } = useContext(ModalPathContext);
  const intl = useIntl();
  const { handleSubmit, register, errors } = useForm();
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

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

  const onSubmit = (data) => {
    // handleSubmit((data) => {
    console.log(data);

    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId: selectedAccount.internalId,
      asset: selectedAssetName,
      network: selectedNetwork.network,
      tag: data.memo,
      address: data.address,
      amount: data.amount,
    };

    tradeApi
      .withdraw(payload)
      .then(() => {
        dispatch(showSuccessAlert("", "withdraw.success"));
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
    // })();
  };

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
                <Box className="networkColumn">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <NetworksToggleGroup
                      networks={selectedAsset.networks}
                      setSelectedNetwork={setSelectedNetwork}
                      selectedNetwork={selectedNetwork}
                    />
                    <FormControl fullWidth={true} className="controlInput">
                      <Box display="flex" flexDirection="row" className="labelBox">
                        <label>
                          <Typography variant="body1">
                            <FormattedMessage
                              id="withdraw.address"
                              values={{ coin: selectedAssetName }}
                            />
                          </Typography>
                        </label>
                      </Box>
                      <OutlinedInput
                        fullWidth={true}
                        inputRef={register({
                          required: "address empty",
                          pattern: {
                            value: RegExp(selectedNetwork.addressRegex),
                            message: "invalid address",
                          },
                        })}
                        name="address"
                      />
                      {errors.address && (
                        <span className="errorText">{errors.address.message}</span>
                      )}
                    </FormControl>

                    {selectedNetwork.memoRegex && (
                      <FormControl fullWidth={true} className="controlInput">
                        <label>
                          <Typography variant="body1">
                            <FormattedMessage id="withdraw.memo" />
                          </Typography>
                        </label>
                        <OutlinedInput
                          name="memo"
                          fullWidth={true}
                          inputRef={register({
                            required: "memo empty",
                            pattern: {
                              value: RegExp(selectedNetwork.memoRegex),
                              message: "invalid memo",
                            },
                          })}
                        />
                        {errors.memo && <span className="errorText">{errors.memo.message}</span>}
                      </FormControl>
                    )}

                    <FormControl fullWidth={true} className="controlInput">
                      <Box display="flex" flexDirection="row" justifyContent="space-between">
                        <label>
                          <Typography variant="body1">
                            <FormattedMessage id="withdraw.amount" />
                          </Typography>
                        </label>
                        <Typography
                          className={`callout2 ${
                            parseFloat(selectedAsset.balanceFree) >=
                            parseFloat(selectedNetwork.withdrawMin)
                              ? "green"
                              : "red"
                          }`}
                        >
                          <span className="labelAvailable">
                            <FormattedMessage id="deposit.available" />
                          </span>
                          <b>
                            {selectedAssetName} {formatFloat(selectedAsset.balanceFree)}
                          </b>
                        </Typography>
                      </Box>
                      <OutlinedInput
                        fullWidth={true}
                        inputRef={register({
                          required: "amount empty",
                        })}
                        name="amount"
                      />
                      {errors.amount && <span className="errorText">{errors.amount.message}</span>}
                    </FormControl>
                    <Typography className="callout1 minAmount">
                      <FormattedMessage id="withdraw.minimum" />
                      <b>
                        {selectedAssetName} {selectedNetwork.withdrawMin}
                      </b>
                    </Typography>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      width={1}
                      mb="24px"
                    >
                      <Typography variant="body2">
                        <FormattedMessage id="withdraw.fee" />
                      </Typography>
                      <Typography variant="body2">
                        {selectedAssetName} {selectedNetwork.withdrawFee}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      width={1}
                    >
                      <Typography variant="body2">
                        <FormattedMessage id="withdraw.get" />
                      </Typography>
                      <Typography variant="body2">
                        {selectedAssetName} {selectedNetwork.withdrawFee}
                      </Typography>
                    </Box>
                    <CustomButton className="bgPurple" disabled={false} type="submit">
                      <Typography variant="body2">
                        <FormattedMessage id="accounts.withdraw" />
                      </Typography>
                    </CustomButton>
                  </form>
                </Box>
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
