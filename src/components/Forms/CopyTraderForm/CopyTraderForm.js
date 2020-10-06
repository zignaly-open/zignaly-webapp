import React, { useState } from "react";
import "./CopyTraderForm.scss";
import { Box, TextField, Typography, CircularProgress } from "@material-ui/core";
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
import useAvailableBalance from "../../../hooks/useAvailableBalance";

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
  const [allocated, setAllocated] = useState(!provider.disable ? provider.allocatedBalance : "");
  const [profitsMode, setProfitsMode] = useState(
    provider.profitsMode ? provider.profitsMode : "reinvest",
  );
  const [alert, setAlert] = useState(undefined);
  const { errors, handleSubmit, register, setError } = useForm();
  const dispatch = useDispatch();
  const intl = useIntl();
  const { balance, loading } = useAvailableBalance();

  /**
   *
   * @param {React.ChangeEvent<*>} e Change event.
   * @returns {Void} None.
   */
  const handleAllocatedChange = (e) => {
    let data = e.target.value;
    if (data.match(/^[0-9]\d*(?:[.,]\d{0,8})?$/) || data === "") {
      data = data.replace(",", ".");
      setAllocated(data);
    }
  };

  /**
   *
   * @param {String} val Change event.
   * @returns {Void} None.
   */
  const handleShareingModeChange = (val) => {
    setProfitsMode(val);
  };

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
    if (validateExchange() && validateBalance(data.allocatedBalance)) {
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
          ...(provider.profitSharing && {
            profitsMode: profitsMode,
          }),
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

  /**
   *
   * @param {String} allocatedBalance balance inout from user.
   * @returns {Boolean} whether the input value is valid or not.
   */
  const validateBalance = (allocatedBalance) => {
    if (!provider.profitSharing) {
      return true;
    }
    // Skip balance validation on paper trading exchange.
    const added = parseFloat(allocatedBalance);
    if (storeSettings.selectedExchange.paperTrading) {
      return true;
    }
    let neededQuote = provider.copyTradingQuote;
    /* @ts-ignore */
    let userBalance = balance[neededQuote] || 0;
    if (userBalance && userBalance > added) {
      return true;
    }
    let msg = intl.formatMessage({ id: "copyt.copy.error3" }, { quote: neededQuote });
    setAlert(msg);
    return false;
  };

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
        justifyContent="flex-start"
      >
        {loading && <CircularProgress color="primary" size={40} />}
        {!loading && (
          <>
            {Boolean(alert) && (
              <Alert className="alert" severity="error">
                {alert}
              </Alert>
            )}
            <Typography variant="h3">
              <FormattedMessage id="trader.howmuch" values={{ quote: provider.copyTradingQuote }} />
            </Typography>
            <Typography variant="body1">
              <FormattedMessage id="trader.everymove" />
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
                <label className="customLabel">
                  <FormattedMessage id="trader.choose" />{" "}
                </label>
                <TextField
                  className="customInput"
                  error={!!errors.allocatedBalance}
                  fullWidth
                  inputRef={register({
                    required: true,
                  })}
                  name="allocatedBalance"
                  onChange={handleAllocatedChange}
                  value={allocated}
                  variant="outlined"
                />
                {!provider.profitSharing && (
                  <span className={"text " + (errors.allocatedBalance ? "errorText" : "")}>
                    <FormattedMessage
                      id="trader.amount.error"
                      values={{
                        quote: provider.copyTradingQuote,
                        amount: provider.minAllocatedBalance,
                      }}
                    />
                  </span>
                )}
              </Box>
            </Box>

            {provider.profitSharing && (
              <>
                <Typography variant="h4">
                  <FormattedMessage id="trader.locked" />
                </Typography>

                <Typography variant="h4">
                  <FormattedMessage id="trader.moreinfo" />
                </Typography>

                <label className="customLabel">
                  <FormattedMessage id="trader.profitaction" />
                </label>

                <Box className="labeledInputsBox">
                  <span
                    className={profitsMode === "reinvest" ? "checked" : ""}
                    onClick={() => handleShareingModeChange("reinvest")}
                  >
                    <FormattedMessage id="trader.reinvest" />
                  </span>
                  <span
                    className={profitsMode === "withdraw" ? "checked" : ""}
                    onClick={() => handleShareingModeChange("withdraw")}
                  >
                    <FormattedMessage id="trader.withdraw" />
                  </span>
                </Box>

                <Box
                  alignItems="start"
                  className="inputBox"
                  display="flex"
                  flexDirection="column"
                  justifyContent="start"
                >
                  <TextField
                    className="customTextarea"
                    defaultValue=""
                    error={!!errors.acknowledgeLockedBalance}
                    fullWidth
                    inputRef={register({
                      required: true,
                    })}
                    multiline
                    name="acknowledgeLockedBalance"
                    placeholder={intl.formatMessage({ id: "trader.ack" })}
                    rows={3}
                    variant="outlined"
                  />
                </Box>
              </>
            )}

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
        )}
      </Box>
    </form>
  );
};

export default CopyTraderForm;
