import React, { useState } from "react";
import "./CreateProviderForm.scss";
import { Box, Typography, OutlinedInput, CircularProgress } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import { ask2FA } from "../../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import CustomSelect from "../../CustomSelect";
import useQuoteAssets from "../../../hooks/useQuoteAssets";
import useExchangeList from "../../../hooks/useExchangeList";

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

  const { errors, handleSubmit, control, formState, register, watch, setValue } = useForm();
  const exchangeName = watch("exchangeName", "binance");
  console.log(exchangeName);
  //   const selectedExchange = exchanges.find(
  //     (e) => e.name.toLowerCase() === exchangeName.toLowerCase(),
  //   );

  const quoteAssets = useQuoteAssets(isCopyTrading);
  const quotes = Object.keys(quoteAssets);
  const exchanges = useExchangeList(isCopyTrading);
  const exchangeOptions = exchanges
    .filter((e) => e.enabled)
    .map((e) => ({
      val: e.name.toLowerCase(),
      label: e.name,
    }));
  const selectedExchange = exchanges.find(
    (e) => e.name.toLowerCase() === exchangeName.toLowerCase(),
  );
  const typeOptions =
    selectedExchange &&
    selectedExchange.type.map((t) => ({
      val: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
    }));

  /**
   * @typedef {Object} FormData
   * @property {string} code
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
      code: data.code,
      token: storeSession.tradeApi.accessToken,
    };

    tradeApi
      .verify2FA(payload)
      .then(() => {
        dispatch(ask2FA(false));
      })
      .catch((e) => {
        if (e.code === 37) {
          //   setError("code", "notMatch", "Wrong code.");
          setCodeError(true);
        } else {
          dispatch(showErrorAlert(e));
        }
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Box
        alignItems="center"
        className="createProviderForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {selectedExchange ? (
          <>
            <Typography variant="h3">
              <FormattedMessage id={`${isCopyTrading ? "copyt" : "signalp"}.create`} />
            </Typography>
            <Typography variant="body1" className="desc">
              <FormattedMessage id={`${isCopyTrading ? "copyt" : "signalp"}.create.desc`} />
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Box className="inputBox" display="flex" flexDirection="column" width={1}>
                <label className="customLabel callout2">
                  <FormattedMessage id="provider.name" />
                </label>
                <OutlinedInput
                  className="customInput"
                  error={!!errors.name}
                  inputRef={register({
                    required: "Name is required",
                  })}
                  name="name"
                  fullWidth
                />
                <span className="errorText">{errors.name && errors.name.message}</span>
              </Box>
              {isCopyTrading && (
                <>
                  <Box display="flex" flexDirection="row">
                    <Box className="inputBox minBalanceBox" display="flex" flexDirection="column">
                      <label className="customLabel">
                        <Typography noWrap className="callout2">
                          <FormattedMessage id="srv.edit.minbalance" />
                        </Typography>
                      </label>
                      <OutlinedInput
                        className="customInput"
                        error={!!errors.minBalance}
                        inputRef={register({
                          required: "Min allocated balance is required",
                        })}
                        name="minBalance"
                      />
                      <span className="errorText">
                        {errors.minBalance && errors.minBalance.message}
                      </span>
                    </Box>
                    <Controller
                      as={CustomSelect}
                      control={control}
                      defaultValue={"USDT"}
                      label={intl.formatMessage({
                        id: "fil.quote",
                      })}
                      name="quote"
                      options={quotes}
                      rules={{ required: "Quote is required" }}
                      search={true}
                      labelPlacement="top"
                    />
                    <span className="errorText">{errors.quote && errors.quote.message}</span>
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <Controller
                      as={CustomSelect}
                      control={control}
                      defaultValue={selectedExchange.name.toLowerCase()}
                      label={intl.formatMessage({
                        id: "accounts.exchange",
                      })}
                      name="exchangeName"
                      options={exchangeOptions}
                      labelPlacement="top"
                      onChange={([e]) => {
                        setValue("exchangeType", typeOptions[0].val);
                        return e;
                      }}
                    />
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
                </>
              )}
            </Box>
            <CustomButton className="bgPurple" loading={loading} type="submit">
              <FormattedMessage id="provider.createaccount" />
            </CustomButton>
          </>
        ) : (
          <CircularProgress className="loader" />
        )}
      </Box>
    </form>
  );
};

export default CreateProviderForm;
