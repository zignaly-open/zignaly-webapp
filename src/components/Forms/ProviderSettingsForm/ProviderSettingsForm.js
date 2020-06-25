import React, { useState, useEffect } from "react";
import "./ProviderSettingsForm.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
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
   * Function to generate the amount field names.
   *
   * @param {String} key Cuotes object key.
   * @param {Number} [num] Conditional value.
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
        <Box className="formBox" display="flex" flexDirection="row">
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
                  control={control}
                  key={index}
                  label={
                    <FormattedMessage id="signalp.settings.amounts" values={{ quote: item }} />
                  }
                  /* @ts-ignore */
                  name1={getFieldName(item, 1)}
                  /* @ts-ignore */
                  name2={getFieldName(item, 2)}
                  tooltip={
                    <FormattedMessage
                      id="signalp.settings.amounts.help"
                      values={{ quote: item, notional: quotes[item].minNotional }}
                    />
                  }
                  /* @ts-ignore */
                  value1={settings[getFieldName(item, 1)]}
                  /* @ts-ignore */
                  value2={settings[getFieldName(item, 2)]}
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
              control={control}
              label="signalp.settings.pricedeviation.entry"
              name="priceDeviation"
              tooltip="signalp.settings.pricedeviation.entry.help"
              unit="%"
              value={settings.priceDeviation}
            />

            <ToggleInput
              control={control}
              label="signalp.settings.pricedeviation.exit"
              name="sellPriceDeviation"
              tooltip="signalp.settings.pricedeviation.exit.help"
              unit="%"
              value={settings.sellPriceDeviation}
            />

            <ToggleInput
              control={control}
              label="signalp.settings.entryexpiration"
              name="buyTTL"
              tooltip="signalp.settings.entryexpiration.help"
              unit="Min"
              value={settings.buyTTL}
            />

            <ToggleInput
              control={control}
              label="signalp.settings.timeautoclose"
              name="sellByTTL"
              tooltip="signalp.settings.timeautoclose.help"
              unit="Hours"
              value={settings.sellByTTL}
            />

            <ToggleInput
              control={control}
              label="signalp.settings.stoploss"
              name="stopLoss"
              tooltip="signalp.settings.stoploss.help"
              unit="%"
              value={settings.stopLoss}
            />

            <ToggleDoubleInput
              control={control}
              label="signalp.settings.trailingstop"
              name1="trailingStopTrigger"
              name2="trailingStop"
              tooltip="signalp.settings.trailingstop.help"
              unitLeft1="Trigger"
              unitLeft2="Distance"
              unitRight1="%"
              unitRight2="%"
              value1={settings.trailingStopTrigger}
              value2={settings.trailingStop}
            />

            <ToggleTargetFields
              label="signalp.settings.takeprofit"
              onChange={handleProfitTargetsChange}
              value={settings.takeProfitTargets}
            />

            <ToggleTargetFields
              label="signalp.settings.dca"
              onChange={handleBuyTargetsChange}
              value={settings.reBuyTargets}
            />

            <ToggleInput
              control={control}
              label="signalp.settings.maxconcurrent"
              name="maxPositions"
              tooltip="signalp.settings.maxconcurrent.help"
              unit="#"
              value={settings.maxPositions}
            />

            <ToggleInput
              control={control}
              label="signalp.settings.minvolume"
              name="minVolume"
              tooltip="signalp.settings.minvolume.help"
              unit="BTC"
              value={settings.minVolume}
            />

            <ToggleInput
              control={control}
              label="signalp.settings.limitpositions"
              name="positionsPerMarket"
              tooltip="signalp.settings.limitpositions.help"
              unit="#"
              value={settings.positionsPerMarket}
            />

            <ToggleInput
              control={control}
              label="signalp.settings.leverage"
              name="leverage"
              tooltip="signalp.settings.leverage.help"
              unit="#"
              value={settings.leverage}
            />

            <ToggleTextarea
              control={control}
              label="signalp.settings.blacklist"
              name="blacklist"
              tooltip="signalp.settings.blacklist.help"
              value={settings.blacklist}
            />

            <ToggleTextarea
              control={control}
              label="signalp.settings.whitelist"
              name="whitelist"
              tooltip="signalp.settings.whitelist.help"
              value={settings.whitelist}
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
