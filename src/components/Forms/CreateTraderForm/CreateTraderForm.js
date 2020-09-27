import React, { useState, useEffect } from "react";
import "./CreateTraderForm.scss";
import { Box, Typography, OutlinedInput, CircularProgress, Hidden } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller, FormProvider } from "react-hook-form";
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

const CREATE_PROVIDER_ID = "5b13fd81b233f6004cb8b882";
const MODEL_PROFIT_SHARING = 0;
const MODEL_MONHTLY_FEE = 1;

/**
 * @typedef {import('../../../services/tradeApiClient.types').NewProviderEntity} NewProviderEntity
 * @typedef {import('../../../services/tradeApiClient.types').ProviderOptions} ProviderOptions
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

  const { errors, handleSubmit, control, register, watch, setValue } = useForm();

  /**
   * @typedef {ProviderOptions & Object} FormData
   * @property {string} name
   * @property {string} [exchange]
   * @property {string} [exchangeType]
   * @property {string} [minAllocatedBalance]
   * @property {string} [quote]
   * @property {string} [disclaimer]
   * @property {string} [exchangeType]
   * @property {Array<string>} [quotes]
   * @property {Array<string>} [exchanges]
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const submitForm = (data) => {
    setLoading(true);
    const payload = {
      ...data,
      ...(!isCopyTrading && {
        projectId: "z01",
        description: "",
        providerId: CREATE_PROVIDER_ID,
        version: 2,
      }),
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
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <img
                      className={`iconButton ${
                        selectedModel === MODEL_PROFIT_SHARING ? "selected" : ""
                      }`}
                      onClick={() => setSelectedModel(MODEL_PROFIT_SHARING)}
                      src={MonthlyFee}
                      title={intl.formatMessage({ id: "copyt.profitsharing.service" })}
                    />
                    <Typography className="callout2">
                      <FormattedMessage id="copyt.profitsharing.service" />
                    </Typography>
                  </Box>
                )}

                <Box display="flex" flexDirection="row" alignItems="center">
                  <img
                    className={`iconButton ${
                      selectedModel === MODEL_MONHTLY_FEE ? "selected" : ""
                    }`}
                    onClick={() => setSelectedModel(MODEL_MONHTLY_FEE)}
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
              {step === 1 && (
                <CustomButton className="bgPurple bold" onClick={() => setStep(2)}>
                  <FormattedMessage id="accounts.next" />
                </CustomButton>
              )}
            </>
          ) : (
            <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center">
              <CircularProgress color="primary" size={50} />
            </Box>
          )}
        </Box>
        <Box className="step2">
          {exchange && step >= 2 && (
            <>
              <ToggleButtonsExchangeType
                exchange={exchange}
                setExchangeType={setExchangeType}
                exchangeType={exchangeType}
              />
              <Box display="flex" flexDirection="column" className="inputBox">
                <label htmlFor="name">
                  <Typography className="accountLabel">
                    <FormattedMessage id="copyt.servicename" />
                  </Typography>
                </label>
                <OutlinedInput
                  className="customInput"
                  defaultValue=""
                  id="name"
                  inputRef={register()}
                  name="name"
                />
                {errors && errors.name && <span className="errorText">{errors.name.message}</span>}
              </Box>

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
                    error={!!errors.minBalance}
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
              <Box
                alignItems="flex-end"
                className="actionStep2"
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                {step === 2 && (
                  <Hidden xsDown>
                    <CustomButton
                      className="bgPurple bold"
                      // disabled={!isValid}
                      onClick={() => setStep(3)}
                    >
                      <FormattedMessage id="accounts.next" />
                    </CustomButton>
                  </Hidden>
                )}
              </Box>
              {/* {tipsExpanded && (
              <Typography className="tips">
                <FormattedMessage id={`accounts.exchange.api.tip.${exchangeName.toLowerCase()}`} />
              </Typography>
            )} */}
              {step === 2 && (
                <Hidden smUp>
                  <CustomButton
                    className="bgPurple bold"
                    //   disabled={!isValid}
                    loading={loading}
                    type="submit"
                  >
                    <FormattedMessage id="accounts.next" />
                  </CustomButton>
                </Hidden>
              )}
            </>
          )}
        </Box>
        <Box className="step3">
          {step === 3 && (
            <>
              <Typography variant="h3">
                <FormattedMessage id="accounts.connect.ready" />
              </Typography>
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
                  className="customInput"
                  error={!!errors.minBalance}
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
              <CustomButton className="bgPurple bold" loading={loading} type="submit">
                <FormattedMessage id="accounts.connect.button" />
              </CustomButton>
            </>
          )}
        </Box>
      </form>
    </Box>
  );

  //   return (
  //     <FormProvider {...methods}>
  //       <form noValidate onSubmit={handleSubmit(submitForm)}>
  //         <Box
  //           alignItems="center"
  //           className="createTraderForm"
  //           display="flex"
  //           flexDirection="column"
  //           justifyContent="center"
  //         >
  //           {selectedExchange ? (
  //             <Box className="formContent">
  //               <>
  //                 <Typography variant="h3">
  //                   <FormattedMessage id={`${isCopyTrading ? "copyt" : "signalp"}.create`} />
  //                 </Typography>
  //                 <Typography className="desc" variant="body1">
  //                   <FormattedMessage id={`${isCopyTrading ? "copyt" : "signalp"}.create.desc`} />
  //                 </Typography>
  //                 <Box alignItems="flex-start" display="flex" flexDirection="column">
  //                   <Box className="inputBox nameBox" display="flex" flexDirection="column" mr={1}>
  //                     <label className="customLabel">
  //                       <FormattedMessage id="provider.name" />
  //                     </label>
  //                     <OutlinedInput
  //                       className="customInput"
  //                       error={!!errors.name}
  //                       fullWidth
  //                       inputRef={register({
  //                         required: intl.formatMessage({ id: "form.error.name" }),
  //                         minLength: {
  //                           value: 5,
  //                           message: intl.formatMessage({ id: "form.error.name.length" }),
  //                         },
  //                         maxLength: {
  //                           value: 50,
  //                           message: intl.formatMessage({ id: "form.error.name.length" }),
  //                         },
  //                       })}
  //                       name="name"
  //                     />
  //                     {errors.name && <span className="errorText">{errors.name.message}</span>}
  //                   </Box>
  //                   <Box
  //                     alignItems="flex-start"
  //                     className="boxWrapper"
  //                     display="flex"
  //                     flexDirection="row"
  //                   >
  //                     {isCopyTrading && (
  //                       <Box className="inputBox typeBox" display="flex" flex={1} pr={1}>
  //                         <Controller
  //                           control={control}
  //                           defaultValue={selectedExchange.name.toLowerCase()}
  //                           name="exchange"
  //                           render={({ onChange, value }) => (
  //                             <CustomSelect
  //                               label={intl.formatMessage({
  //                                 id: "accounts.exchange",
  //                               })}
  //                               labelPlacement="top"
  //                               onChange={(/** @type {string} **/ v) => {
  //                                 setValue("exchangeType", typeOptions[0].val);
  //                                 onChange(v);
  //                               }}
  //                               options={exchangeOptions}
  //                               value={value}
  //                             />
  //                           )}
  //                         />
  //                       </Box>
  //                     )}
  //                     <Box className="inputBox typeBox" pl={isCopyTrading ? 1 : 0}>
  //                       <Controller
  //                         control={control}
  //                         defaultValue={typeOptions[0].val}
  //                         name="exchangeType"
  //                         render={({ onChange, value }) => (
  //                           <CustomSelect
  //                             label={intl.formatMessage({
  //                               id: "accounts.exchange.type",
  //                             })}
  //                             labelPlacement="top"
  //                             onChange={onChange}
  //                             options={typeOptions}
  //                             value={value}
  //                           />
  //                         )}
  //                       />
  //                     </Box>
  //                   </Box>
  //                   {isCopyTrading ? (
  //                     <Box
  //                       alignItems="flex-start"
  //                       className="boxWrapper"
  //                       display="flex"
  //                       flexDirection="row"
  //                     >
  //                       <Box
  //                         className="inputBox minBalanceBox"
  //                         display="flex"
  //                         flex={1}
  //                         flexDirection="column"
  //                         mr={1}
  //                       >
  //                         <label className="customLabel">
  //                           <Typography className="callout2 selectLabel" noWrap>
  //                             <FormattedMessage id="srv.edit.minbalance" />
  //                           </Typography>
  //                         </label>
  //                         <OutlinedInput
  //                           className="customInput"
  //                           error={!!errors.minBalance}
  //                           inputProps={{
  //                             min: 0,
  //                           }}
  //                           inputRef={register({
  //                             required: intl.formatMessage({ id: "form.error.minAllocatedBalance" }),
  //                             min: 0,
  //                           })}
  //                           name="minAllocatedBalance"
  //                           type="number"
  //                         />
  //                         {errors.minAllocatedBalance && (
  //                           <span className="errorText">{errors.minAllocatedBalance.message}</span>
  //                         )}
  //                       </Box>
  //                       <Box className="inputBox" display="flex" flex={1} ml={1}>
  //                         <Controller
  //                           control={control}
  //                           defaultValue={"USDT"}
  //                           name="quote"
  //                           render={({ onChange, value }) => (
  //                             <CustomSelect
  //                               label={intl.formatMessage({
  //                                 id: "fil.quote",
  //                               })}
  //                               labelPlacement="top"
  //                               onChange={onChange}
  //                               options={quotes}
  //                               search={true}
  //                               value={value}
  //                             />
  //                           )}
  //                           rules={{
  //                             required: intl.formatMessage({ id: "form.error.quote" }),
  //                           }}
  //                         />
  //                         {errors.quote && <span className="errorText">{errors.quote.message}</span>}
  //                       </Box>
  //                     </Box>
  //                   ) : (
  //                     <ProviderUserOptions exchangeOptions={exchangeOptions} quotes={quotes} />
  //                   )}
  //                 </Box>
  //                 <CustomButton className="bgPurple" loading={loading} type="submit">
  //                   <FormattedMessage id="provider.createaccount" />
  //                 </CustomButton>
  //               </>
  //             </Box>
  //           ) : (
  //             <CircularProgress className="loader" />
  //           )}
  //         </Box>
  //       </form>
  //     </FormProvider>
  //   );
};

export default CreateTraderForm;
