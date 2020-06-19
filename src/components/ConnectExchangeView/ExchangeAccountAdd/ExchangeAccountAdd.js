import React, { useContext, useEffect, useImperativeHandle } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import "./ExchangeAccountAdd.scss";
import { Controller, useFormContext } from "react-hook-form";
import CustomSelect from "../../CustomSelect";
import { FormattedMessage, useIntl } from "react-intl";
import useExchangeList from "../../../hooks/useExchangeList";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import ModalPathContext from "../ModalPathContext";
import { useDispatch } from "react-redux";
import { setUserExchanges } from "../../../store/actions/user";
import ExchangeAccountForm, { CustomInput, CustomSwitch } from "../ExchangeAccountForm";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeListEntity} ExchangeListEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {boolean} create Flag to indicate if the user is creating or connecting an account.
 * @property {boolean} demo Flag to indicate if it's a demo account.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountAdd = ({ create, demo }) => {
  const { register, control, setValue, watch } = useFormContext();
  const intl = useIntl();
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const { setTitle, formRef, setTempMessage } = useContext(ModalPathContext);

  useEffect(() => {
    setTitle(
      <FormattedMessage
        id={
          create ? (demo ? "accounts.create.demo" : "accounts.create.exchange") : "accounts.connect"
        }
      />,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exchanges = useExchangeList();
  const zignalyOnly = create && !demo;

  // Initialize selected exchange
  let exchangeName = zignalyOnly ? "zignaly" : watch("exchangeName") || "binance";

  const exchangeType = watch("exchangeType");
  const testnet = watch("testnet");
  // Show testnet only for binance demo futures
  const showTestnet =
    demo && exchangeType === "futures" && exchangeName.toLowerCase() === "binance";

  const selectedExchange = exchanges.find(
    (e) => e.name.toLowerCase() === exchangeName.toLowerCase(),
  );

  // Exchange options
  const exchangesOptions = exchanges
    // Filter disabled exchange and Zignaly if connection
    .filter((e) => e.enabled && (e.name.toLowerCase() !== "zignaly" || create))
    .map((e) => ({
      val: e.name.toLowerCase(),
      label:
        e.name.toLowerCase() === "zignaly"
          ? `${e.name} (${intl.formatMessage({
              id: "accounts.powered",
            })})`
          : e.name,
    }));

  // Create account types options
  const typeOptions =
    selectedExchange &&
    selectedExchange.type.map((t) => ({
      val: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
    }));

  // Expose submitForm handler to ref so it can be triggered from the parent.
  useImperativeHandle(
    formRef,
    () => ({
      submitForm,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedExchange],
  );

  /**
   * @typedef {Object} FormData
   * @property {String} internalName
   * @property {String} key
   * @property {String} secret
   * @property {String} password
   * @property {Boolean} testNet
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {Promise<boolean>} API promise.
   */
  const submitForm = async (data) => {
    const { internalName, key, secret, password, testNet } = data;
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
      testNet,
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
    <form className="exchangeAccountAdd">
      {!selectedExchange ? (
        <Box className="loadProgress" display="flex" flexDirection="row" justifyContent="center">
          <CircularProgress disableShrink />
        </Box>
      ) : (
        <ExchangeAccountForm>
          {!create ||
            (demo && (
              <Controller
                as={CustomSelect}
                control={control}
                defaultValue={selectedExchange.name.toLowerCase()}
                label={intl.formatMessage({
                  id: "accounts.exchange",
                })}
                name="exchangeName"
                onChange={([e]) => {
                  setValue("exchangeType", typeOptions[0].val);
                  setValue("testnet", false);
                  return e;
                }}
                options={exchangesOptions}
                rules={{ required: true }}
              />
            ))}
          {typeOptions.length > 1 && (
            <Controller
              as={CustomSelect}
              control={control}
              defaultValue={typeOptions[0].val}
              label={intl.formatMessage({
                id: "accounts.exchange.type",
              })}
              name="exchangeType"
              options={typeOptions}
            />
          )}
          {showTestnet && (
            <CustomSwitch
              defaultValue={false}
              inputRef={register}
              label="menu.testnet"
              name="testnet"
            />
          )}
          <CustomInput
            inputRef={register({
              required: "name empty",
            })}
            label="accounts.exchange.name"
            name="internalName"
          />
          {(!create || testnet) &&
            selectedExchange.requiredAuthFields.map((field) => (
              <CustomInput
                autoComplete="new-password"
                inputRef={register({
                  required: "required",
                })}
                key={field}
                label={`accounts.exchange.${field}`}
                name={field}
                type="password"
              />
            ))}
        </ExchangeAccountForm>
      )}
    </form>
  );
};

export default ExchangeAccountAdd;
