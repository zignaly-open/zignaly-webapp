import React, { useState } from "react";
import "./CopyTraderForm.scss";
import { Box, TextField, Typography } from "@mui/material";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import useSelectedExchange from "hooks/useSelectedExchange";
import tradeApi from "../../../services/tradeApiClient";
import { getProvider } from "../../../store/actions/views";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import Alert from '@mui/material/Alert';
import { useIntl } from "react-intl";
import useAvailableBalance from "../../../hooks/useAvailableBalance";
import NumberInput from "../NumberInput";
import { Help } from "@mui/icons-material";

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
  const selectedExchange = useSelectedExchange();
  const [actionLoading, setActionLoading] = useState(false);
  const [profitsMode, setProfitsMode] = useState(
    provider.profitsMode ? provider.profitsMode : "reinvest",
  );
  const [alert, setAlert] = useState(undefined);
  const { errors, handleSubmit, setError, control } = useForm();
  const dispatch = useDispatch();
  const intl = useIntl();
  const { balance } = useAvailableBalance(selectedExchange, provider.profitSharing);

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
      if (validateAllocated(data.allocatedBalance) && validateBalance(data.allocatedBalance)) {
        setActionLoading(true);
        const payload = {
          allocatedBalance: data.allocatedBalance,
          balanceFilter: true,
          connected: provider.connected ? provider.connected : false,
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
              providerId: provider.id,
              exchangeInternalId: selectedExchange.internalId,
            };
            dispatch(getProvider(payload2, !provider.profitSharing));
            // mixpanelProviderEnabled();
            // userPilotProviderEnabled();
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
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleSubmitClick = () => {
    handleSubmit(onSubmit);
  };

  const redirectToHelp = () => {
    if (typeof window !== "undefined") {
      const link =
        "https://help.zignaly.com/hc/en-us/articles/360019579879-I-have-an-error-of-incorrect-exchange-account-when-trying-to-connect-to-a-Profit-Sharing-service-";
      window.open(link, "_blank");
    }
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
          <Alert className="alert" classes={{ icon: "alertIcon" }} severity="error">
            <Typography className="message" variant="body1">
              {alert}
              {provider.profitSharing && <Help className="helpIcon" onClick={redirectToHelp} />}
            </Typography>
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
            <NumberInput
              control={control}
              defaultValue={!provider.disable ? provider.allocatedBalance : ""}
              error={!!errors.allocatedBalance}
              name="allocatedBalance"
              placeholder={intl.formatMessage({
                id: provider.profitSharing
                  ? "trader.amount.placeholder.1"
                  : "trader.amount.placeholder.2",
              })}
              quote={provider.copyTradingQuote}
              rules={{ required: true }}
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
