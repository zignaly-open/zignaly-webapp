import React, { useState, useEffect } from "react";
import "./ProviderSettingsForm.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import useQuoteAssets from "../../../hooks/useQuoteAssets";
import ToggleInput from "./ToggleInput";
import ToggleDoubleInput from "./ToggleDoubleInput";
import ToggleSelectInput from "./ToggleSelectInput";
import ToggleTargetFields from "./ToggleTargetFields";
import { creatEmptySettingsEntity } from "../../../services/tradeApiClient.types";
import { assign } from "lodash";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import ToggleTextarea from "./ToggleTextarea";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').ProviderExchangeSettingsObject} settings
 * @property {import('../../../services/tradeApiClient.types').QuoteAssetsDict} quotes
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */

const ProviderSettingsForm = ({ settings, quotes }) => {
  const storeSession = useStoreSessionSelector();
  const storeViews = useStoreViewsSelector();
  const storeSettings = useStoreSettingsSelector();
  const [loading, setLoading] = useState(false);
  const [takeProfitTargets, setProfitTargets] = useState([]);
  const [reBuyTargets, setBuyTargets] = useState([]);
  const { handleSubmit, control } = useForm();
  const dispatch = useDispatch();
  const emptySettings = creatEmptySettingsEntity();

  const initTargets = () => {
    setProfitTargets(settings.takeProfitTargets);
    setBuyTargets(settings.reBuyTargets);
  };

  useEffect(initTargets, [settings]);

  /**
   * Function to handle profit target changes.
   *
   * @param {*} data Data from fields.
   * @returns {void} None.
   */
  const handleProfitTargetsChange = (data) => {
    setProfitTargets(data);
  };

  /**
   * Function to handle re buy target changes.
   *
   * @param {*} data Data from fields.
   * @returns {void} None.
   */
  const handleBuyTargetsChange = (data) => {
    setBuyTargets(data);
  };

  /**
   *
   * @param {String} key quotes object key.
   * @param {Number} [num]
   * @returns {String} Label for input.
   */
  const getFieldName = (key, num) => {
    if (num === 1) {
      return "positionSize" + key + "Value";
    }
    if (num === 2) {
      return "positionSize" + key + "Unit";
    }

    return "positionSize" + key;
  };

  /**
   *
   * @param {Object} data Form data.
   * @returns {void} None.
   */
  const onSubmit = (data) => {
    try {
      setLoading(true);
      console.log(data);
      const payload = assign(emptySettings, data, {
        takeProfitTargets: prepareProfitTargetsPayload(),
        reBuyTargets: prepareBuyTargetsPayload(),
        token: storeSession.tradeApi.accessToken,
        providerId: storeViews.provider.id,
        internalExchangeId: storeSettings.selectedExchange.internalId,
        exchangeId: storeSettings.selectedExchange.id,
      });
      tradeApi
        .providerExchangeSettingsUpdate(payload)
        .then(() => {
          setLoading(false);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };

  const prepareProfitTargetsPayload = () => {
    if (takeProfitTargets.length) {
      return takeProfitTargets;
    }
    return false;
  };

  const prepareBuyTargetsPayload = () => {
    if (reBuyTargets.length) {
      return reBuyTargets;
    }
    return false;
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
    <Box bgcolor="grid.main" className="settingsFormWrapper" flexWrap="wrap">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="row" className="formBox">
          <Box
            alignItems="flex-start"
            className="amountsFormBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Typography variant="h3">
              <FormattedMessage id="srv.settings.amounts" />
            </Typography>

            {quotes &&
              Object.keys(quotes).map((item, index) => (
                <ToggleSelectInput
                  key={index}
                  label={
                    <FormattedMessage id="signalp.settings.amounts" values={{ quote: item }} />
                  }
                  tooltip={
                    <FormattedMessage
                      id="signalp.settings.amounts.help"
                      values={{ quote: item, notional: quotes[item].minNotional }}
                    />
                  }
                  /*@ts-ignore */
                  value1={settings[getFieldName(item, 1)]}
                  /*@ts-ignore */
                  value2={settings[getFieldName(item, 2)]}
                  name1={getFieldName(item, 1)}
                  name2={getFieldName(item, 2)}
                  control={control}
                />
              ))}
          </Box>

          <Box
            alignItems="flex-start"
            className="strategyFormBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Typography variant="h3">
              <FormattedMessage id="srv.settings.strategy" />
            </Typography>

            <ToggleInput
              label="signalp.settings.pricedeviation.entry"
              value={settings.priceDeviation}
              name="priceDeviation"
              control={control}
              unit="%"
              tooltip="signalp.settings.pricedeviation.entry.help"
            />

            <ToggleInput
              label="signalp.settings.pricedeviation.exit"
              value={settings.sellPriceDeviation}
              name="sellPriceDeviation"
              control={control}
              unit="%"
              tooltip="signalp.settings.pricedeviation.exit.help"
            />

            <ToggleInput
              label="signalp.settings.entryexpiration"
              value={settings.buyTTL}
              name="buyTTL"
              control={control}
              unit="Min"
              tooltip="signalp.settings.entryexpiration.help"
            />

            <ToggleInput
              label="signalp.settings.timeautoclose"
              value={settings.sellByTTL}
              name="sellByTTL"
              control={control}
              unit="Hours"
              tooltip="signalp.settings.timeautoclose.help"
            />

            <ToggleInput
              label="signalp.settings.stoploss"
              value={settings.stopLoss}
              name="stopLoss"
              control={control}
              unit="%"
              tooltip="signalp.settings.stoploss.help"
            />

            <ToggleDoubleInput
              label="signalp.settings.trailingstop"
              value1={settings.trailingStopTrigger}
              value2={settings.trailingStop}
              name1="trailingStopTrigger"
              name2="trailingStop"
              unitLeft1="Trigger"
              unitLeft2="Distance"
              unitRight1="%"
              unitRight2="%"
              control={control}
              tooltip="signalp.settings.trailingstop.help"
            />

            <ToggleTargetFields
              label="signalp.settings.takeprofit"
              value={settings.takeProfitTargets}
              onChange={handleProfitTargetsChange}
            />

            <ToggleTargetFields
              label="signalp.settings.dca"
              value={settings.reBuyTargets}
              onChange={handleBuyTargetsChange}
            />

            <ToggleInput
              label="signalp.settings.maxconcurrent"
              value={settings.maxPositions}
              name="maxPositions"
              control={control}
              unit="#"
              tooltip="signalp.settings.maxconcurrent.help"
            />

            <ToggleInput
              label="signalp.settings.minvolume"
              value={settings.minVolume}
              name="minVolume"
              control={control}
              unit="BTC"
              tooltip="signalp.settings.minvolume.help"
            />

            <ToggleInput
              label="signalp.settings.limitpositions"
              value={settings.positionsPerMarket}
              name="positionsPerMarket"
              control={control}
              unit="#"
              tooltip="signalp.settings.limitpositions.help"
            />

            <ToggleInput
              label="signalp.settings.leverage"
              value={settings.leverage}
              name="leverage"
              control={control}
              unit="#"
              tooltip="signalp.settings.leverage.help"
            />

            <ToggleTextarea
              label="signalp.settings.blacklist"
              value={settings.blacklist}
              name="blacklist"
              control={control}
              tooltip="signalp.settings.blacklist.help"
            />

            <ToggleTextarea
              label="signalp.settings.whitelist"
              value={settings.whitelist}
              name="whitelist"
              control={control}
              tooltip="signalp.settings.whitelist.help"
            />
          </Box>
        </Box>

        <Box className="formAction" display="flex" flexDirection="row" justifyContent="flex-end">
          <CustomButton
            className="submitButton"
            loading={loading}
            onClick={handleSubmitClick}
            type="submit"
          >
            Save Changes
          </CustomButton>
        </Box>
      </form>
    </Box>
  );
};

export default ProviderSettingsForm;
