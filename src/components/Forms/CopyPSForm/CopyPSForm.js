import React, { useState } from "react";
import "./CopyPSForm.scss";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  FormHelperText,
} from "@material-ui/core";
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
// import { userPilotProviderEnabled } from "../../../utils/userPilotApi";
// import { mixpanelProviderEnabled } from "utils/mixpanelApi";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import { formatNumber } from "utils/formatters";
import NumberInput from "../NumberInput";

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
const CopyPSForm = ({ provider, onClose, onSuccess }) => {
  const storeUserExchangeConnections = useStoreUserExchangeConnections();
  const storeSession = useStoreSessionSelector();
  const { selectedExchange } = useStoreSettingsSelector();
  const [actionLoading, setActionLoading] = useState(false);
  const [profitsMode, setProfitsMode] = useState(provider.profitsMode || "reinvest");
  const [alert, setAlert] = useState(undefined);
  const {
    errors,
    handleSubmit,
    setError,
    control,
    formState: { isValid },
    register,
  } = useForm({ mode: "onBlur" });
  const dispatch = useDispatch();
  const intl = useIntl();
  const { balance, loading } = useAvailableBalance(selectedExchange, true);
  const quoteBalance = (balance && balance[provider.copyTradingQuote]) || 0;

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
    console.log(data);
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

  // const validateExchange = () => {
  //   if (storeUserExchangeConnections.length > 0) {
  //     if (provider.profitSharing && selectedExchange.paperTrading) {
  //       let msg = intl.formatMessage({ id: "copyt.copy.error4" });
  //       setAlert(msg);
  //       return false;
  //     }
  //     if (provider.exchanges.length && provider.exchanges[0] !== "") {
  //       if (
  //         provider.exchanges.includes(selectedExchange.name.toLowerCase()) &&
  //         provider.exchangeType.toLowerCase() === selectedExchange.exchangeType.toLowerCase()
  //       ) {
  //         return true;
  //       }
  //       let exchangeName = prepareExchangeName();
  //       let msg = intl.formatMessage(
  //         { id: "copyt.copy.error1" },
  //         {
  //           required: `${exchangeName.toUpperCase()} ${provider.exchangeType.toUpperCase()}`,
  //         },
  //       );
  //       setAlert(msg);
  //       return false;
  //     }
  //   } else {
  //     let msg = intl.formatMessage({ id: "copyt.copy.error2" });
  //     setAlert(msg);
  //     return false;
  //   }
  //   return true;
  // };

  /**
   *
   * @param {String} allocatedBalance balance inout from user.
   * @returns {Boolean} whether the input value is valid or not.
   */
  // const validateBalance = (allocatedBalance) => {
  //   if (!provider.profitSharing) {
  //     return true;
  //   }

  //   const added = parseFloat(allocatedBalance);
  //   const alreadyAllocated = provider.allocatedBalance;
  //   const neededQuote = provider.copyTradingQuote;
  //   const userBalance = balance[neededQuote] || 0;
  //   const noBalanceMsg = intl.formatMessage({ id: "copyt.copy.error3" }, { quote: neededQuote });
  //   const noBalanceToIncreaseMsg = intl.formatMessage(
  //     { id: "copyt.copy.error5" },
  //     { quote: neededQuote },
  //   );

  //   if (provider.disable) {
  //     if (userBalance >= added) {
  //       return true;
  //     }
  //     setAlert(noBalanceMsg);
  //     return false;
  //   }

  //   if (userBalance >= added - alreadyAllocated) {
  //     return true;
  //   }
  //   setAlert(noBalanceToIncreaseMsg);
  //   return false;
  // };

  // /**
  //  *
  //  * @param {String} allocatedBalance balance inout from user.
  //  * @returns {Boolean} whether the input value is valid or not.
  //  */
  // const validateAllocated = (allocatedBalance) => {
  //   const added = parseFloat(allocatedBalance);
  //   const needed = provider.minAllocatedBalance;
  //   const alreadyAllocated = provider.allocatedBalance;

  //   const validateNeeded = () => {
  //     if (added >= needed) {
  //       return true;
  //     }
  //     setError("allocatedBalance", {
  //       type: "manual",
  //       message: intl.formatMessage(
  //         { id: "trader.amount.error" },
  //         {
  //           quote: provider.copyTradingQuote,
  //           amount: provider.minAllocatedBalance,
  //         },
  //       ),
  //     });
  //     return false;
  //   };

  //   const validateAlreadyAllocated = () => {
  //     if (added >= alreadyAllocated) {
  //       return true;
  //     }
  //     setError("allocatedBalance", {
  //       type: "manual",
  //       message: intl.formatMessage({ id: "form.error.allocatedBalance.reduce" }),
  //     });
  //     return false;
  //   };

  //   if (provider.disable) {
  //     if (provider.profitSharing) {
  //       return true;
  //     }
  //     return validateNeeded();
  //   }
  //   if (provider.profitSharing) {
  //     return validateAlreadyAllocated();
  //   }
  //   return validateNeeded();
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="copyPSForm"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Typography variant="h3" className="formTitle">
          <FormattedMessage id="profitsharing.start" />
        </Typography>

        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <Typography>
            <FormattedMessage id="profitsharing.howmuch" />
          </Typography>
          <NumberInput
            control={control}
            quote={provider.copyTradingQuote}
            defaultValue={!provider.disable ? provider.allocatedBalance : ""}
            placeholder={intl.formatMessage({
              id: "trader.amount.placeholder.1",
            })}
            error={!!errors.allocatedBalance}
            name="allocatedBalance"
          />
          {errors.allocatedBalance && (
            <span className={"text red"}>{errors.allocatedBalance.message}</span>
          )}
          <FormHelperText component="div">
            <Box display="flex" flexDirection="row" alignItems="center">
              <FormattedMessage id="deposit.available" />
              {loading ? (
                <CircularProgress color="primary" size={15} />
              ) : (
                <>
                  {provider.copyTradingQuote}&nbsp;
                  <span className="balance">{formatNumber(quoteBalance)}</span>
                </>
              )}
            </Box>
          </FormHelperText>
        </Box>

        <Typography className="modeTitle">
          <FormattedMessage id="profitsharing.profitsmode" />
        </Typography>

        <ToggleButtonGroup
          className="modeButtons"
          exclusive
          onChange={(e, val) => setProfitsMode(val)}
          value={profitsMode}
        >
          <ToggleButton value="reinvest">
            <FormattedMessage id="trader.reinvest" />
          </ToggleButton>
          <ToggleButton value="withdraw">
            <FormattedMessage id="trader.withdraw" />
          </ToggleButton>
        </ToggleButtonGroup>

        <CustomButton
          className="full submitButton"
          loading={actionLoading}
          type="submit"
          disabled={!isValid}
        >
          <FormattedMessage id="action.next" />
        </CustomButton>
      </Box>
    </form>
  );
};

export default CopyPSForm;
