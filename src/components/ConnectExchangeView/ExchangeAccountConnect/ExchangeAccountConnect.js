import React, { useContext, useEffect, useImperativeHandle, useState } from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import "./ExchangeAccountConnect.scss";
import { Controller, useFormContext } from "react-hook-form";
import CustomSelect from "../../CustomSelect";
import { FormattedMessage, useIntl } from "react-intl";
import useExchangeList from "../../../hooks/useExchangeList";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import ModalPathContext from "../ModalPathContext";
import { useDispatch } from "react-redux";
import ExchangeAccountForm, { CustomInput, CustomSwitch } from "../ExchangeAccountForm";
import { showErrorAlert } from "../../../store/actions/ui";
import ExchangeIcon from "../../ExchangeIcon";
import CustomButton from "../../CustomButton";

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
const ExchangeAccountConnect = ({ create, demo }) => {
  const { register, control, setValue, watch, setError } = useFormContext();
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
  //   const zignalyOnly = create && !demo;

  // Initialize selected exchange
  //   let exchangeName = zignalyOnly ? "zignaly" : watch("exchangeName", "binance");
  const [exchangeName, setExchangeName] = useState("");
  const [step, setStep] = useState(1);

  const internalName = watch("internalName");

  const exchangeType = watch("exchangeType");
  const testnet = watch("testnet");
  // Show testnet only for binance demo futures
  const showTestnet =
    demo && exchangeType === "futures" && exchangeName.toLowerCase() === "binance";

  const selectedExchange = exchanges
    ? exchanges.find((e) => e.name.toLowerCase() === exchangeName.toLowerCase())
    : null;

  // Exchange options
  // Filter disabled exchange and Zignaly if connection
  const exchangesOptions = exchanges
    ? exchanges
        .filter((e) => e.enabled && (e.name.toLowerCase() !== "zignaly" || create))
        .map((e) => ({
          val: e.name.toLowerCase(),
          label:
            e.name.toLowerCase() === "zignaly"
              ? `${e.name} (${intl.formatMessage({
                  id: "accounts.powered",
                })})`
              : e.name,
        }))
    : null;

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
   * @property {String} exchangeType
   * @property {Boolean} testNet
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {Promise<boolean>} API promise.
   */
  const submitForm = async (data) => {
    const { internalName, key, secret, password, testNet, exchangeType: _exchangeType } = data;
    const payload = {
      token: storeSession.tradeApi.accessToken,
      exchangeId: selectedExchange.id,
      internalName,
      exchangeType: _exchangeType,
      ...(!create && {
        key,
        secret,
        ...(password && { password }),
      }),
      mainAccount: false,
      isPaperTrading: demo,
      testNet,
    };

    return tradeApi
      .exchangeAdd(payload)
      .then(() => {
        setTempMessage(
          <FormattedMessage id={create ? "accounts.created" : "accounts.connected.success"} />,
        );
        return true;
      })
      .catch((e) => {
        if (e.code === 72) {
          setError(
            selectedExchange.requiredAuthFields[selectedExchange.requiredAuthFields.length - 1],
            "notMatch",
            intl.formatMessage({ id: "form.error.key.invalid" }),
          );
        } else {
          dispatch(showErrorAlert(e));
        }

        return false;
      });
  };

  return (
    <form className="exchangeAccountConnect">
      <Box className="step1">
        <Typography variant="h3" className="body1 bold">
          <FormattedMessage id="accounts.exchange.choose" />
        </Typography>
        {["binance", "kucoin"].map((e) => (
          <ExchangeIcon
            exchange={e}
            onClick={() => setExchangeName(e)}
            className={exchangeName === e ? "selected" : ""}
            key={e}
          />
        ))}
        <div className="name">
          <CustomInput
            inputRef={register({
              required: intl.formatMessage({ id: "form.error.name" }),
            })}
            label="accounts.exchange.customname"
            name="internalName"
          />
        </div>
        {step === 1 && (
          <CustomButton
            className="bgPurple bold"
            onClick={() => setStep(2)}
            disabled={!internalName || !exchangeName}
          >
            <FormattedMessage id="accounts.next" />
          </CustomButton>
        )}
      </Box>
      <Box className="step2">
        {step >= 2 &&
          selectedExchange &&
          (!exchanges ? (
            <Box
              className="loadProgress"
              display="flex"
              flexDirection="row"
              justifyContent="center"
            >
              <CircularProgress disableShrink />
            </Box>
          ) : (
            selectedExchange.requiredAuthFields.map((field) => (
              <CustomInput
                autoComplete="new-password"
                inputRef={register({
                  required: intl.formatMessage({ id: `form.error.${field}` }),
                })}
                key={field}
                label={`accounts.exchange.${field}`}
                name={field}
                type="password"
              />
            ))
          ))}
      </Box>
      {/* <Controller
        as={CustomSelect}
        control={control}
        defaultValue={selectedExchange.name.toLowerCase()}
        label={intl.formatMessage({
          id: "accounts.exchange.choose",
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

      {(!create || testnet) &&
         */}
    </form>
  );
};

export default ExchangeAccountConnect;
