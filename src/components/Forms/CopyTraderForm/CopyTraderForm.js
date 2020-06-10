import React, { useState } from "react";
import "./CopyTraderForm.scss";
import { Box, TextField, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import tradeApi from "../../../services/tradeApiClient";
import { setProvider } from "../../../store/actions/views";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 * @property {Function} onClose
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const CopyTraderForm = ({ provider, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { errors, handleSubmit, register, setError } = useForm();
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();

  /**
   *
   * @typedef {Object} SubmitObject
   * @property {String} allocatedBalance
   */
  /**
   *
   * @param {SubmitObject} data Form data.
   * @returns {Promise<*>} Returns promise.
   */
  const onSubmit = async (data) => {
    try {
      let added = parseFloat(data.allocatedBalance);
      let needed =
        typeof provider.minAllocatedBalance === "string"
          ? parseFloat(provider.minAllocatedBalance)
          : provider.minAllocatedBalance;
      if (added >= needed) {
        setLoading(true);
        const payload = {
          allocatedBalance: data.allocatedBalance,
          balanceFilter: true,
          connected: provider.connected ? provider.connected : false,
          token: storeSession.tradeApi.accessToken,
          providerId: provider.id,
          exchangeInternalId: storeSettings.selectedExchange.internalId,
        };
        const response = await tradeApi.providerConnect(payload);
        if (response) {
          const payload2 = {
            token: storeSession.tradeApi.accessToken,
            providerId: provider.id,
          };
          dispatch(setProvider(payload2));
          setLoading(false);
          onClose();
        }
      } else {
        setError("allocatedBalance", "invalid amount");
      }
    } catch (e) {
      alert(e.message);
    }
  };

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleSubmitClick = () => {
    handleSubmit(onSubmit);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="copyTraderForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography variant="h3">{`How much ${provider.copyTradingQuote} you want to allocate to this trader.`}</Typography>
        <Typography variant="body1">
          Copy every move proportionately with thie followong amount.
        </Typography>
        <Box
          alignItems="center"
          className="fieldBox"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
        >
          <Typography variant="h4">{provider.copyTradingQuote}</Typography>
          <Box
            alignItems="start"
            className="inputBox"
            display="flex"
            flexDirection="column"
            justifyContent="start"
          >
            <label className="customLabel">Choose allocated amount</label>
            <TextField
              className="customInput"
              error={!!errors.allocatedBalance}
              fullWidth
              inputRef={register({
                required: true,
              })}
              name="allocatedBalance"
              variant="outlined"
            />
            <span className={errors.allocatedBalance ? "errorText" : ""}>
              {`Minimum allocated amount ${provider.copyTradingQuote}`}{" "}
              {provider.minAllocatedBalance}
            </span>
          </Box>
        </Box>

        <Box className="inputBox">
          <CustomButton
            className={"full submitButton"}
            loading={loading}
            onClick={handleSubmitClick}
            type="submit"
          >
            <FormattedMessage id="trader.start" />
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default CopyTraderForm;
