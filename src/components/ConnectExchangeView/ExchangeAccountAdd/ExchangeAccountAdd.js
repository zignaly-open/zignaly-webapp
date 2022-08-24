import React, { useContext, useEffect, useImperativeHandle } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import "./ExchangeAccountAdd.scss";
import { Controller, useFormContext } from "react-hook-form";
import CustomSelect from "../../CustomSelect";
import { FormattedMessage, useIntl } from "react-intl";
import useExchangeList from "../../../hooks/useExchangeList";
import tradeApi from "../../../services/tradeApiClient";
import ModalPathContext from "../ModalPathContext";
import { useDispatch } from "react-redux";
import ExchangeAccountForm, { CustomInput, CustomSwitch } from "../ExchangeAccountForm";
import { showErrorAlert } from "../../../store/actions/ui";
import { getUserData } from "../../../store/actions/user";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeListEntity} ExchangeListEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {boolean} demo Flag to indicate if it's a demo account.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountAdd = ({ demo }) => {
  const { handleSubmit, register, control, setValue, watch, setError } = useFormContext();
  const intl = useIntl();
  const dispatch = useDispatch();
  const {
    pathParams: { previousPath },
    setPathParams,
    navigateToPath,
    setTitle,
    formRef,
    setTempMessage,
  } = useContext(ModalPathContext);

  useEffect(() => {
    setTitle(<FormattedMessage id={demo ? "accounts.create.demo" : "accounts.create.exchange"} />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { exchanges } = useExchangeList();

  // Initialize selected exchange
  let exchangeName = !demo ? "zignaly" : watch("exchangeName", "binance");

  const exchangeType = watch("exchangeType");
  const testNet = watch("testNet");
  // Show testnet only for binance demo futures
  const showTestnet =
    process.env.GATSBY_ENABLE_TESTNET === "true" &&
    demo &&
    exchangeType === "futures" &&
    ["binance", "bitmex"].includes(exchangeName.toLowerCase());

  const selectedExchange = exchanges
    ? exchanges.find((e) => e.name.toLowerCase() === exchangeName.toLowerCase())
    : null;

  // Exchange options
  const exchangesOptions = exchanges
    ? exchanges
        // Filter disabled exchange
        .filter((e) => e.enabled)
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

  useEffect(() => {
    if (typeOptions) {
      setValue("exchangeType", typeOptions[0].val);
      setValue("testNet", false);
    }
  }, [exchangeName]);

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
    const {
      internalName,
      key,
      secret,
      password,
      testNet: _testNet,
      exchangeType: _exchangeType,
    } = data;

    const payload = {
      exchangeId: selectedExchange.id,
      internalName,
      exchangeType: _exchangeType,
      ...(_testNet && {
        key,
        secret,
        ...(password && { password }),
      }),
      mainAccount: false,
      isPaperTrading: demo ? (_testNet ? !_testNet : true) : false,
      testNet: _testNet,
    };

    return tradeApi
      .exchangeAdd(payload)
      .then(() => {
        setTempMessage(<FormattedMessage id={"accounts.connected.success"} />);
        dispatch(getUserData(true));
        // mixpanelExchangeConnected(payload.isPaperTrading ? "demo" : "real");
        // userPilotExchangeConnected(payload.isPaperTrading ? "demo" : "real");
        return true;
      })
      .catch((e) => {
        if (e.code === 72) {
          setError(
            selectedExchange.requiredAuthFields[selectedExchange.requiredAuthFields.length - 1],
            {
              type: "manual",
              message: intl.formatMessage({ id: "form.error.key.invalid" }),
            },
          );
        } else {
          dispatch(showErrorAlert(e));
        }

        return false;
      });
  };

  /**
   * Handle submit button click.
   *
   * @param {*} data Form data.
   * @returns {Promise<void>} Form action async promise.
   */
  const onSubmit = async (data) => {
    setPathParams((state) => ({ ...state, isLoading: true }));
    const res = await submitForm(data);
    let params = {
      isLoading: false,
      ...(res && {
        previousPath: null,
      }),
    };
    setPathParams((state) => ({ ...state, ...params }));
    navigateToPath(previousPath);
  };

  return (
    // @ts-ignore
    <form className="exchangeAccountAdd" method="post" onSubmit={handleSubmit(onSubmit)}>
      {!selectedExchange ? (
        <Box className="loadProgress" display="flex" flexDirection="row" justifyContent="center">
          <CircularProgress disableShrink />
        </Box>
      ) : (
        <ExchangeAccountForm>
          {demo && (
            <Controller
              control={control}
              defaultValue={selectedExchange.name.toLowerCase()}
              name="exchangeName"
              render={({ onChange, value }) => (
                <CustomSelect
                  label={intl.formatMessage({
                    id: "accounts.exchange",
                  })}
                  onChange={(/** @type {string} **/ v) => {
                    onChange(v);
                  }}
                  options={exchangesOptions}
                  value={value}
                />
              )}
              rules={{ required: true }}
            />
          )}
          <Controller
            control={control}
            defaultValue={typeOptions[0].val}
            name="exchangeType"
            render={({ onChange, value }) => (
              <CustomSelect
                label={intl.formatMessage({
                  id: "accounts.exchange.type",
                })}
                onChange={onChange}
                options={typeOptions}
                value={value}
              />
            )}
          />
          {showTestnet && (
            <CustomSwitch
              defaultValue={false}
              inputRef={register}
              label="menu.testnet"
              name="testNet"
            />
          )}
          <CustomInput
            inputRef={register({
              required: intl.formatMessage({ id: "form.error.name" }),
            })}
            label="accounts.exchange.name"
            name="internalName"
          />
          {testNet &&
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
            ))}
        </ExchangeAccountForm>
      )}
    </form>
  );
};

export default ExchangeAccountAdd;
