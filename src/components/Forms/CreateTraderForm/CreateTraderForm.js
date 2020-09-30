import React, { useState, useEffect } from "react";
import "./CreateTraderForm.scss";
import { Box, Typography, OutlinedInput, CircularProgress } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showCreateTrader } from "../../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import CustomSelect from "../../CustomSelect";
import useQuoteAssets from "../../../hooks/useQuoteAssets";
import useExchangeList from "../../../hooks/useExchangeList";
import { navigate } from "gatsby";
import MonthlyFee from "../../../images/ct/profit.svg";
import ExchangeIcon from "../../ExchangeIcon";
import ToggleButtonsExchangeType from "../../ConnectExchangeView/ToggleButtonsExchangeType";

const MODEL_PROFIT_SHARING = 0;
const MODEL_MONHTLY_FEE = 1;

/**
 * @typedef {import('../../../services/tradeApiClient.types').NewProviderEntity} NewProviderEntity
 * @typedef {import('../../../services/tradeApiClient.types').ExchangeListEntity} ExchangeListEntity
 */

/**
 * Provides a form to create a trader account
 *
 * @returns {JSX.Element} Component JSX.
 */
const CreateTraderForm = () => {
  const [loading, setLoading] = useState(false);
  const profitSharingEnabled = process.env.GATSBY_ENABLE_PROFITSHARING.toLowerCase() === "true";
  const [selectedModel, setSelectedModel] = useState(
    profitSharingEnabled ? MODEL_PROFIT_SHARING : MODEL_MONHTLY_FEE,
  );
  const [exchange, setExchange] = useState(/** @type {ExchangeListEntity} **/ (null));
  const [exchangeType, setExchangeType] = useState(null);
  const [step, setStep] = useState(1);
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const intl = useIntl();
  let exchanges = useExchangeList();

  if (exchanges) {
    // Filter exchanges depending on selected model
    exchanges = exchanges.filter(
      (e) =>
        e.enabled &&
        (selectedModel === MODEL_PROFIT_SHARING
          ? e.name.toLowerCase() === "zignaly"
          : e.name.toLowerCase() !== "zignaly"),
    );
  }

  useEffect(() => {
    // Select first exchange on model change
    if (exchanges && (!exchange || !exchanges.find((e) => e === exchange))) {
      setExchange(exchanges[0]);
      //   setExchange(null);
    }
  }, [exchanges]);

  const quoteAssets = useQuoteAssets(Boolean(exchange), exchange ? exchange.id : null);
  const quotes = Object.keys(quoteAssets);

  const {
    errors,
    handleSubmit,
    control,
    register,
    formState: { isValid },
  } = useForm({ mode: "onChange" });

  /**
   * @typedef {Object} FormData
   * @property {string} quote
   * @property {string} minAllocatedBalance
   * @property {string} name
   * @property {string} [profitsShare]
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const submitForm = (data) => {
    setLoading(true);
    const profitsSharing = selectedModel === MODEL_PROFIT_SHARING;
    const payload = {
      ...data,
      exchange: exchange.name,
      exchangeType,
      profitsSharing,
      ...(profitsSharing && { profitsShare: parseFloat(data.profitsShare) }),
      token: storeSession.tradeApi.accessToken,
    };

    tradeApi
      .copyTraderCreate(payload)
      .then((response) => {
        const profileLink = `/copyTraders/${response.id}/edit`;
        navigate(profileLink);
        dispatch(showCreateTrader(false));
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  return (
    <Box className="createTraderForm">
      <Typography variant="h1">
        <FormattedMessage id="copyt.create" />
      </Typography>
      <Typography className="subHeader">
        <FormattedMessage id="copyt.create.desc" />
      </Typography>
      <form method="post" onSubmit={handleSubmit(submitForm)}>
        <Box className="step1" display="flex" flexDirection="column" alignItems="flex-start">
          {exchanges ? (
            <>
              <Typography className="body1 bold" variant="h3">
                <FormattedMessage id="copyt.model.choose" />
              </Typography>

              <Box display="flex">
                {profitSharingEnabled && (
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    className="model"
                    onClick={() => setSelectedModel(MODEL_PROFIT_SHARING)}
                  >
                    <img
                      className={`iconButton ${
                        selectedModel === MODEL_PROFIT_SHARING ? "selected" : ""
                      }`}
                      src={MonthlyFee}
                      title={intl.formatMessage({ id: "copyt.profitsharing.service" })}
                    />
                    <Typography className="callout2">
                      <FormattedMessage id="copyt.profitsharing.service" />
                    </Typography>
                  </Box>
                )}

                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  className="model"
                  onClick={() => setSelectedModel(MODEL_MONHTLY_FEE)}
                >
                  <img
                    className={`iconButton ${
                      selectedModel === MODEL_MONHTLY_FEE ? "selected" : ""
                    }`}
                    src={MonthlyFee}
                    title={intl.formatMessage({ id: "copyt.monthlyfee.service" })}
                  />
                  <Typography className="callout2">
                    <FormattedMessage id="copyt.monthlyfee.service" />
                  </Typography>
                </Box>
              </Box>

              <Typography className="body1 bold exchangeChoose" variant="h3">
                <FormattedMessage id="accounts.exchange.choose" />
              </Typography>
              <Box display="flex" flexWrap="wrap">
                {exchanges.map((e) => (
                  <ExchangeIcon
                    className={`iconButton ${
                      (exchange && exchange.name) === e.name ? "selected" : ""
                    }`}
                    exchange={e.name}
                    key={e.id}
                    onClick={() => setExchange(exchanges.find((ex) => e === ex))}
                  />
                ))}
              </Box>
              {step === 1 && (
                <CustomButton className="bgPurple bold" onClick={() => setStep(2)}>
                  <FormattedMessage id="accounts.next" />
                </CustomButton>
              )}
            </>
          ) : (
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              className="loaderBox"
            >
              <CircularProgress color="primary" size={50} />
            </Box>
          )}
        </Box>
        <Box className="step2">
          {exchange && step >= 2 && (
            <>
              <ToggleButtonsExchangeType
                exchangeTypes={selectedModel !== MODEL_PROFIT_SHARING ? exchange.type : ["futures"]}
                setExchangeType={setExchangeType}
                exchangeType={exchangeType}
              />
              <Box
                alignItems="flex-start"
                className="boxWrapper"
                display="flex"
                flexDirection="row"
              >
                <Box className="inputBox" mr={2}>
                  <Controller
                    control={control}
                    defaultValue={"USDT"}
                    name="quote"
                    render={({ onChange, value }) => (
                      <CustomSelect
                        label={intl.formatMessage({
                          id: "fil.quote",
                        })}
                        labelPlacement="top"
                        onChange={onChange}
                        options={quotes}
                        search={true}
                        value={value}
                      />
                    )}
                    rules={{
                      required: intl.formatMessage({ id: "form.error.quote" }),
                    }}
                  />
                  {errors.quote && <span className="errorText">{errors.quote.message}</span>}
                </Box>
                <Box
                  className="inputBox minBalanceBox"
                  display="flex"
                  flex={1}
                  flexDirection="column"
                  mr={1}
                >
                  <label className="customLabel">
                    <Typography className="callout2 selectLabel" noWrap>
                      <FormattedMessage id="srv.edit.minbalance" />
                    </Typography>
                  </label>
                  <OutlinedInput
                    className="customInput minAllocatedBalance"
                    error={!!errors.minAllocatedBalance}
                    inputProps={{
                      min: 0,
                    }}
                    inputRef={register({
                      required: intl.formatMessage({ id: "form.error.minAllocatedBalance" }),
                      min: 0,
                    })}
                    name="minAllocatedBalance"
                    type="number"
                  />
                  {errors.minAllocatedBalance && (
                    <span className="errorText">{errors.minAllocatedBalance.message}</span>
                  )}
                </Box>
              </Box>
              {step === 2 && (
                <>
                  <Typography className="body1 tip">
                    <FormattedMessage id="copyt.cannotmodify" />
                  </Typography>
                  <CustomButton
                    className="bgPurple bold"
                    disabled={!isValid}
                    onClick={() => {
                      setStep(3);
                    }}
                  >
                    <FormattedMessage id="accounts.next" />
                  </CustomButton>
                </>
              )}
            </>
          )}
        </Box>
        <Box className="step3">
          {step === 3 && (
            <>
              <Typography variant="h3">
                <FormattedMessage id="copyt.laststep" />
              </Typography>
              <Box display="flex" flexDirection="column" className="inputBox">
                <label htmlFor="name" className="customLabel">
                  <FormattedMessage id="copyt.servicename" />
                </label>
                <OutlinedInput
                  className="customInput"
                  defaultValue=""
                  id="name"
                  inputRef={register({
                    required: intl.formatMessage({ id: "form.error.name" }),
                    minLength: {
                      value: 5,
                      message: intl.formatMessage({ id: "form.error.name.length" }),
                    },
                    maxLength: {
                      value: 50,
                      message: intl.formatMessage({ id: "form.error.name.length" }),
                    },
                  })}
                  error={!!errors.name}
                  name="name"
                />
                {errors && errors.name && <span className="errorText">{errors.name.message}</span>}
              </Box>
              {selectedModel === MODEL_PROFIT_SHARING && (
                <Box className="inputBox" display="flex" flexDirection="column">
                  <label className="customLabel">
                    <FormattedMessage id="copyt.profitsharing.percentage" />
                  </label>
                  <OutlinedInput
                    className="customInput"
                    error={!!errors.profitsShare}
                    inputProps={{
                      min: 0,
                      step: 0.01,
                    }}
                    inputRef={register({
                      validate: (value) =>
                        (!isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) < 100) ||
                        intl.formatMessage({ id: "form.error.profitsharing" }),
                    })}
                    name="profitsShare"
                    type="number"
                  />
                  {errors.profitsShare && (
                    <span className="errorText">{errors.profitsShare.message}</span>
                  )}
                </Box>
              )}
              <CustomButton
                className="bgPurple bold"
                loading={loading}
                type="submit"
                disabled={!isValid}
              >
                <FormattedMessage id="provider.createaccount" />
              </CustomButton>
            </>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default CreateTraderForm;
