import React, { useState, useEffect } from "react";
import "./CreateTraderForm.scss";
import { Box, Typography, OutlinedInput, CircularProgress, TextField } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showCreateTrader } from "../../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import CustomSelect from "../../CustomSelect";
import useExchangeList from "../../../hooks/useExchangeList";
import { navigate } from "gatsby";
import MonthlyPayment from "../../../images/ct/monthlyPayment.svg";
import ProfitSharing from "../../../images/ct/profitSharing.svg";
import ExchangeIcon from "../../ExchangeIcon";
import ToggleButtonsExchangeType from "../../ConnectExchangeView/ToggleButtonsExchangeType";
import useExchangeQuotes from "../../../hooks/useExchangeQuotes";

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
  const [allocated, setAllocated] = useState("");
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
  let { exchanges } = useExchangeList();

  const {
    errors,
    handleSubmit,
    control,
    register,
    setValue,
    formState: { isValid },
  } = useForm({ mode: "onChange" });

  if (exchanges) {
    // Only show zignaly exchange for profit sharing
    exchanges = exchanges.filter(
      (e) =>
        e.enabled && (selectedModel !== MODEL_PROFIT_SHARING || e.name.toLowerCase() === "zignaly"),
    );
  }

  useEffect(() => {
    // Select first exchange on model change
    if (exchanges && (!exchange || !exchanges.find((e) => e === exchange))) {
      setExchange(exchanges[0]);
      //   setExchange(null);
    }
  }, [exchanges]);

  const { quoteAssets, quotesLoading } = useExchangeQuotes({
    exchangeId: exchange ? exchange.id : "",
    exchangeType: exchangeType ? exchangeType : "",
  });
  const quotes =
    exchange && exchange.name.toLowerCase() === "bitmex" ? ["BTC"] : Object.keys(quoteAssets);

  useEffect(() => {
    if (quotes) {
      setValue("quote", quotes[0]);
    }
  }, [quotes.length]);

  /**
   * @typedef {Object} FormData
   * @property {string} quote
   * @property {string} [minAllocatedBalance]
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
    const profitSharing = selectedModel === MODEL_PROFIT_SHARING;
    const payload = {
      ...data,
      exchange: exchange.name,
      exchangeType,
      profitSharing,
      ...(profitSharing && { profitsShare: parseFloat(data.profitsShare) }),
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
        <Box alignItems="flex-start" className="step1" display="flex" flexDirection="column">
          {exchanges ? (
            <>
              <Typography className="body1 bold" variant="h3">
                <FormattedMessage id="copyt.model.choose" />
              </Typography>

              <Box className="models" display="flex">
                {profitSharingEnabled && (
                  <Box
                    alignItems="center"
                    className="model"
                    display="flex"
                    flexDirection="row"
                    onClick={() => setSelectedModel(MODEL_PROFIT_SHARING)}
                  >
                    <Box
                      alignItems="center"
                      className={`iconButton fee ${
                        selectedModel === MODEL_PROFIT_SHARING ? "selected" : ""
                      }`}
                      display="flex"
                      justifyContent="center"
                    >
                      <img
                        src={ProfitSharing}
                        title={intl.formatMessage({ id: "copyt.profitsharing.service" })}
                      />
                    </Box>
                    <Typography className="callout2">
                      <FormattedMessage id="copyt.profitsharing.service" />
                    </Typography>
                  </Box>
                )}

                <Box
                  alignItems="center"
                  className="model"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  onClick={() => setSelectedModel(MODEL_MONHTLY_FEE)}
                >
                  <Box
                    alignItems="center"
                    className={`iconButton fee ${
                      selectedModel === MODEL_MONHTLY_FEE ? "selected" : ""
                    }`}
                    display="flex"
                    justifyContent="center"
                  >
                    <img
                      src={MonthlyPayment}
                      title={intl.formatMessage({ id: "copyt.monthlyfee.service" })}
                    />
                  </Box>
                  <Typography className="callout2">
                    <FormattedMessage id="copyt.monthlyfee.service" />
                  </Typography>
                </Box>
              </Box>

              <Typography className="body1 bold exchangeChoose" variant="h3">
                <FormattedMessage id="accounts.exchange.choose" />
              </Typography>
              <Box className="exchangeIconBox" display="flex" flexWrap="wrap">
                {exchanges.map((e) => (
                  <Box
                    className={`iconButton ${
                      (exchange && exchange.name) === e.name ? "selected" : ""
                    }`}
                    key={e.id}
                  >
                    <ExchangeIcon
                      exchange={e.name}
                      onClick={() => setExchange(exchanges.find((ex) => e === ex))}
                    />
                  </Box>
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
              className="loaderBox"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <CircularProgress color="primary" size={50} />
            </Box>
          )}
        </Box>
        <Box className="step2">
          {exchange && step >= 2 && (
            <>
              <ToggleButtonsExchangeType
                exchangeType={exchangeType}
                exchangeTypes={exchange.type}
                setExchangeType={setExchangeType}
              />
              <Box
                alignItems="flex-start"
                className="boxWrapper"
                display="flex"
                flexDirection="row"
              >
                <Box className="inputBox" mr={2}>
                  {quotesLoading && (
                    <Box className="quotesLoading">
                      <CircularProgress color="primary" size={30} />
                    </Box>
                  )}
                  {!quotesLoading && quotes.length && (
                    <>
                      <Controller
                        control={control}
                        defaultValue={quotes[0]}
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
                        rules={
                          {
                            //   required: intl.formatMessage({ id: "form.error.quote" }),
                          }
                        }
                      />
                      {errors.quote && <span className="errorText">{errors.quote.message}</span>}
                    </>
                  )}
                </Box>
                {selectedModel === MODEL_MONHTLY_FEE && (
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
                    <Controller
                      control={control}
                      name="minAllocatedBalance"
                      render={(props) => (
                        <TextField
                          className="customInput minAllocatedBalance"
                          error={!!errors.minAllocatedBalance}
                          fullWidth
                          onChange={(e) => {
                            let data = e.target.value;
                            if (data.match(/^$|^[0-9]\d*(?:[.,]\d{0,8})?$/)) {
                              data = data.replace(",", ".");
                              setAllocated(data);
                              props.onChange(data);
                            }
                          }}
                          value={allocated}
                          variant="outlined"
                        />
                      )}
                      rules={{
                        required: intl.formatMessage({ id: "form.error.minAllocatedBalance" }),
                      }}
                    />
                    {errors.minAllocatedBalance && (
                      <span className="errorText">{errors.minAllocatedBalance.message}</span>
                    )}
                  </Box>
                )}
              </Box>
              <Typography className="body1 tip">
                <FormattedMessage
                  id={
                    selectedModel === MODEL_PROFIT_SHARING
                      ? "copyt.cannotmodify"
                      : "copyt.cannotmodify.minAllocatedBalance"
                  }
                />
              </Typography>
              {step === 2 && (
                <CustomButton
                  className="bgPurple bold"
                  disabled={!isValid}
                  onClick={() => {
                    setStep(3);
                  }}
                >
                  <FormattedMessage id="accounts.next" />
                </CustomButton>
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
              <Box className="inputBox" display="flex" flexDirection="column">
                <label className="customLabel" htmlFor="name">
                  <FormattedMessage id="copyt.servicename" />
                </label>
                <OutlinedInput
                  className="customInput"
                  defaultValue=""
                  error={!!errors.name}
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
                disabled={!isValid}
                loading={loading}
                type="submit"
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
