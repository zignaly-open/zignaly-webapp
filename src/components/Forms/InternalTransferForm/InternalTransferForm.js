import React, { useState } from "react";
import "./InternalTransferForm.scss";
import { Box, TextField, InputAdornment, Typography } from "@material-ui/core";
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineConnector,
  TimelineSeparator,
} from "@material-ui/lab";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
// import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
// import tradeApi from "../../../services/tradeApiClient";
// import { useDispatch } from "react-redux";
import { useStoreUserData } from "../../../hooks/useStoreUserSelector";
// import { showSuccessAlert, showErrorAlert } from "../../../store/actions/ui";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import CustomSelect from "components/CustomSelect";
import useExchangeAssets from "hooks/useExchangeAssets";
import useAvailableBalance from "hooks/useAvailableBalance";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {Object} DefaultProps
 * @property {ExchangeConnectionEntity} selectedExchange
 */
/**
 * About us compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const InternalTransferForm = ({ selectedExchange }) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const storeSettings = useStoreSettingsSelector();
  // const storeSession = useStoreSessionSelector();
  const storeUserData = useStoreUserData();
  const { errors, handleSubmit, control, watch } = useForm();
  // const dispatch = useDispatch();
  const accounts = storeUserData.exchanges.filter((item) => item.isBrokerAccount);
  const fromAccountList = accounts.length
    ? accounts.map((i) => ({ val: i.internalId, label: i.internalName }))
    : [];
  const toAccountList =
    accounts.length > 1
      ? accounts
          .filter((item) => item.internalId !== accounts[0].internalId)
          .map((i) => ({ val: i.internalId, label: i.internalName }))
      : [];
  const assets = useExchangeAssets(selectedExchange.internalId, new Date());
  const assetsOptions = Object.keys(assets);
  const { balance } = useAvailableBalance(selectedExchange);
  const selectedAsset = watch("selectedAsset", "BTC");

  // const initAccounts = () => {
  //   const accounts = storeUserData.exchanges.filter((item) => item.isBrokerAccount);
  //   setFromAccountList(() => (accounts.length ? accounts : []));
  //   setFromAccount(() => (accounts.length ? accounts[0].internalId : ""));
  //   setToAccountList(() =>
  //     accounts.length > 1
  //       ? accounts.filter((item) => item.internalId !== accounts[0].internalId)
  //       : [],
  //   );
  //   setToAccount(() => (accounts.length > 1 ? accounts[1].internalId : ""));
  // };

  // useEffect(initAccounts, []);

  /**
   *
   * @typedef {Object} SubmitObject
   * @property {String} name
   * @property {String} logoUrl
   * @property {String} website
   * @property {String} minAllocatedBalance
   * @property {String} merchantId
   * @property {String} price
   * @property {String} ipnSecret
   * @property {String} trial
   * @property {boolean} public
   * @property {Boolean} list
   */

  // /**
  //  * Function to submit edit form.
  //  *
  //  * @param {SubmitObject} data Form data received at submit.
  //  * @returns {void} None.
  //  */
  const onSubmit = () => {
    setLoading(true);
    // const payload = {
    //   ...data,
    // };
    // tradeApi
    //   .providerEdit(payload)
    //   .then(() => {
    //     const payload2 = {
    //       token: payload.token,
    //       providerId: payload.providerId,
    //       version: 2,
    //       exchangeInternalId: storeSettings.selectedExchange.internalId,
    //     };
    //     dispatch(getProvider(payload2, true));
    //     dispatch(showSuccessAlert("alert.profileedit.title", "alert.profileedit.body"));
    //   })
    //   .catch((e) => {
    //     dispatch(showErrorAlert(e));
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="flex-start"
        className="internalTransferForm"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Typography variant="h3">
          <FormattedMessage id="transfer.internal.form.title" />
        </Typography>
        <Timeline className="timeline">
          <TimelineItem className="timelineItem">
            <TimelineSeparator>
              <TimelineDot className="fromAccountStepLabel" />
              <TimelineConnector className="timelineConnector" />
            </TimelineSeparator>
            <TimelineContent className="timelineContent">
              <Box className="inputBox">
                <Controller
                  control={control}
                  defaultValue={fromAccountList.length ? fromAccountList[0].val : ""}
                  name="fromAccount"
                  render={({ onChange, value }) => (
                    <CustomSelect
                      label={intl.formatMessage({ id: "transfer.internal.form.from" })}
                      labelPlacement="top"
                      onChange={(/** @type {string} **/ v) => {
                        onChange(v);
                      }}
                      options={fromAccountList}
                      value={value}
                    />
                  )}
                />
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem className="timelineItem">
            <TimelineSeparator>
              <SyncAltIcon className="transferIcon" />
            </TimelineSeparator>
            <TimelineContent className="timelineContent">
              <Box className="inputBox" />
            </TimelineContent>
          </TimelineItem>

          <TimelineItem className="timelineItem">
            <TimelineSeparator>
              <TimelineConnector className="timelineConnector" />
              <TimelineDot className="toAccountStepLabel" />
            </TimelineSeparator>
            <TimelineContent className="timelineContent">
              <Box className="inputBox">
                <Controller
                  control={control}
                  defaultValue={toAccountList.length ? toAccountList[0].val : ""}
                  name="toAccount"
                  render={({ onChange, value }) => (
                    <CustomSelect
                      label={intl.formatMessage({
                        id: "transfer.internal.form.to",
                      })}
                      labelPlacement="top"
                      onChange={(/** @type {string} **/ v) => {
                        onChange(v);
                      }}
                      options={toAccountList}
                      value={value}
                    />
                  )}
                />
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem className="timelineItem">
            <TimelineContent className="timelineContent">
              <Box className="inputBox search">
                <Controller
                  control={control}
                  defaultValue="BTC"
                  name="selectedAsset"
                  render={({ onChange, value }) => (
                    <CustomSelect
                      label={intl.formatMessage({ id: "transfer.internal.coin" })}
                      labelPlacement="top"
                      onChange={(/** @type {string} **/ v) => {
                        onChange(v);
                      }}
                      options={assetsOptions}
                      search={true}
                      value={value}
                    />
                  )}
                />
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem className="timelineItem">
            <TimelineContent className="timelineContent">
              <Box className="inputBox textField" display="flex" flexDirection="column">
                <Box
                  alignItems="center"
                  className="labelBox"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <label className="customLabel">
                    <FormattedMessage id="transfer.internal.amount" />
                  </label>
                  <label className="customLabel">
                    {balance[selectedAsset] || 0}{" "}
                    <FormattedMessage id="transfer.internal.available" />
                  </label>
                </Box>
                <Controller
                  as={
                    <TextField
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <FormattedMessage id="transfer.internal.max" />
                          </InputAdornment>
                        ),
                      }}
                      className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
                      error={!!errors.amount}
                      fullWidth
                      variant="outlined"
                    />
                  }
                  control={control}
                  defaultValue={0}
                  name="amount"
                  rules={{
                    required: true,
                  }}
                />
              </Box>
            </TimelineContent>
          </TimelineItem>
        </Timeline>

        <Box className="formAction" display="flex" flexDirection="row" justifyContent="center">
          <CustomButton className="submitButton" loading={loading} type="submit">
            <FormattedMessage id="accounts.transfer" />
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default InternalTransferForm;
