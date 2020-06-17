import React, { useState, useCallback, useContext, useEffect } from "react";
import { Box, FormControlLabel, OutlinedInput, Typography } from "@material-ui/core";
import "./ExchangeAccountCreate.scss";
import { useForm, FormContext, Controller } from "react-hook-form";
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
const ExchangeAccountCreate = ({ create = false, demo = false, navigateToAction }) => {
  const { register, handleSubmit, errors, control, getValues, setValue, watch, reset } = useForm();
  const intl = useIntl();
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const {
    resetToPath,
    pathParams: { previousPath },
  } = useContext(ModalPathContext);

  const exchanges = useExchangeList();

  // Exchange options
  const exchangesOptions = exchanges
    .filter((e) => e.enabled && e.name.toLowerCase() !== "zignaly")
    .map((e) => e.name);

  const exchangeName = watch("exchangeName");
  const selectedExchange = exchanges.find((e) => e.name === exchangeName);
  console.log(exchangeName, selectedExchange);

  useEffect(() => {
    //   Set default exchange
    if (exchangesOptions.length && !exchangeName) {
      const defaultExchangeName = exchanges.find(
        (e) => e.name.toLowerCase() === (create ? "zignaly" : "binance"),
      ).name;
      setValue("exchangeName", defaultExchangeName);
    }
  }, [exchangesOptions]);

  // Create account types options
  const typeOptions = selectedExchange
    ? selectedExchange.type.map((t) => ({
        val: t,
        label: t.charAt(0).toUpperCase() + t.slice(1),
      }))
    : [];

  useEffect(() => {
    //   Set default account type
    if (selectedExchange) {
      setValue("exchangeType", typeOptions[0].val);
    }
  }, [selectedExchange]);

  const onSubmit = useCallback(() => {
    handleSubmit((data) => {
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

      tradeApi.exchangeAdd(payload).then(() => {
        // Reload user exchanges
        const authorizationPayload = {
          token: storeSession.tradeApi.accessToken,
        };
        dispatch(setUserExchanges(authorizationPayload));
        resetToPath(previousPath);
      });
    })();
    //   todo: remove selectedExchange and use form data?
  }, [selectedExchange]);
  useEvent("submit", onSubmit);

  //  if (!exchanges.length) {
  //    return <Loader />;
  //  }
  return (
    <form className="exchangeAccountCreate">
      <ExchangeAccountForm>
        {create ? (
          <Box>Zignaly Exchange</Box>
        ) : (
          <Controller
            as={CustomSelect}
            options={exchangesOptions}
            control={control}
            defaultValue={""}
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
            defaultValue={""}
            name="exchangeType"
            rules={{ required: true }}
            label={intl.formatMessage({ id: "accounts.exchange.type" })}
            //   onChange={([e]) => {
            //     console.log("e", e);
            //     return { val: e };
            //   }}
          />
        )}
        <CustomInput inputRef={register} name="internalName" label="accounts.exchange.name" />
        {!create &&
          selectedExchange &&
          selectedExchange.requiredAuthFields.map((field) => (
            <CustomInput
              inputRef={register}
              name={field}
              label={`accounts.exchange.${field}`}
              key={field}
            />
          ))}
      </ExchangeAccountForm>
    </form>
  );
};

export default ExchangeAccountCreate;
