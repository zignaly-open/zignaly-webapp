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
  const terms = watch("terms", provider.terms ? true : false);
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
   */
  /**
   *
   * @param {SubmitObject} data Form data.
   * @returns {void} None.
   */
  const onSubmit = (data) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        connected: true,
        providerId: provider.id,
        token: storeSession.tradeApi.accessToken,
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
            setLoading(false);
          }
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
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
            <Box className="fieldInputBox" display="flex" flexDirection="column">
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
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.stopLossFromSignal}
                name="stopLossFromSignal"
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.stoploss" />
              </label>
            </Box>
          )}

          {provider.options.acceptUpdateSignal && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.acceptUpdateSignal}
                name="acceptUpdateSignal"
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.updates" />
              </label>
            </Box>
          )}

          {provider.options.trailingStopFromSignal && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.trailingStopFromSignal}
                name="trailingStopFromSignal"
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.trailing" />
              </label>
            </Box>
          )}

          {provider.options.enableSellSignals && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.enableSellSignals}
                name="enableSellSignals"
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.exit" />
              </label>
            </Box>
          )}

          {provider.options.useLeverageFromSignal && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.useLeverageFromSignal}
                name="useLeverageFromSignal"
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.leverage" />
              </label>
            </Box>
          )}

          {provider.options.enablePanicSellSignals && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.enablePanicSellSignals}
                name="enablePanicSellSignals"
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.panicexit" />
              </label>
            </Box>
          )}

          {provider.options.allowSendingBuyOrdersAsMarket && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.allowSendingBuyOrdersAsMarket}
                name="allowSendingBuyOrdersAsMarket"
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.buymarketorder" />
              </label>
            </Box>
          )}

          {provider.options.reUseSignalIdIfClosed && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.reUseSignalIdIfClosed}
                name="reUseSignalIdIfClosed"
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.reusingsignalID" />
              </label>
            </Box>
          )}

          {provider.options.limitPriceFromSignal && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.limitPriceFromSignal}
                name="limitPriceFromSignal"
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.limitprice" />
              </label>
            </Box>
          )}

          {provider.options.reBuysFromSignal && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.reBuysFromSignal}
                name="reBuysFromSignal"
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.entryDCA" />
              </label>
            </Box>
          )}

          {entryDCA && (
            <Box className="subInputBox">
              <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
                <Controller
                  as={<Checkbox className="checkboxInput" />}
                  control={control}
                  defaultValue={provider.reBuyFirst}
                  name="reBuyFirst"
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.entryDCA.first" />
                </label>
              </Box>
              <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
                <Controller
                  as={<Checkbox className="checkboxInput" />}
                  control={control}
                  defaultValue={provider.reBuyAll}
                  name="reBuyAll"
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.entryDCA.all" />
                </label>
              </Box>
              <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
                <Controller
                  as={<Checkbox className="checkboxInput" />}
                  control={control}
                  defaultValue={provider.reBuyLast}
                  name="reBuyLast"
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.entryDCA.last" />
                </label>
              </Box>
            </Box>
          )}

          {provider.options.takeProfitsFromSignal && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.takeProfitsFromSignal}
                name="takeProfitsFromSignal"
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.takeprofit" />
              </label>
            </Box>
          )}

          {takeProfit && (
            <Box className="subInputBox">
              <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
                <Controller
                  as={<Checkbox className="checkboxInput" />}
                  control={control}
                  defaultValue={provider.takeProfitFirst}
                  name="takeProfitFirst"
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.takeprofit.first" />
                </label>
              </Box>
              <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
                <Controller
                  as={<Checkbox className="checkboxInput" />}
                  control={control}
                  defaultValue={provider.takeProfitAll}
                  name="takeProfitAll"
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.takeprofit.all" />
                </label>
              </Box>
              <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
                <Controller
                  as={<Checkbox className="checkboxInput" />}
                  control={control}
                  defaultValue={provider.takeProfitLast}
                  name="takeProfitLast"
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.takeprofit.all" />
                </label>
              </Box>
            </Box>
          )}

          {provider.options.reBuyFromProvider && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.reBuyFromProvider}
                name="reBuyFromProvider"
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
                      className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
                      error={!!errors.quantityPercentage}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      type="number"
                    />
                  }
                  control={control}
                  defaultValue={provider.quantityPercentage}
                  name="quantityPercentage"
                  rules={{ required: true }}
                />
              </Box>
              <Box className="fieldInputBox" display="flex" flexDirection="column">
                <label className="customLabel">
                  <FormattedMessage id="signalp.option.DCA.triggers" />
                </label>
                <Controller
                  as={
                    <TextField
                      className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
                      error={!!errors.limitReBuys}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">#</InputAdornment>,
                      }}
                      type="number"
                    />
                  }
                  control={control}
                  defaultValue={provider.limitReBuys}
                  name="limitReBuys"
                  rules={{ required: true }}
                />
              </Box>
            </Box>
          )}

          {provider.options.terms && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.terms ? true : false}
                name="terms"
              />
              <label className={"customLabel"}>
                <FormattedMessage id="signalp.option.checkterms" />
              </label>
            </Box>
          )}

          {terms && (
            <Box className="subInputBox">
              <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
                <Controller
                  as={<Checkbox className="checkboxInput" />}
                  control={control}
                  defaultValue={provider.short}
                  name="short"
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.checkterms.short" />
                </label>
              </Box>
              <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
                <Controller
                  as={<Checkbox className="checkboxInput" />}
                  control={control}
                  defaultValue={provider.shortmid}
                  name="shortmid"
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.checkterms.shortmid" />
                </label>
              </Box>
              <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
                <Controller
                  as={<Checkbox className="checkboxInput" />}
                  control={control}
                  defaultValue={provider.mid}
                  name="mid"
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.checkterms.mid" />
                </label>
              </Box>
              <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
                <Controller
                  as={<Checkbox className="checkboxInput" />}
                  control={control}
                  defaultValue={provider.long}
                  name="long"
                />
                <label className={"customLabel"}>
                  <FormattedMessage id="signalp.option.checkterms.long" />
                </label>
              </Box>
            </Box>
          )}

          {provider.options.riskFilter && (
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.riskFilter}
                name="riskFilter"
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
                      className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
                      error={!!errors.risk}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">#</InputAdornment>,
                      }}
                      type="number"
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
            <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
              <Controller
                as={<Checkbox className="checkboxInput" />}
                control={control}
                defaultValue={provider.successRateFilter}
                name="successRateFilter"
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
                      className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
                      error={!!errors.successRate}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">#</InputAdornment>,
                      }}
                      type="number"
                    />
                  }
                  control={control}
                  defaultValue={provider.successRate}
                  name="successRate"
                  rules={{ required: true }}
                />
              </Box>
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
            Update
          </CustomButton>
        </Box>
      </form>
    </Box>
  );
};

export default ProviderOptionsForm;
