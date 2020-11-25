import React, { useContext, useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Hidden } from "@material-ui/core";
import "./ExchangeAccountConnect.scss";
import { useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import useExchangeList from "../../../hooks/useExchangeList";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import ModalPathContext from "../ModalPathContext";
import { useDispatch } from "react-redux";
import { CustomInput } from "../ExchangeAccountForm";
import { showErrorAlert } from "../../../store/actions/ui";
import ExchangeIcon from "../../ExchangeIcon";
import CustomButton from "../../CustomButton";
import { ChevronDown, ChevronUp } from "react-feather";
import ToggleButtonsExchangeType from "../ToggleButtonsExchangeType";
import { getUserData, getUserExchanges } from "../../../store/actions/user";
import { binanceUrl, bitmexAPIKeysUrl, kucoinUrl, vcceUrl } from "../../../utils/affiliateURLs";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeListEntity} ExchangeListEntity
 */

/**
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountConnect = () => {
  const {
    register,
    watch,
    setError,
    handleSubmit,
    formState: { isValid },
  } = useFormContext();
  const intl = useIntl();
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const {
    setTitle,
    setTempMessage,
    pathParams: { previousPath },
    resetToPath,
  } = useContext(ModalPathContext);

  useEffect(() => {
    setTitle(<FormattedMessage id="accounts.connect" />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let { exchanges, exchangesLoading } = useExchangeList();
  const [exchangeName, setExchangeName] = useState("");
  const [step, setStep] = useState(1);
  const [tipsExpanded, setTipsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exchangeType, setExchangeType] = useState(null);
  const internalName = watch("internalName");

  if (exchanges) {
    // Filter disabled exchanges and Zignaly
    exchanges = exchanges.filter((e) => e.enabled && e.name.toLowerCase() !== "zignaly");
  }

  const selectedExchange = exchanges
    ? exchanges.find((e) => e.name.toLowerCase() === exchangeName.toLowerCase())
    : null;

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
    const { key, secret, password } = data;
    const payload = {
      token: storeSession.tradeApi.accessToken,
      exchangeId: selectedExchange.id,
      internalName,
      exchangeType,
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
        setTempMessage(<FormattedMessage id={"accounts.connected.success"} />);
        const exchangePayload = {
          token: storeSession.tradeApi.accessToken,
        };
        dispatch(getUserExchanges(exchangePayload));
        dispatch(getUserData(exchangePayload));
        resetToPath(previousPath);
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

  /**
   * Function to return the url for selected exchange.
   *
   * @param {string} name Name of selected exchange.
   * @returns {JSX.Element} Url of the selected exchange.
   */
  const exchangeUrl = (name) => {
    let url = "";
    switch (name) {
      case "binance":
        url = binanceUrl;
        break;
      case "kucoin":
        url = kucoinUrl;
        break;
      case "bitmex":
        url = bitmexAPIKeysUrl;
        break;
      case "vcce":
        url = vcceUrl;
        break;
      default:
        url = binanceUrl;
        break;
    }
    return (
      <a className="exchangeLink" href={url} rel="noopener noreferrer" target="_blank">
        {url}
      </a>
    );
  };

  return (
    <form className="exchangeAccountConnect" method="post" onSubmit={handleSubmit(submitForm)}>
      <Box className="step1">
        {exchangesLoading && (
          <Box
            alignItems="center"
            className="loadingBox"
            display="flex"
            flexDirection="row"
            justifyContent="center"
          >
            <CircularProgress color="primary" size={45} />
          </Box>
        )}
        {!exchangesLoading && (
          <>
            <Typography className="body1 bold" variant="h3">
              <FormattedMessage id="accounts.exchange.choose" />
            </Typography>
            <Box alignItems="center" className="exchangeIconBox" display="flex" flexDirection="row">
              {exchanges.map((e) => (
                <Box className={`iconBox ${exchangeName === e.name ? "selected" : ""}`} key={e.id}>
                  <ExchangeIcon exchange={e.name} onClick={() => setExchangeName(e.name)} />
                </Box>
              ))}
            </Box>
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
                disabled={!internalName || !exchangeName}
                onClick={() => setStep(2)}
              >
                <FormattedMessage id="accounts.next" />
              </CustomButton>
            )}
          </>
        )}
      </Box>
      <Box className="step2">
        {step >= 2 && selectedExchange && (
          <>
            <ToggleButtonsExchangeType
              exchangeType={exchangeType}
              exchangeTypes={selectedExchange.type}
              setExchangeType={setExchangeType}
            />
            {/* <Typography variant="body1" className="bold title">
              <FormattedMessage id="accounts.exchange.api" />
            </Typography> */}
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
              alignItems="flex-end"
              className="actionStep2"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Box
                alignItems="center"
                className="summary"
                display="flex"
                flexDirection="row"
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
                    disabled={!isValid}
                    onClick={() => setStep(3)}
                  >
                    <FormattedMessage id="accounts.next" />
                  </CustomButton>
                </Hidden>
              )}
            </Box>
            {tipsExpanded && (
              <Typography className="tips">
                <FormattedMessage
                  id={`accounts.exchange.api.tip.${exchangeName.toLowerCase()}`}
                  values={{ url: exchangeUrl(exchangeName.toLowerCase()) }}
                />
              </Typography>
            )}
            {step === 2 && (
              <Hidden smUp>
                <CustomButton
                  className="bgPurple bold"
                  disabled={!isValid}
                  loading={loading}
                  type="submit"
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
            <CustomButton className="bgPurple bold" loading={loading} type="submit">
              <FormattedMessage id="accounts.connect.button" />
            </CustomButton>
          </>
        )}
      </Box>
    </form>
  );
};

export default ExchangeAccountConnect;
