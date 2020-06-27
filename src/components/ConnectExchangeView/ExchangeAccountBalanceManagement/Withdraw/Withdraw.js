import React, { useEffect, useContext, useState } from "react";
import { Box, Typography, CircularProgress, OutlinedInput, FormControl } from "@material-ui/core";
import "./Withdraw.scss";
import TransferCoinPicker from "../TransferCoinPicker";
import TipBox from "../TipBox";
import { FormattedMessage } from "react-intl";
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
import WithdrawHistoryTable from "./WithdrawHistoryTable";
import ModalPathContext from "../../ModalPathContext";

const Withdraw = () => {
  const {
    pathParams: { selectedAccount },
    setTitle,
  } = useContext(ModalPathContext);
  const { handleSubmit, register, errors, watch, reset } = useForm();
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const amount = watch("amount");

  const {
    selectedAssetName,
    setSelectedAsset,
    assetsList,
    selectedAsset,
    selectedNetwork,
    setSelectedNetwork,
  } = useAssetsSelect(selectedAccount.internalId, selectedAccount.exchangeType, updatedAt);

  useEffect(() => {
    setTitle(selectedAccount.internalName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * @typedef {Object} FormData
   * @property {String} address
   * @property {String} [memo]
   * @property {String} amount
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const onSubmit = (data) => {
    setIsLoading(true);

    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId: selectedAccount.internalId,
      asset: selectedAssetName,
      network: selectedNetwork.network,
      tag: data.memo,
      address: data.address,
      amount: parseFloat(data.amount),
    };

    tradeApi
      .withdraw(payload)
      .then(() => {
        dispatch(showSuccessAlert("", "withdraw.success"));
        // Update withdraw history table and assets balance
        setUpdatedAt(new Date());
        // Reset form
        reset();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setIsLoading(false);
      });
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
                    asset={selectedAsset}
                    coins={assetsList}
                    label="withdraw.choosecoin"
                    onChange={setSelectedAsset}
                    selectedCoin={selectedAssetName}
                  />
                  <TipBox
                    description="withdraw.crowdfund.note"
                    icon={AlertIcon}
                    title="withdraw.crowdfund"
                  />
                </Box>
                <Box className="networkColumn">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <NetworksToggleGroup
                      networks={selectedAsset.networks}
                      selectedNetwork={selectedNetwork}
                      setSelectedNetwork={setSelectedNetwork}
                    />
                    <FormControl className="controlInput" fullWidth={true}>
                      <Box className="labelBox" display="flex" flexDirection="row">
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
                          required: "Please specify an address",
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
                      <FormControl className="controlInput" fullWidth={true}>
                        <label>
                          <Typography variant="body1">
                            <FormattedMessage id="withdraw.memo" />
                          </Typography>
                        </label>
                        <OutlinedInput
                          fullWidth={true}
                          inputRef={register({
                            required: "Please specify a MEMO/Tag",
                            pattern: {
                              value: RegExp(selectedNetwork.memoRegex),
                              message:
                                "MEMO/Tag is invalid, please review your target wallet network details.",
                            },
                          })}
                          name="memo"
                        />
                        {errors.memo && <span className="errorText">{errors.memo.message}</span>}
                      </FormControl>
                    )}

                    <FormControl className="controlInput" fullWidth={true}>
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
                        inputProps={{
                          min: parseFloat(selectedNetwork.withdrawMin),
                        }}
                        inputRef={register({
                          min: {
                            value: parseFloat(selectedNetwork.withdrawMin),
                            message:
                              "Please enter an amount no higher than your available balance.",
                          },
                          max: {
                            value: parseFloat(selectedAsset.balanceFree),
                            message: "You do not have this amount available in your account.",
                          },
                        })}
                        name="amount"
                        type="number"
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
                      mb="24px"
                      width={1}
                    >
                      <Typography variant="body1" className="bold">
                        <FormattedMessage id="withdraw.fee" />
                      </Typography>
                      <Typography variant="body1" className="bold">
                        {selectedAssetName} {selectedNetwork.withdrawFee}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      width={1}
                    >
                      <Typography variant="body1" className="bold">
                        <FormattedMessage id="withdraw.get" />
                      </Typography>
                      <Typography variant="body1" className="bold">
                        {selectedAssetName}{" "}
                        {Math.max(0, (amount || 0) - parseFloat(selectedNetwork.withdrawFee))}
                      </Typography>
                    </Box>
                    <CustomButton
                      className="bgPurple"
                      disabled={false}
                      loading={isLoading}
                      type="submit"
                    >
                      <Typography variant="body1" className="bold">
                        <FormattedMessage id="accounts.withdraw" />
                      </Typography>
                    </CustomButton>
                  </form>
                </Box>
              </Box>
            </Box>
          )}
          <WithdrawHistoryTable internalId={selectedAccount.internalId} updatedAt={updatedAt} />
        </Box>
      </Box>
    </BalanceManagement>
  );
};

export default Withdraw;
