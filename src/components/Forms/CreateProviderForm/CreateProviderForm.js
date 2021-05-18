import React, { useState } from "react";
import "./CreateProviderForm.scss";
import { Box, Typography, OutlinedInput, CircularProgress } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller, FormProvider } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showCreateProvider } from "../../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import CustomSelect from "../../CustomSelect";
import useExchangeList from "../../../hooks/useExchangeList";
import { navigate } from "gatsby";
import ProviderUserOptions from "./ProviderUserOptions";
import useExchangeQuotes from "../../../hooks/useExchangeQuotes";

const CREATE_PROVIDER_ID = "5b13fd81b233f6004cb8b882";

/**
 * @typedef {import('../../../services/tradeApiClient.types').ProviderOptions} ProviderOptions
 */

const CreateProviderForm = () => {
  const [loading, setLoading] = useState(false);
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const intl = useIntl();

  const methods = useForm();
  const { errors, handleSubmit, control, register, watch } = methods;
  const exchange = watch("exchange", "binance");
  const exchangeType = watch("exchangeType", "binance");
  const { exchanges } = useExchangeList();

  const selectedExchange = exchanges
    ? exchanges.find((e) => e.name.toLowerCase() === exchange.toLowerCase())
    : null;
  const exchangeOptions = exchanges
    ? exchanges
        .filter((e) => e.enabled && (exchangeType === "all" || e.type.includes(exchangeType)))
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

  if (typeOptions) {
    typeOptions.unshift({
      val: "all",
      label: intl.formatMessage({ id: "fil.allexchangeTypes" }),
    });
  }

  const { quoteAssets } = useExchangeQuotes({
    exchangeId: selectedExchange ? selectedExchange.id : "",
    exchangeType: selectedExchange ? selectedExchange.type[0] : "",
  });
  const quotes = Object.keys(quoteAssets);

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
      projectId: "z01",
      providerId: CREATE_PROVIDER_ID,
      version: 2,
      token: storeSession.tradeApi.accessToken,
    };
    tradeApi
      .providerCreate(payload)
      .then((response) => {
        const profileLink = `/${response.isCopyTrading ? "copyTraders" : "signalProviders"}/${
          response.id
        }/edit`;

        navigate(profileLink);
        dispatch(showCreateProvider(false));
      })
      .catch((e) => {
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
                  <FormattedMessage id="signalp.create" />
                </Typography>
                <Typography className="desc" variant="body1">
                  <FormattedMessage id="signalp.create.desc" />
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
                          value: 50,
                          message: intl.formatMessage({ id: "form.error.name.length" }),
                        },
                      })}
                      name="name"
                    />
                    {errors.name && <span className="errorText">{errors.name.message}</span>}
                  </Box>
                  <Box
                    alignItems="flex-start"
                    className="boxWrapper"
                    display="flex"
                    flexDirection="row"
                  >
                    <Box className="inputBox typeBox">
                      <Controller
                        control={control}
                        defaultValue={typeOptions[0].val}
                        name="exchangeType"
                        render={({ onChange, value }) => (
                          <CustomSelect
                            label={intl.formatMessage({
                              id: "accounts.exchange.type",
                            })}
                            labelPlacement="top"
                            onChange={onChange}
                            options={typeOptions}
                            value={value}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                  <ProviderUserOptions exchangeOptions={exchangeOptions} quotes={quotes} />
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
