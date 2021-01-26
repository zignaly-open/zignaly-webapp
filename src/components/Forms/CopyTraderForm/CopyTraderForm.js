import React, { useState } from "react";
import "./CopyTraderForm.scss";
import { Box, TextField, Typography, InputAdornment } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
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
import { userPilotProviderEnabled } from "../../../utils/userPilotApi";
import { mixpanelProviderEnabled } from "utils/mixpanelApi";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 * @property {Function} onClose
 * @property {Function} onSuccess
 *
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const CopyTraderForm = ({ provider, onClose, onSuccess }) => {
  const storeUserExchangeConnections = useStoreUserExchangeConnections();
  const storeSession = useStoreSessionSelector();
  const { selectedExchange } = useStoreSettingsSelector();
  const [actionLoading, setActionLoading] = useState(false);
  const [allocated, setAllocated] = useState(!provider.disable ? provider.allocatedBalance : "");
  const [profitsMode, setProfitsMode] = useState(
    provider.profitsMode ? provider.profitsMode : "reinvest",
  );
  const [alert, setAlert] = useState(undefined);
  const { errors, handleSubmit, setError, control } = useForm();
  const dispatch = useDispatch();
  const intl = useIntl();
  const { balance } = useAvailableBalance(provider.profitSharing);

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
   * @property {String} transfer
   */

  /**
   *
   * @param {SubmitObject} data Form data.
   * @returns {void} None.
   */
  const onSubmit = (data) => {
    if (!data.transfer || data.transfer.toLowerCase() === "transfer") {
      if (
        validateExchange() &&
        validateAllocated(data.allocatedBalance) &&
        validateBalance(data.allocatedBalance)
      ) {
        setActionLoading(true);
        const payload = {
          allocatedBalance: data.allocatedBalance,
          balanceFilter: true,
          connected: provider.connected ? provider.connected : false,
          token: storeSession.tradeApi.accessToken,
          providerId: provider.id,
          exchangeInternalId: selectedExchange.internalId,
          ...(provider.profitSharing && {
            profitsMode: profitsMode,
          }),
        };
        tradeApi
          .traderConnect(payload)
          .then(() => {
            const payload2 = {
              token: storeSession.tradeApi.accessToken,
              providerId: provider.id,
              version: 2,
              exchangeInternalId: selectedExchange.internalId,
            };
            dispatch(setProvider(payload2, !provider.profitSharing));
            mixpanelProviderEnabled();
            userPilotProviderEnabled();
            dispatch(showSuccessAlert("copyt.follow.alert.title", "copyt.follow.alert.body"));
            onClose();
            if (provider.profitSharing) {
              onSuccess();
            }
          })
          .catch((e) => {
            dispatch(showErrorAlert(e));
          })
          .finally(() => {
            setActionLoading(false);
          });
      }
    } else {
      setError("transfer", { type: "patter", message: "" });
    }
  };

  const validateExchange = () => {
    if (storeUserExchangeConnections.length > 0) {
      if (provider.profitSharing && selectedExchange.paperTrading) {
        let msg = intl.formatMessage({ id: "copyt.copy.error4" });
        setAlert(msg);
        return false;
      }
      if (provider.exchanges.length && provider.exchanges[0] !== "") {
        if (
          provider.exchanges.includes(selectedExchange.name.toLowerCase()) &&
          provider.exchangeType.toLowerCase() === selectedExchange.exchangeType.toLowerCase()
        ) {
          return true;
        }
        let exchangeName = prepareExchangeName();
        let msg = intl.formatMessage(
          { id: "copyt.copy.error1" },
          {
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

    const added = parseFloat(allocatedBalance);
    const alreadyAllocated = provider.allocatedBalance;
    const neededQuote = provider.copyTradingQuote;
    const userBalance = balance[neededQuote] || 0;
    const noBalanceMsg = intl.formatMessage({ id: "copyt.copy.error3" }, { quote: neededQuote });
    const noBalanceToIncreaseMsg = intl.formatMessage(
      { id: "copyt.copy.error5" },
      { quote: neededQuote },
    );

    if (provider.disable) {
      if (userBalance >= added) {
        return true;
      }
      setAlert(noBalanceMsg);
      return false;
    }

    if (userBalance >= added - alreadyAllocated) {
      return true;
    }
    setAlert(noBalanceToIncreaseMsg);
    return false;
  };

  /**
   *
   * @param {String} allocatedBalance balance inout from user.
   * @returns {Boolean} whether the input value is valid or not.
   */
  const validateAllocated = (allocatedBalance) => {
    const added = parseFloat(allocatedBalance);
    const needed = provider.minAllocatedBalance;
    const alreadyAllocated = provider.allocatedBalance;

    const validateNeeded = () => {
      if (added >= needed) {
        return true;
      }
      setError("allocatedBalance", {
        type: "manual",
        message: intl.formatMessage(
          { id: "trader.amount.error" },
          {
            quote: provider.copyTradingQuote,
            amount: provider.minAllocatedBalance,
          },
        ),
      });
      return false;
    };

    const validateAlreadyAllocated = () => {
      if (added >= alreadyAllocated) {
        return true;
      }
      setError("allocatedBalance", {
        type: "manual",
        message: intl.formatMessage({ id: "form.error.allocatedBalance.reduce" }),
      });
      return false;
    };

    if (provider.disable) {
      if (provider.profitSharing) {
        return true;
      }
      return validateNeeded();
    }
    if (provider.profitSharing) {
      return validateAlreadyAllocated();
    }
    return validateNeeded();
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
        {Boolean(alert) && (
          <Alert className="alert" severity="error">
            <Typography variant="body1">{alert}</Typography>
          </Alert>
        )}
        <Typography className={"formTitle " + (alert ? "noMargin" : "")} variant="h3">
          {provider.profitSharing ? (
            <FormattedMessage id="trader.howmuch.1" values={{ quote: provider.copyTradingQuote }} />
          ) : (
            <FormattedMessage id="trader.howmuch.2" values={{ quote: provider.copyTradingQuote }} />
          )}
        </Typography>
        {!provider.profitSharing && (
          <Typography className="para" variant="body1">
            <FormattedMessage id="trader.everymove" />
          </Typography>
        )}
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
            <Controller
              control={control}
              name="allocatedBalance"
              render={(props) => (
                <TextField
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">{provider.copyTradingQuote}</InputAdornment>
                    ),
                  }}
                  className="customInput"
                  error={!!errors.allocatedBalance}
                  fullWidth
                  onChange={(e) => {
                    let data = e.target.value;
                    if (data.match(/^$|^[0-9]\d*(?:[.,]\d{0,8})?$/)) {
                      data = data.replace(",", ".");
                      setAllocated(data);
                      props.onChange(data);
                    }
                  }}
                  placeholder={intl.formatMessage({
                    id: provider.profitSharing
                      ? "trader.amount.placeholder.1"
                      : "trader.amount.placeholder.2",
                  })}
                  value={allocated}
                  variant="outlined"
                />
              )}
              rules={{ required: "Please enter a valid Amount!" }}
            />
            {provider.profitSharing && errors.allocatedBalance && (
              <span className={"text red"}>{errors.allocatedBalance.message}</span>
            )}
            {!provider.profitSharing && (
              <span className={"text " + (errors.allocatedBalance ? "red" : "")}>
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
              <FormattedMessage id="trader.locked" /> <FormattedMessage id="trader.moreinfo" />
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

            <label className={"customLabel " + (errors.transfer ? "red" : "")}>
              <FormattedMessage id="trader.copy.confirm" />
            </label>

            <Box
              alignItems="start"
              className="inputBox"
              display="flex"
              flexDirection="column"
              justifyContent="start"
            >
              <Controller
                control={control}
                defaultValue=""
                name="transfer"
                render={(props) => (
                  <TextField
                    className="customTextarea"
                    error={!!errors.transfer}
                    fullWidth
                    multiline
                    onChange={(e) => {
                      let value = e.target.value;
                      props.onChange(value);
                    }}
                    placeholder={intl.formatMessage({ id: "trader.ack.placeholder" })}
                    rows={2}
                    variant="outlined"
                  />
                )}
                rules={{ required: true }}
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
            {provider.profitSharing ? (
              <FormattedMessage id="trader.transferfunds" />
            ) : (
              <FormattedMessage id="trader.start" />
            )}
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default CopyTraderForm;
