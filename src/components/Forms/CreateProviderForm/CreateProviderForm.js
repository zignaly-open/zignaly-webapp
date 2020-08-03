import React, { useState, useEffect } from "react";
import "./CreateProviderForm.scss";
import {
  Box,
  Typography,
  OutlinedInput,
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControlLabel,
  FormLabel,
  FormControl,
  FormGroup,
  FormHelperText,
  Checkbox,
} from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller, FormProvider } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showCreateProvider } from "../../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import CustomSelect from "../../CustomSelect";
import useQuoteAssets from "../../../hooks/useQuoteAssets";
import useExchangeList from "../../../hooks/useExchangeList";
import { navigate } from "gatsby";
import ProviderUserOptions from "./ProviderUserOptions";
/**
 * @typedef {import('../../../services/tradeApiClient.types').NewProviderEntity} NewProviderEntity
 */

/**
 * @typedef {Object} CreateProviderFormPropTypes
 * @property {boolean} isCopyTrading isCopyTrading
 */

/**
 * Provides a form to create a provider account
 *
 * @param {CreateProviderFormPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const CreateProviderForm = ({ isCopyTrading }) => {
  const [loading, setLoading] = useState(false);
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const intl = useIntl();

  const methods = useForm();
  const { errors, handleSubmit, control, register, watch, setValue } = methods;
  const exchange = watch("exchange", "binance");
  const exchanges = useExchangeList();
  // Selected exchanges list for signal providers.
  const [selectedExchanges, setSelectedExchanges] = useState([]);

  const selectedExchange = exchanges
    ? exchanges.find((e) => e.name.toLowerCase() === exchange.toLowerCase())
    : null;
  const exchangeOptions = exchanges
    ? exchanges
        .filter((e) => e.enabled)
        .map((e) => ({
          val: e.name.toLowerCase(),
          label: e.name,
        }))
    : null;

  const typeOptions =
    selectedExchange &&
    selectedExchange.type.map((t) => ({
      val: t,
      // Uppercase label
      label: t.charAt(0).toUpperCase() + t.slice(1),
    }));

  if (!isCopyTrading && typeOptions) {
    typeOptions.unshift({
      val: "all",
      label: intl.formatMessage({ id: "fil.allexchangeTypes" }),
    });
  }

  const quoteAssets = useQuoteAssets(
    !isCopyTrading || Boolean(selectedExchange),
    selectedExchange ? selectedExchange.id : "",
  );
  const quotes = Object.keys(quoteAssets);

  useEffect(() => {
    if (exchanges) {
      // Select all exchanges by default for signal providers
      const _selectedExchanges = [];
      for (let i = 0; i < exchangeOptions.length; i++) {
        const e = exchangeOptions[i];
        _selectedExchanges.push(e.val);
      }
      console.log(_selectedExchanges);
      setSelectedExchanges(_selectedExchanges);
    }
  }, [exchanges]);

  /**
   * @typedef {Object} FormData
   * @property {string} name
   * @property {string} [exchange]
   * @property {string} [exchangeType]
   * @property {string} [minAllocatedBalance]
   * @property {string} [quote]
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const submitForm = (data) => {
    console.log(data);
    return;
    setLoading(true);
    const payload = {
      ...data,
      token: storeSession.tradeApi.accessToken,
    };

    const apiMethod = isCopyTrading ? tradeApi.copyTraderCreate : tradeApi.providerCreate;

    apiMethod
      .call(tradeApi, payload)
      .then((/** @type {NewProviderEntity} **/ response) => {
        const profileLink = `/${response.isCopyTrading ? "copyTraders" : "signalProviders"}/${
          response.id
        }/edit`;

        navigate(profileLink);
        dispatch(showCreateProvider(false));
      })
      .catch((/** @type {*} **/ e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={handleSubmit(submitForm)}>
        <Box
          alignItems="center"
          className="createProviderForm"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {selectedExchange ? (
            <Box className="formContent">
              <>
                <Typography variant="h3">
                  <FormattedMessage id={`${isCopyTrading ? "copyt" : "signalp"}.create`} />
                </Typography>
                <Typography className="desc" variant="body1">
                  <FormattedMessage id="copyt.create.desc" />
                </Typography>
                <Box alignItems="flex-start" display="flex" flexDirection="column">
                  <Box className="inputBox nameBox" display="flex" flexDirection="column" mr={1}>
                    <label className="customLabel">
                      <FormattedMessage id="provider.name" />
                    </label>
                    <OutlinedInput
                      className="customInput"
                      error={!!errors.name}
                      fullWidth
                      inputRef={register({
                        required: intl.formatMessage({ id: "form.error.name" }),
                        minLength: {
                          value: 5,
                          message: intl.formatMessage({ id: "form.error.name.length" }),
                        },
                        maxLength: {
                          value: 90,
                          message: intl.formatMessage({ id: "form.error.name.length" }),
                        },
                      })}
                      name="name"
                    />
                    {errors.name && <span className="errorText">{errors.name.message}</span>}
                  </Box>
                  <Box display="flex" flexDirection="row" width={1}>
                    {isCopyTrading && (
                      <Box display="flex" flex={1} pr={1} className="inputBox typeBox">
                        <Controller
                          as={CustomSelect}
                          control={control}
                          defaultValue={selectedExchange.name.toLowerCase()}
                          label={intl.formatMessage({
                            id: "accounts.exchange",
                          })}
                          labelPlacement="top"
                          name="exchange"
                          onChange={([e]) => {
                            setValue("exchangeType", typeOptions[0].val);
                            return e;
                          }}
                          options={exchangeOptions}
                        />
                      </Box>
                    )}
                    <Box className="inputBox typeBox" pl={isCopyTrading ? 1 : 0}>
                      <Controller
                        as={CustomSelect}
                        control={control}
                        defaultValue={typeOptions[0].val}
                        label={intl.formatMessage({
                          id: "accounts.exchange.type",
                        })}
                        labelPlacement="top"
                        name="exchangeType"
                        options={typeOptions}
                      />
                    </Box>
                  </Box>
                  {isCopyTrading ? (
                    <Box className="inputBox" display="flex" flexDirection="row">
                      <Box
                        className="inputBox minBalanceBox"
                        display="flex"
                        flexDirection="column"
                        mr={1}
                        flex={1}
                      >
                        <label className="customLabel">
                          <Typography noWrap>
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
                      <Box ml={1} display="flex" flex={1}>
                        <Controller
                          as={CustomSelect}
                          control={control}
                          defaultValue={"USDT"}
                          label={intl.formatMessage({
                            id: "fil.quote",
                          })}
                          labelPlacement="top"
                          name="quote"
                          options={quotes}
                          rules={{
                            required: intl.formatMessage({ id: "form.error.quote" }),
                          }}
                          search={true}
                        />
                        {errors.quote && <span className="errorText">{errors.quote.message}</span>}
                      </Box>
                    </Box>
                  ) : (
                    <ProviderUserOptions
                      setSelectedExchanges={setSelectedExchanges}
                      selectedExchanges={selectedExchanges}
                      exchangeOptions={exchangeOptions}
                      quotes={quotes}
                    />
                  )}
                </Box>
                <CustomButton className="bgPurple" loading={loading} type="submit">
                  <FormattedMessage id="provider.createaccount" />
                </CustomButton>
              </>
            </Box>
          ) : (
            <CircularProgress className="loader" />
          )}
        </Box>
      </form>
    </FormProvider>
  );
};

export default CreateProviderForm;
