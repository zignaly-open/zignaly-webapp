import React, { useContext, useEffect, useImperativeHandle, useState } from "react";
import { Box, CircularProgress, Typography, Hidden } from "@material-ui/core";
import "./ExchangeAccountConnect.scss";
import { Controller, useForm, useFormContext } from "react-hook-form";
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
import { ChevronDown, ChevronUp } from "react-feather";
import { LiveTv } from "@material-ui/icons";

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
  const {
    register,
    control,
    setValue,
    watch,
    setError,
    handleSubmit,
    errors,
    formState: { isValid },
  } = useFormContext();
  const intl = useIntl();
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const {
    setTitle,
    formRef,
    setTempMessage,
    pathParams: { previousPath },
    resetToPath,
  } = useContext(ModalPathContext);

  useEffect(() => {
    setTitle(<FormattedMessage id="accounts.connect" />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let exchanges = useExchangeList();
  const [exchangeName, setExchangeName] = useState("");
  const [step, setStep] = useState(1);
  const [tipsExpanded, setTipsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const internalName = watch("internalName");

  const exchangeType = watch("exchangeType");

  if (exchanges) {
    // Filter disabled exchanges and Zignaly
    exchanges = exchanges.filter((e) => e.enabled && e.name.toLowerCase() !== "zignaly");
  }
  console.log(exchanges);

  const selectedExchange = exchanges
    ? exchanges.find((e) => e.name.toLowerCase() === exchangeName.toLowerCase())
    : null;

  // Create account types options
  const typeOptions =
    selectedExchange &&
    selectedExchange.type.map((t) => ({
      val: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
    }));

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
   * @returns {void}
   */
  const submitForm = (data) => {
    const { internalName, key, secret, password, testNet, exchangeType: _exchangeType } = data;
    const payload = {
      token: storeSession.tradeApi.accessToken,
      exchangeId: selectedExchange.id,
      internalName,
      exchangeType: _exchangeType,
      key,
      secret,
      ...(password && { password }),
      mainAccount: false,
      isPaperTrading: false,
      testNet: false,
    };

    setLoading(true);

    tradeApi
      .exchangeAdd(payload)
      .then(() => {
        setTempMessage(
          <FormattedMessage id={create ? "accounts.created" : "accounts.connected.success"} />,
        );
        resetToPath(previousPath);
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
        setLoading(false);
      });
  };

  if (!exchanges) {
    return (
      <Box className="loadProgress" display="flex" flexDirection="row" justifyContent="center">
        <CircularProgress disableShrink />
      </Box>
    );
  }

  return (
    <form className="exchangeAccountConnect" onSubmit={handleSubmit(submitForm)}>
      <Box className="step1">
        <Typography variant="h3" className="body1 bold">
          <FormattedMessage id="accounts.exchange.choose" />
        </Typography>
        {exchanges.map((e) => (
          <ExchangeIcon
            exchange={e.name}
            onClick={() => setExchangeName(e.name)}
            className={exchangeName === e.name ? "selected" : ""}
            key={e.id}
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
        {step >= 2 && selectedExchange && (
          <>
            <Typography variant="body1" className="bold title">
              <FormattedMessage id="accounts.exchange.api" />
            </Typography>
            {selectedExchange.requiredAuthFields.map((field) => (
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

            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-end"
              className="actionStep2"
            >
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                className="summary"
                onClick={() => setTipsExpanded(!tipsExpanded)}
              >
                <Typography>
                  <FormattedMessage id="accounts.exchange.api.tip" />
                </Typography>

                {tipsExpanded ? <ChevronUp /> : <ChevronDown />}
              </Box>

              {step === 2 && (
                <Hidden xsDown>
                  <CustomButton
                    className="bgPurple bold"
                    onClick={() => setStep(3)}
                    disabled={!isValid}
                  >
                    <FormattedMessage id="accounts.next" />
                  </CustomButton>
                </Hidden>
              )}
            </Box>
            {tipsExpanded && (
              <Typography className="tips">
                <FormattedMessage id="accounts.exchange.api.tipdesc" />
              </Typography>
            )}
            {step === 2 && (
              <Hidden smUp>
                <CustomButton
                  className="bgPurple bold"
                  type="submit"
                  disabled={!isValid}
                  loading={loading}
                >
                  <FormattedMessage id="accounts.connect.button" />
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
            <CustomButton className="bgPurple bold" type="submit" loading={loading}>
              <FormattedMessage id="accounts.connect.button" />
            </CustomButton>
          </>
        )}
      </Box>
      {/* {typeOptions.length > 1 && (
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
      )} */}
    </form>
  );
};

export default ExchangeAccountConnect;
