import React, { useState, useCallback, useContext, useEffect, useImperativeHandle } from "react";
import {
  Box,
  FormControlLabel,
  OutlinedInput,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import "./ExchangeAccountAdd.scss";
import { useForm, FormContext, Controller, useFormContext } from "react-hook-form";
import CustomSelect from "../../CustomSelect";
import { FormattedMessage, useIntl } from "react-intl";
import useExchangeList from "../../../hooks/useExchangeList";
import useEvent from "../../../hooks/useEvent";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import ModalPathContext from "../ModalPathContext";
import Loader from "../../Loader";
import { useDispatch } from "react-redux";
import { setUserExchanges } from "../../../store/actions/user";
import ExchangeAccountForm, { CustomInput } from "../ExchangeAccountForm";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeListEntity} ExchangeListEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {string} internalId Internal Exchange id.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountAdd = ({ create = false, demo = false, navigateToAction }) => {
  const {
    register,
    handleSubmit,
    errors,
    control,
    getValues,
    setValue,
    watch,
    reset,
  } = useFormContext();
  const intl = useIntl();
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const {
    resetToPath,
    pathParams: { previousPath },
    setTitle,
    formRef,
    setTempMessage,
  } = useContext(ModalPathContext);

  useEffect(() => {
    setTitle(
      <FormattedMessage
        id={
          create ? (demo ? "accounts.create.demo" : "accounts.create.exchange") : "accounts.connect"
        }
      />,
    );
  }, []);

  const exchanges = useExchangeList();

  // Initialize selected exchange
  let exchangeName = create ? "zignaly" : watch("exchangeName") || "binance";
  const selectedExchange = exchanges.find((e) =>
    e.name.toLowerCase() === exchangeName ? exchangeName.toLowerCase() : "",
  );
  console.log(exchangeName, selectedExchange);

  // Connect exchange options
  const exchangesOptions = exchanges
    .filter((e) => e.enabled && e.name.toLowerCase() !== "zignaly")
    .map((e) => e.name);

  // Create account types options
  const typeOptions =
    selectedExchange &&
    selectedExchange.type.map((t) => ({
      val: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
    }));

  // Submit form handle
  useImperativeHandle(
    formRef,
    () => ({
      submitForm,
    }),
    [selectedExchange],
  );

  const submitForm = async (data) => {
    const { internalName, exchangeType, key, secret, password } = data;
    const payload = {
      token: storeSession.tradeApi.accessToken,
      exchangeId: selectedExchange.id,
      internalName,
      exchangeType,
      ...(!create && {
        key,
        secret,
        ...(password && { password }),
      }),
      mainAccount: false,
      isPaperTrading: demo,
      testNet: false,
    };

    return tradeApi.exchangeAdd(payload).then(() => {
      // Reload user exchanges
      const authorizationPayload = {
        token: storeSession.tradeApi.accessToken,
      };
      dispatch(setUserExchanges(authorizationPayload));
      setTempMessage(<FormattedMessage id={create ? "accounts.created" : "accounts.deleted"} />);
      return true;
    });
  };

  return (
    <form className="ExchangeAccountAdd">
      {!selectedExchange ? (
        <Box className="loadProgress" display="flex" flexDirection="row" justifyContent="center">
          <CircularProgress disableShrink />
        </Box>
      ) : (
        <ExchangeAccountForm>
          {!create && (
            <Controller
              as={CustomSelect}
              options={exchangesOptions}
              control={control}
              defaultValue={selectedExchange.name}
              name="exchangeName"
              rules={{ required: true }}
              label={intl.formatMessage({ id: "accounts.exchange" })}
            />
          )}
          {typeOptions.length > 1 && (
            <Controller
              as={CustomSelect}
              options={typeOptions}
              control={control}
              defaultValue={typeOptions[0].val}
              name="exchangeType"
              rules={{ required: true }}
              label={intl.formatMessage({ id: "accounts.exchange.type" })}
            />
          )}
          <CustomInput
            inputRef={register({
              required: "name empty",
            })}
            name="internalName"
            label="accounts.exchange.name"
            errors={errors}
          />
          {!create ? (
            selectedExchange.requiredAuthFields.map((field) => (
              <CustomInput
                inputRef={register}
                name={field}
                label={`accounts.exchange.${field}`}
                key={field}
                autoComplete="new-password"
                type="password"
              />
            ))
          ) : (
            <Box className="exchangeSubtitle">
              <FormattedMessage id="accounts.powered" />
            </Box>
          )}
        </ExchangeAccountForm>
      )}
    </form>
  );
};

export default ExchangeAccountAdd;
