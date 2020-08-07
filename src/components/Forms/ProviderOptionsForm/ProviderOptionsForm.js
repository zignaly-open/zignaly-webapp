import React, { useState } from "react";
import "./ProviderOptionsForm.scss";
import { Box, Checkbox, TextField, InputAdornment } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import tradeApi from "../../../services/tradeApiClient";
import { setProvider } from "../../../store/actions/views";
import { showErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */

const ProviderOptionsForm = ({ provider }) => {
  const [loading, setLoading] = useState(false);
  const { watch, handleSubmit, control, errors } = useForm();
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const entryDCA = watch("reBuysFromSignal", provider.reBuysFromSignal);
  const takeProfit = watch("takeProfitsFromSignal", provider.takeProfitsFromSignal);
  const DCA = watch("reBuyFromProvider", provider.reBuyFromProvider);
  const terms = watch("terms", !!provider.terms);
  const riskFilter = watch("riskFilter", provider.riskFilter);
  const successRateFilter = watch("successRateFilter", provider.successRateFilter);

  /**
   *
   * @typedef {Object} SubmitObject
   * @property {Boolean} acceptUpdateSignal
   * @property {Boolean} allowSendingBuyOrdersAsMarket
   * @property {Boolean} enablePanicSellSignals
   * @property {Boolean} enableSellSignals
   * @property {Boolean} limitPriceFromSignal
   * @property {Boolean} reBuyFromProvider
   * @property {Boolean} reBuysFromSignal
   * @property {Boolean} reUseSignalIdIfClosed
   * @property {Boolean} riskFilter
   * @property {Boolean} stopLossFromSignal
   * @property {Boolean} successRateFilter
   * @property {Boolean} takeProfitsFromSignal
   * @property {Boolean} terms
   * @property {Boolean} trailingStopFromSignal
   * @property {Boolean} useLeverageFromSignal
   * @property {String} customerKey
   * @property {Boolean} reBuyFirst
   * @property {Boolean} reBuyAll
   * @property {Boolean} reBuyLast
   * @property {Boolean} takeProfitFirst
   * @property {Boolean} takeProfitAll
   * @property {Boolean} takeProfitLast
   * @property {Number} quantityPercentage
   * @property {Number} limitReBuys
   * @property {Boolean} short
   * @property {Boolean} shortmid
   * @property {Boolean} mid
   * @property {Boolean} long
   * @property {Number} risk
   * @property {Number} successRate
   * @property {Boolean} disclaimer
   */
  /**
   *
   * @param {SubmitObject} data Form data.
   * @returns {void} None.
   */
  const onSubmit = (data) => {
    try {
      if (validateDisclaimer(data)) {
        setLoading(true);
        const payload = {
          ...data,
          connected: true,
          providerId: provider.id,
          token: storeSession.tradeApi.accessToken,
          exchangeInternalId: "",
        };
        tradeApi
          .providerConnect(payload)
          .then((response) => {
            if (response) {
              const payload2 = {
                token: storeSession.tradeApi.accessToken,
                providerId: provider.id,
                version: 2,
              };
              dispatch(setProvider(payload2));
            }
          })
          .catch((e) => {
            dispatch(showErrorAlert(e));
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        dispatch(showErrorAlert("signalp.option.disclaimer.error"));
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };

  /**
   *
   * @param {SubmitObject} data Form submission object.
   * @returns {Boolean} whether the disclaimer is valid or not.
   */
  const validateDisclaimer = (data) => {
    if (provider.disclaimer) {
      if (data.disclaimer) {
        return true;
      }
      return false;
    }
    return true;
  };

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleSubmitClick = () => {
    handleSubmit(onSubmit);
  };

  return (
    <Box className="optionsFormWrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          alignItems="flex-start"
          className="providerOptionsForm"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          {provider.options.customerKey && (
            <Box className="keyInputBox" display="flex" flexDirection="column">
              <label className="customLabel">
                <FormattedMessage id="signalp.option.apikey" />
              </label>
              <Controller
                as={
                  <TextField
                    className={
                      "customInput " +
                      (storeSettings.darkStyle ? " dark " : " light ") +
                      (errors.customerKey ? "error" : "")
                    }
                    error={!!errors.customerKey}
                    fullWidth
                    variant="outlined"
                  />
                }
                control={control}
                defaultValue={provider.customerKey}
                name="customerKey"
                rules={{ required: true }}
              />
            </Box>
          )}

          {provider.options.stopLossFromSignal && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.stopLossFromSignal}
                name="stopLossFromSignal"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.stoploss" />
              </label>
            </Box>
          )}

          {provider.options.acceptUpdateSignal && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.acceptUpdateSignal}
                name="acceptUpdateSignal"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.updates" />
              </label>
            </Box>
          )}

          {provider.options.trailingStopFromSignal && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.trailingStopFromSignal}
                name="trailingStopFromSignal"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.trailing" />
              </label>
            </Box>
          )}

          {provider.options.enableSellSignals && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.enableSellSignals}
                name="enableSellSignals"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.exit" />
              </label>
            </Box>
          )}

          {provider.options.useLeverageFromSignal && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.useLeverageFromSignal}
                name="useLeverageFromSignal"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.leverage" />
              </label>
            </Box>
          )}

          {provider.options.enablePanicSellSignals && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.enablePanicSellSignals}
                name="enablePanicSellSignals"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.panicexit" />
              </label>
            </Box>
          )}

          {provider.options.allowSendingBuyOrdersAsMarket && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.allowSendingBuyOrdersAsMarket}
                name="allowSendingBuyOrdersAsMarket"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.buymarketorder" />
              </label>
            </Box>
          )}

          {provider.options.reUseSignalIdIfClosed && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.reUseSignalIdIfClosed}
                name="reUseSignalIdIfClosed"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.reusingsignalID" />
              </label>
            </Box>
          )}

          {provider.options.limitPriceFromSignal && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.limitPriceFromSignal}
                name="limitPriceFromSignal"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.limitprice" />
              </label>
            </Box>
          )}

          {provider.options.reBuysFromSignal && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.reBuysFromSignal}
                name="reBuysFromSignal"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.entryDCA" />
              </label>
            </Box>
          )}

          {entryDCA && (
            <Box className="subInputBox">
              <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
                <Controller
                  control={control}
                  defaultValue={provider.reBuyFirst}
                  name="reBuyFirst"
                  render={({ onChange, value }) => (
                    <Checkbox
                      checked={value}
                      className="checkboxInput"
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.entryDCA.first" />
                </label>
              </Box>
              <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
                <Controller
                  control={control}
                  defaultValue={provider.reBuyAll}
                  name="reBuyAll"
                  render={({ onChange, value }) => (
                    <Checkbox
                      checked={value}
                      className="checkboxInput"
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.entryDCA.all" />
                </label>
              </Box>
              <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
                <Controller
                  control={control}
                  defaultValue={provider.reBuyLast}
                  name="reBuyLast"
                  render={({ onChange, value }) => (
                    <Checkbox
                      checked={value}
                      className="checkboxInput"
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.entryDCA.last" />
                </label>
              </Box>
            </Box>
          )}

          {provider.options.takeProfitsFromSignal && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.takeProfitsFromSignal}
                name="takeProfitsFromSignal"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.takeprofit" />
              </label>
            </Box>
          )}

          {takeProfit && (
            <Box className="subInputBox">
              <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
                <Controller
                  control={control}
                  defaultValue={provider.takeProfitFirst}
                  name="takeProfitFirst"
                  render={({ onChange, value }) => (
                    <Checkbox
                      checked={value}
                      className="checkboxInput"
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.takeprofit.first" />
                </label>
              </Box>
              <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
                <Controller
                  control={control}
                  defaultValue={provider.takeProfitAll}
                  name="takeProfitAll"
                  render={({ onChange, value }) => (
                    <Checkbox
                      checked={value}
                      className="checkboxInput"
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.takeprofit.all" />
                </label>
              </Box>
              <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
                <Controller
                  control={control}
                  defaultValue={provider.takeProfitLast}
                  name="takeProfitLast"
                  render={({ onChange, value }) => (
                    <Checkbox
                      checked={value}
                      className="checkboxInput"
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.takeprofit.last" />
                </label>
              </Box>
            </Box>
          )}

          {provider.options.reBuyFromProvider && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.reBuyFromProvider}
                name="reBuyFromProvider"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.DCA" />
              </label>
            </Box>
          )}

          {DCA && (
            <Box className="subInputBox">
              <Box className="fieldInputBox" display="flex" flexDirection="column">
                <label className="customLabel">
                  <FormattedMessage id="signalp.option.DCA.percentage" />
                </label>
                <Controller
                  as={
                    <TextField
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
                      error={!!errors.quantityPercentage}
                      fullWidth
                      type="number"
                      variant="outlined"
                    />
                  }
                  control={control}
                  defaultValue={provider.quantityPercentage}
                  name="quantityPercentage"
                  rules={{ required: true, min: 1 }}
                />
                {errors.quantityPercentage && (
                  <span className="errorText">
                    <FormattedMessage id="signalp.option.DCA.error" />
                  </span>
                )}
              </Box>
              <Box className="fieldInputBox" display="flex" flexDirection="column">
                <label className="customLabel">
                  <FormattedMessage id="signalp.option.DCA.triggers" />
                </label>
                <Controller
                  as={
                    <TextField
                      InputProps={{
                        endAdornment: <InputAdornment position="end">#</InputAdornment>,
                      }}
                      className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
                      error={!!errors.limitReBuys}
                      fullWidth
                      type="number"
                      variant="outlined"
                    />
                  }
                  control={control}
                  defaultValue={provider.limitReBuys ? provider.limitReBuys : 0}
                  name="limitReBuys"
                  rules={{ required: true, min: 1 }}
                />
                {errors.limitReBuys && (
                  <span className="errorText">
                    <FormattedMessage id="signalp.option.DCA.error" />
                  </span>
                )}
              </Box>
            </Box>
          )}

          {provider.options.terms && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={!!provider.terms}
                name="terms"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.checkterms" />
              </label>
            </Box>
          )}

          {terms && (
            <Box className="subInputBox">
              <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
                <Controller
                  control={control}
                  defaultValue={provider.short}
                  name="short"
                  render={({ onChange, value }) => (
                    <Checkbox
                      checked={value}
                      className="checkboxInput"
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.checkterms.short" />
                </label>
              </Box>
              <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
                <Controller
                  control={control}
                  defaultValue={provider.shortmid}
                  name="shortmid"
                  render={({ onChange, value }) => (
                    <Checkbox
                      checked={value}
                      className="checkboxInput"
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.checkterms.shortmid" />
                </label>
              </Box>
              <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
                <Controller
                  control={control}
                  defaultValue={provider.mid}
                  name="mid"
                  render={({ onChange, value }) => (
                    <Checkbox
                      checked={value}
                      className="checkboxInput"
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.checkterms.mid" />
                </label>
              </Box>
              <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
                <Controller
                  control={control}
                  defaultValue={provider.long}
                  name="long"
                  render={({ onChange, value }) => (
                    <Checkbox
                      checked={value}
                      className="checkboxInput"
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.checkterms.long" />
                </label>
              </Box>
            </Box>
          )}

          {provider.options.riskFilter && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.riskFilter}
                name="riskFilter"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.filterrisk" />
              </label>
            </Box>
          )}

          {riskFilter && (
            <Box className="subInputBox">
              <Box className="fieldInputBox" display="flex" flexDirection="column">
                <label className="customLabel">
                  <FormattedMessage id="signalp.option.filterrisk.sub" />
                </label>
                <Controller
                  as={
                    <TextField
                      InputProps={{
                        endAdornment: <InputAdornment position="end">#</InputAdornment>,
                      }}
                      className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
                      error={!!errors.risk}
                      fullWidth
                      type="number"
                      variant="outlined"
                    />
                  }
                  control={control}
                  defaultValue={provider.risk}
                  name="risk"
                  rules={{ required: true, min: 1, max: 5 }}
                />
              </Box>
            </Box>
          )}

          {provider.options.successRateFilter && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.successRateFilter}
                name="successRateFilter"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.minimumsuccess" />
              </label>
            </Box>
          )}

          {successRateFilter && (
            <Box className="subInputBox">
              <Box className="fieldInputBox" display="flex" flexDirection="column">
                <label className="customLabel">
                  <FormattedMessage id="signalp.option.minimumsuccess.sub" />
                </label>
                <Controller
                  as={
                    <TextField
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
                      error={!!errors.successRate}
                      fullWidth
                      type="number"
                      variant="outlined"
                    />
                  }
                  control={control}
                  defaultValue={provider.successRate}
                  name="successRate"
                  rules={{ required: true, min: 1 }}
                />
                {errors.successRate && (
                  <span className="errorText">
                    <FormattedMessage id="signalp.option.minimumsuccess.error" />
                  </span>
                )}
              </Box>
            </Box>
          )}

          {provider.options.disclaimer && (
            <Box alignItems="center" className="inputBox" display="flex" flexDirection="row">
              <Controller
                control={control}
                defaultValue={provider.disclaimer}
                name="disclaimer"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    className="checkboxInput"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label className={"customLabel"}>
                <FormattedMessage
                  id="signalp.option.disclaimer"
                  values={{
                    disclaimer: (
                      <a
                        href={provider.options.disclaimer}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Disclaimer
                      </a>
                    ),
                  }}
                />
              </label>
            </Box>
          )}
        </Box>
        <Box className="formAction" display="flex" flexDirection="row" justifyContent="flex-start">
          <CustomButton
            className="submitButton"
            loading={loading}
            onClick={handleSubmitClick}
            type="submit"
          >
            <FormattedMessage id="action.update" />
          </CustomButton>
        </Box>
      </form>
    </Box>
  );
};

export default ProviderOptionsForm;
