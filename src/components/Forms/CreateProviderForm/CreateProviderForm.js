import React, { useState } from "react";
import "./CreateProviderForm.scss";
import { Box, Typography, OutlinedInput } from "@material-ui/core";
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
import useExchangesOptions from "../../../hooks/useExchangesOptions";

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

  const quoteAssets = useQuoteAssets();
  const quotes = Object.keys(quoteAssets);
  const exchanges = useExchangesOptions(false);

  const { errors, handleSubmit, control, formState, register } = useForm({
    mode: "onChange",
  });

  const { isValid } = formState;

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
        <Typography variant="h3">
          <FormattedMessage id={`${isCopyTrading ? "copyt" : "signalp"}.create`} />
        </Typography>
        <Typography variant="body1">
          <FormattedMessage id={`${isCopyTrading ? "copyt" : "signalp"}.create.desc`} />
        </Typography>
        <Box display="flex" flexDirection="row">
          <Box className="inputBox" display="flex" flexDirection="column">
            <label className="customLabel">
              <FormattedMessage id="provider.name" />
              <OutlinedInput
                className="customInput"
                error={!!errors.name}
                inputRef={register({
                  required: "Name is required",
                })}
                name="name"
              />
            </label>
            <span className="errorText">{errors.name && errors.name.message}</span>
          </Box>
          <Box className="inputBox" display="flex" flexDirection="column">
            <label className="customLabel">
              <FormattedMessage id="srv.edit.minbalance" />
              <OutlinedInput
                className="customInput"
                error={!!errors.minBalance}
                inputRef={register({
                  required: "Min allocated balance is required",
                })}
                name="minBalance"
              />
            </label>
            <span className="errorText">{errors.minBalance && errors.minBalance.message}</span>
          </Box>
        </Box>
        <Box className="inputBox" display="flex" flexDirection="column">
          <Controller
            as={CustomSelect}
            control={control}
            defaultValue={"USDT"}
            label={intl.formatMessage({
              id: "fil.quote",
            })}
            name="quote"
            // onChange={([e]) => {
            //   setValue("exchangeType", typeOptions[0].val);
            //   setValue("testnet", false);
            //   return e;
            // }}
            options={quotes}
            rules={{ required: "Quote is required" }}
            search={true}
          />
          <span className="errorText">{errors.quote && errors.quote.message}</span>
        </Box>
        <Box className="inputBox" display="flex" flexDirection="column">
          <Controller
            as={CustomSelect}
            control={control}
            defaultValue={exchanges[0]}
            label={intl.formatMessage({
              id: "accounts.exchange",
            })}
            name="exchangeName"
            options={exchanges}
          />
        </Box>
        <CustomButton className="bgPurple" loading={loading} type="submit">
          <FormattedMessage id="provider.createaccount" />
        </CustomButton>
      </Box>
    </form>
  );
};

export default CreateProviderForm;
