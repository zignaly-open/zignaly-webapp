import React, { useState, useEffect } from "react";
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
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import Alert from "@material-ui/lab/Alert";
import { useStoreUserExchangeConnections } from "../../../hooks/useStoreUserSelector";
import { useIntl } from "react-intl";
// import useAvailableBalance from "../../../hooks/useAvailableBalance";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 * @property {Function} onClose
 *
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const CopyTraderForm = ({ provider, onClose }) => {
  const storeUserExchangeConnections = useStoreUserExchangeConnections();
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState(undefined);
  const { errors, handleSubmit, register, setError, setValue } = useForm();
  const dispatch = useDispatch();
  const intl = useIntl();
  // const { balance, loading } = useAvailableBalance();

  const initFormData = () => {
    if (provider.exchangeInternalId && !provider.disable) {
      setValue("allocatedBalance", provider.allocatedBalance);
    }
  };

  useEffect(initFormData, []);

  /**
   *
   * @typedef {Object} SubmitObject
   * @property {String} allocatedBalance
   */

  /**
   *
   * @param {SubmitObject} data Form data.
   * @returns {void} None.
   */
  const onSubmit = (data) => {
    if (validateExchange()) {
      const added = parseFloat(data.allocatedBalance);
      const needed =
        typeof provider.minAllocatedBalance === "string"
          ? parseFloat(provider.minAllocatedBalance)
          : provider.minAllocatedBalance;
      if (added >= needed) {
        setActionLoading(true);
        const payload = {
          allocatedBalance: data.allocatedBalance,
          balanceFilter: true,
          connected: provider.connected ? provider.connected : false,
          token: storeSession.tradeApi.accessToken,
          providerId: provider.id,
          exchangeInternalId: storeSettings.selectedExchange.internalId,
        };
        tradeApi
          .traderConnect(payload)
          .then((response) => {
            if (response) {
              const payload2 = {
                token: storeSession.tradeApi.accessToken,
                providerId: provider.id,
                version: 2,
              };
              dispatch(setProvider(payload2));
              dispatch(showSuccessAlert("copyt.follow.alert.title", "copyt.follow.alert.body"));
              onClose();
            }
          })
          .catch((e) => {
            dispatch(showErrorAlert(e));
          })
          .finally(() => {
            setActionLoading(false);
          });
      } else {
        setError("allocatedBalance", {
          type: "manual",
          message: intl.formatMessage({ id: "form.error.allocatedBalance.min" }),
        });
      }
    }
  };

  const validateExchange = () => {
    if (storeUserExchangeConnections.length > 0) {
      if (provider.exchanges.length && provider.exchanges[0] !== "") {
        if (
          provider.exchanges.includes(storeSettings.selectedExchange.name.toLowerCase()) &&
          provider.exchangeType.toLowerCase() ===
            storeSettings.selectedExchange.exchangeType.toLowerCase()
        ) {
          return true;
        }
        let exchangeName = prepareExchangeName();
        let msg = intl.formatMessage(
          { id: "copyt.copy.error1" },
          {
            selected: `${storeSettings.selectedExchange.internalName.toUpperCase()}`,
            exchange: `${storeSettings.selectedExchange.name.toUpperCase()} ${storeSettings.selectedExchange.exchangeType.toUpperCase()}`,
            required: `${exchangeName.toUpperCase()} ${provider.exchangeType.toUpperCase()}`,
          },
        );
        setAlert(msg);
        return false;
      }
    } else {
      let msg = intl.formatMessage({ id: "copyt.copy.error2" });
      setAlert(msg);
      return false;
    }
    return true;
  };

  // /**
  //  *
  //  * @param {String} allocatedBalance balance inout from user.
  //  * @returns {Boolean} whether the input value is valid or not.
  //  */
  // const validateBalance = (allocatedBalance) => {
  //   // Skip balance validation on paper trading exchange.
  //   const added = parseFloat(allocatedBalance);
  //   if (storeSettings.selectedExchange.paperTrading) {
  //     return true;
  //   }
  //   let neededQuote = provider.copyTradingQuote;
  //   /* @ts-ignore */
  //   let userBalance = balance[neededQuote] || 0;
  //   if (userBalance && userBalance > added) {
  //     return true;
  //   }
  //   let msg = intl.formatMessage({ id: "copyt.copy.error3" }, { quote: neededQuote });
  //   setAlert(msg);
  //   return false;
  // };

  /**
   * @returns {String} Exchange name to display in the error.
   */
  const prepareExchangeName = () => {
    let name = "";
    for (let a = 0; a < provider.exchanges.length; a++) {
      if (provider.exchanges[a + 1]) {
        name += `${provider.exchanges[a]}/`;
      } else {
        name += `${provider.exchanges[a]}`;
      }
    }
    return name;
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
        {/* {loading && <CircularProgress color="primary" size={40} />} */}
        {/* {!loading && ( */}
        <>
          {Boolean(alert) && (
            <Alert className="alert" severity="error">
              {alert}
            </Alert>
          )}
          <Typography variant="h3">{`How much ${provider.copyTradingQuote} you want to allocate to this trader.`}</Typography>
          <Typography variant="body1">
            Copy every move proportionally with the following amount.
          </Typography>
          <Box
            alignItems="center"
            className="fieldBox"
            display="flex"
            flexDirection="row"
            justifyContent="center"
          >
            <Box
              alignItems="start"
              className="inputBox"
              display="flex"
              flexDirection="column"
              justifyContent="start"
            >
              <label className="customLabel">Choose allocated amount </label>
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
              <span className={"text " + (errors.allocatedBalance ? "errorText" : "")}>
                {`Minimum allocated amount ${provider.copyTradingQuote}`}{" "}
                {provider.minAllocatedBalance}
              </span>
            </Box>
          </Box>

          <Box className="inputBox">
            <CustomButton
              className="full submitButton"
              loading={actionLoading}
              onClick={handleSubmitClick}
              type="submit"
            >
              <FormattedMessage id="trader.start" />
            </CustomButton>
          </Box>
        </>
        {/* )} */}
      </Box>
    </form>
  );
};

export default CopyTraderForm;
