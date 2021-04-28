import React, { useState } from "react";
import "./CopyPSForm.scss";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  FormHelperText,
  Checkbox,
  OutlinedInput,
  FormControlLabel,
} from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import tradeApi from "../../../services/tradeApiClient";
import { getProvider } from "../../../store/actions/views";
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
import { Help } from "@material-ui/icons";

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
  const [loading, setLoading] = useState(false);
  const [profitsMode, setProfitsMode] = useState(provider.profitsMode || "reinvest");
  const {
    errors,
    handleSubmit,
    setError,
    control,
    formState: { isValid },
    register,
    watch,
  } = useForm({
    mode: "onBlur",
    shouldUnregister: false,
  });
  const dispatch = useDispatch();
  const intl = useIntl();
  const { balance, loading: balanceLoading } = useAvailableBalance(selectedExchange, true);
  const quoteBalance = (balance && balance[provider.copyTradingQuote]) || 0;
  const [step, setStep] = useState(1);
  const allocatedBalance = watch(
    "allocatedBalance",
    !provider.disable ? provider.allocatedBalance : "",
  );

  /**
   * @returns {String} Exchange name to display in the error.
   */
  const prepareExchangeName = () => {
    let name = "";
    for (let i = 0; i < provider.exchanges.length; i++) {
      if (provider.exchanges[i + 1]) {
        name += `${provider.exchanges[i]}/`;
      } else {
        name += `${provider.exchanges[i]}`;
      }
    }
    return name;
  };

  const checkWrongExchange = () => {
    if (selectedExchange.paperTrading) {
      return intl.formatMessage({ id: "copyt.copy.error4" });
    }

    if (provider.exchanges.length && provider.exchanges[0] !== "") {
      if (
        !provider.exchanges.includes(selectedExchange.name.toLowerCase()) ||
        provider.exchangeType.toLowerCase() !== selectedExchange.exchangeType.toLowerCase()
      ) {
        let exchangeName = prepareExchangeName();
        return intl.formatMessage(
          { id: "copyt.copy.error1" },
          {
            required: `${exchangeName.toUpperCase()} ${provider.exchangeType.toUpperCase()}`,
          },
        );
      }
    }

    return "";
  };

  const wrongExchange = checkWrongExchange();

  /**
   * Check allocated amount is correct
   * @param {string} val Value.
   * @returns {boolean|string} Result or error message.
   */
  const validateAmount = (val) => {
    const newAllocated = parseFloat(val);

    if (!provider.disable && newAllocated < provider.allocatedBalance) {
      return intl.formatMessage({ id: "form.error.allocatedBalance.reduce" });
    }

    if (!balanceLoading) {
      // Balance checks
      if (provider.disable && quoteBalance < newAllocated) {
        return intl.formatMessage(
          { id: "copyt.copy.error3" },
          { quote: provider.copyTradingQuote },
        );
      } else if (quoteBalance < newAllocated - provider.allocatedBalance) {
        return intl.formatMessage(
          { id: "copyt.copy.error5" },
          { quote: provider.copyTradingQuote },
        );
      }
    }
    return true;
  };

  /**
   *
   * @typedef {Object} FormData
   * @property {String} allocatedBalance
   * @property {String} transfer
   */

  /**
   *
   * @param {FormData} data Form data.
   * @returns {void} None.
   */
  const onSubmit = (data) => {
    if (step === 1 && provider.disable) {
      setStep(2);
    } else {
      setLoading(true);
      const payload = {
        allocatedBalance: data.allocatedBalance,
        balanceFilter: true,
        connected: provider.connected ? provider.connected : false,
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        exchangeInternalId: selectedExchange.internalId,
        profitsMode: profitsMode,
      };
      tradeApi
        .traderConnect(payload)
        .then(() => {
          const payloadProvider = {
            token: storeSession.tradeApi.accessToken,
            providerId: provider.id,
            version: 2,
            exchangeInternalId: selectedExchange.internalId,
          };
          dispatch(getProvider(payloadProvider, false));
          onClose();
          onSuccess();
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const redirectToHelp = () => {
    const link =
      "https://help.zignaly.com/hc/en-us/articles/360019579879-I-have-an-error-of-incorrect-exchange-account-when-trying-to-connect-to-a-Profit-Sharing-service-";
    window.open(link, "_blank");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="copyPSForm"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        {wrongExchange ? (
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="h3" className="wrongExchangeTitle">
              <Box display="flex" flexDirection="row" alignItems="center" component="span">
                <FormattedMessage id="profitsharing.wrongexchange" />
                <Help className="helpIcon" onClick={redirectToHelp} />
              </Box>
            </Typography>
            <Typography>{wrongExchange}</Typography>
          </Box>
        ) : (
          <>
            {step === 1 ? (
              <>
                <Typography variant="h3">
                  <FormattedMessage id="profitsharing.start" />
                </Typography>

                <Box
                  alignItems="start"
                  display="flex"
                  flexDirection="column"
                  justifyContent="start"
                  className="allocatedBox"
                >
                  <Typography>
                    <FormattedMessage id="profitsharing.howmuch" />
                  </Typography>
                  <NumberInput
                    control={control}
                    quote={provider.copyTradingQuote}
                    defaultValue={allocatedBalance}
                    placeholder={intl.formatMessage({
                      id: "trader.amount.placeholder.1",
                    })}
                    error={!!errors.allocatedBalance}
                    name="allocatedBalance"
                    rules={{
                      required: true,
                      validate: (val) => validateAmount(val),
                    }}
                  />
                  {errors.allocatedBalance && (
                    <span className={"text red"}>{errors.allocatedBalance.message}</span>
                  )}
                  <FormHelperText component="div">
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <FormattedMessage id="deposit.available" />
                      {balanceLoading ? (
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
                  onChange={(e, val) => val && setProfitsMode(val)}
                  value={profitsMode}
                >
                  <ToggleButton value="reinvest">
                    <FormattedMessage id="trader.reinvest" />
                  </ToggleButton>
                  <ToggleButton value="withdraw">
                    <FormattedMessage id="trader.withdraw" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </>
            ) : (
              <>
                <Typography variant="h3">
                  <FormattedMessage id="profitsharing.confirm" />
                </Typography>

                <Typography className="summaryTitle">
                  <FormattedMessage id="profitsharing.investing" />
                  :&nbsp;
                  <b>
                    {allocatedBalance} {provider.copyTradingQuote}
                  </b>
                </Typography>
                <Typography>
                  <FormattedMessage id="profitsharing.profitswillbe" />
                  :&nbsp;
                  <b>
                    <FormattedMessage
                      id={
                        profitsMode === "reinvest"
                          ? "profitsharing.reinvested"
                          : "profitsharing.withdrawn"
                      }
                    />
                  </b>
                </Typography>
                <Box className="acks" display="flex" flexDirection="column">
                  {["ack1", "ack2", "ack3"].map((ack) => (
                    <Box key={ack} className="ack">
                      <Controller
                        control={control}
                        defaultValue={false}
                        name={ack}
                        render={({ onChange, value }) => (
                          <Checkbox
                            checked={value}
                            className="checkboxInput"
                            onChange={(e) => onChange(e.target.checked)}
                          />
                        )}
                        rules={{
                          required: true,
                        }}
                      />
                      <label className="customLabel">
                        <FormattedMessage id={`profitsharing.${ack}`} />
                      </label>
                    </Box>
                  ))}
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography>
                    <FormattedMessage id="profitsharing.confirmtransfer" />
                  </Typography>
                  <OutlinedInput
                    className="customInput transferInput"
                    inputRef={register({
                      validate: (val) => val.toLowerCase() === "transfer",
                    })}
                    name="transfer"
                    placeholder={intl.formatMessage({
                      id: "trader.ack.placeholder",
                    })}
                    error={!!errors.transfer}
                  />
                </Box>
              </>
            )}
            <CustomButton
              className="full submitButton"
              loading={loading}
              type="submit"
              disabled={balanceLoading || !isValid}
            >
              {step === 1 && provider.disable ? (
                <FormattedMessage id="action.next" />
              ) : (
                <>
                  <FormattedMessage id="trader.ack.placeholder" /> {allocatedBalance}{" "}
                  {provider.copyTradingQuote}
                </>
              )}
            </CustomButton>
          </>
        )}
      </Box>
    </form>
  );
};

export default CopyPSForm;
