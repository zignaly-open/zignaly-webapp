import React, { useState, useEffect } from "react";
import "./CreateTraderForm.scss";
import {
  Box,
  Typography,
  OutlinedInput,
  CircularProgress,
  TextField,
  Tooltip,
  FormHelperText,
} from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert, showCreateTrader } from "../../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import CustomSelect from "../../CustomSelect";
import useExchangeList from "../../../hooks/useExchangeList";
import { navigate } from "gatsby";
import ExchangeIcon from "../../ExchangeIcon";
import ToggleButtonsExchangeType from "../../ConnectExchangeView/ToggleButtonsExchangeType";
import useExchangeQuotes from "../../../hooks/useExchangeQuotes";
import { getUserData } from "store/actions/user";
import CustomNumberInput from "../CustomNumberInput";
import TooltipWithUrl from "components/Controls/TooltipWithUrl";
import { highWaterMarkInfoUrl, psCreateInfoUrl } from "utils/affiliateURLs";
import HelpIcon from "@material-ui/icons/Help";

const MODEL_PROFIT_SHARING = 0;
const MODEL_MONHTLY_FEE = 1;

/**
 * @typedef {import('../../../services/tradeApiClient.types').ExchangeListEntity} ExchangeListEntity
 * @typedef {Object} DefaultProps
 * @property {boolean} isCopyTrading
 */

/**
 * Component to create a copytrader/profitsharing service.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const CreateTraderForm = ({ isCopyTrading }) => {
  const [loading, setLoading] = useState(false);
  const [allocated, setAllocated] = useState("");
  const selectedModel = isCopyTrading ? MODEL_MONHTLY_FEE : MODEL_PROFIT_SHARING;
  const [exchange, setExchange] = useState(/** @type {ExchangeListEntity} **/ (null));
  const [exchangeType, setExchangeType] = useState(null);
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const intl = useIntl();
  let { exchanges } = useExchangeList();

  const {
    errors,
    handleSubmit,
    control,
    register,
    setValue,
    formState: { isValid, dirtyFields },
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
    };

    tradeApi
      .copyTraderCreate(payload)
      .then((response) => {
        const profileLink = `/${isCopyTrading ? "copyTraders" : "profitSharing"}/${
          response.id
        }/edit`;
        navigate(profileLink);
        dispatch(showCreateTrader(false));
        // Refresh user data to show My Services tab
        dispatch(getUserData());
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  return (
    <Box className="createTraderForm">
      <Typography variant="h1">
        <FormattedMessage id={`${isCopyTrading ? "copyt" : "profit"}.create`} />
      </Typography>
      <Typography className="subHeader">
        <FormattedMessage id={`${isCopyTrading ? "copyt" : "profit"}.create.desc`} />
      </Typography>
      <form method="post" onSubmit={handleSubmit(submitForm)}>
        <Box alignItems="flex-start" className="step1" display="flex" flexDirection="column">
          {exchanges ? (
            <>
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
                <FormattedMessage id="copyt.lastStep" />
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
                <>
                  <Box className="inputBox" display="flex" flexDirection="column">
                    <Tooltip
                      interactive
                      placement="top"
                      title={<FormattedMessage id="profitsharing.successFee.tooltip" />}
                    >
                      <label className="customLabel">
                        <FormattedMessage id="copyt.successfee" />
                        <HelpIcon className="helpIcon" />
                      </label>
                    </Tooltip>
                    <CustomNumberInput
                      control={control}
                      errors={errors}
                      name="profitsShare"
                      rules={{
                        validate: (value) =>
                          !value ||
                          (parseFloat(value) >= 5 && parseFloat(value) < 100) ||
                          intl.formatMessage({ id: "form.error.profitsharing" }),
                      }}
                      suffix="%"
                    />
                  </Box>
                  <Box className="inputBox" display="flex" flexDirection="column">
                    <Tooltip
                      interactive
                      placement="top"
                      title={
                        <TooltipWithUrl
                          message="copyt.profitsharing.maxDrawdown.tooltip"
                          url={psCreateInfoUrl}
                        />
                      }
                    >
                      <label className="customLabel">
                        <FormattedMessage id="copyt.profitsharing.maxDrawdown" />
                        <HelpIcon className="helpIcon" />
                      </label>
                    </Tooltip>
                    <CustomNumberInput
                      allowNegative={true}
                      control={control}
                      defaultValue="-"
                      errors={errors}
                      name="maxDrawdown"
                      rules={{
                        validate: {
                          max: (val) =>
                            (val <= -5 && val >= -100) ||
                            intl.formatMessage({
                              id: "copyt.profitsharing.maxDrawdown.range",
                            }),
                        },
                        required: intl.formatMessage({
                          id: "copyt.profitsharing.maxDrawdown.required",
                        }),
                      }}
                      suffix="%"
                    />
                    {dirtyFields.maxDrawdown && (
                      <FormHelperText>
                        <FormattedMessage id="copyt.profitsharing.maxDrawdown.definitive" />
                      </FormHelperText>
                    )}
                  </Box>
                </>
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
