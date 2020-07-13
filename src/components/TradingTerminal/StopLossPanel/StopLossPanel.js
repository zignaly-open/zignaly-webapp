import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { inRange, lt, gt } from "lodash";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Box, OutlinedInput, Typography } from "@material-ui/core";
import { formatFloat2Dec } from "../../../utils/format";
import { formatPrice } from "../../../utils/formatters";
import { useFormContext } from "react-hook-form";
import { simulateInputChangeEvent } from "../../../utils/events";
import useExpandable from "../../../hooks/useExpandable";
import useSymbolLimitsValidate from "../../../hooks/useSymbolLimitsValidate";
import "./StopLossPanel.scss";
import usePositionEntry from "../../../hooks/usePositionEntry";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} StopLossPanel
 * @property {MarketSymbol} symbolData
 * @property {PositionEntity} [positionEntity] Position entity (optional) for position edit trading view.
 */

/**
 * Manual trading stop loss panel component.
 *
 * @param {StopLossPanel} props Component props.
 * @returns {JSX.Element} Take profit panel element.
 */
const StopLossPanel = (props) => {
  const { symbolData, positionEntity } = props;
  const existsStopLoss = positionEntity ? Boolean(positionEntity.stopLossPrice) : false;
  const { expanded, expandClass, expandableControl } = useExpandable(existsStopLoss);
  const { clearError, errors, getValues, register, setError, setValue, watch } = useFormContext();
  const { validateTargetPriceLimits } = useSymbolLimitsValidate(symbolData);
  const { getEntryPrice } = usePositionEntry(positionEntity);
  const { formatMessage } = useIntl();
  // Strategy panels inputs to observe for changes.
  const entryType = watch("entryType");
  const strategyPrice = watch("price");

  const getFieldsDisabledStatus = () => {
    const isCopy = positionEntity ? positionEntity.isCopyTrading : false;
    const isClosed = positionEntity ? positionEntity.closed : false;

    /**
     * @type {Object<string, boolean>}
     */
    const fieldsDisabled = {};
    let disabled = false;
    if (isCopy || isClosed) {
      disabled = true;
    }

    fieldsDisabled.stopLossPrice = disabled;
    fieldsDisabled.stopLossPercentage = disabled;

    return fieldsDisabled;
  };

  const fieldsDisabled = getFieldsDisabledStatus();

  const initValuesFromPositionEntity = () => {
    if (positionEntity && existsStopLoss) {
      const stopLossPercentage = positionEntity.stopLossPercentage;
      if (inRange(Math.abs(stopLossPercentage), 0, 100)) {
        setValue("stopLossPercentage", formatFloat2Dec(stopLossPercentage));
      }
    }
  };

  useEffect(initValuesFromPositionEntity, [positionEntity, expanded]);

  /**
   * Calculate price based on percentage when value is changed.
   *
   * @return {Void} None.
   */
  const stopLossPercentageChange = () => {
    const draftPosition = getValues();
    const price = getEntryPrice();
    const stopLossPercentage = parseFloat(draftPosition.stopLossPercentage);
    const stopLossPrice = (price * (100 + stopLossPercentage)) / 100;
    const valueType = entryType === "LONG" ? "lower" : "greater";
    const compareFn = entryType === "LONG" ? gt : lt;

    if (draftPosition.stopLossPercentage !== "-") {
      if (isNaN(stopLossPercentage) || compareFn(stopLossPercentage, 0)) {
        setError(
          "stopLossPercentage",
          "error",
          formatMessage({ id: "terminal.stoploss.valid.percentage" }, { type: valueType }),
        );
        return;
      }
    }

    if (!isNaN(price) && price > 0) {
      setValue("stopLossPrice", formatPrice(stopLossPrice, ""));
    } else {
      setValue("stopLossPrice", "");
    }

    if (!validateTargetPriceLimits(stopLossPrice, "stopLossPrice", "terminal.stoploss.limit")) {
      return;
    }

    if (errors.stopLossPercentage) {
      clearError("stopLossPrice");
    }
  };

  /**
   * Calculate percentage based on price when value is changed.
   *
   * @return {Void} None.
   */
  const stopLossPriceChange = () => {
    const draftPosition = getValues();
    const price = getEntryPrice();
    const stopLossPrice = parseFloat(draftPosition.stopLossPrice);
    const priceDiff = stopLossPrice - price;

    if (isNaN(stopLossPrice) || stopLossPrice < 0) {
      setError("stopLossPrice", "error", formatMessage({ id: "terminal.stoploss.limit.zero" }));
      return;
    }

    if (!isNaN(priceDiff) && priceDiff !== 0) {
      const stopLossPercentage = (priceDiff / price) * 100;
      setValue("stopLossPercentage", formatFloat2Dec(stopLossPercentage));
    } else {
      setValue("stopLossPercentage", "");
    }

    if (!validateTargetPriceLimits(stopLossPrice, "stopLossPrice", "terminal.stoploss.limit")) {
      return;
    }

    if (errors.stopLossPercentage) {
      clearError("stopLossPrice");
    }
  };

  const chainedPriceUpdates = () => {
    const draftPosition = getValues();
    const stopLossPercentage = parseFloat(draftPosition.stopLossPercentage) || 0;
    const newValue = formatFloat2Dec(Math.abs(stopLossPercentage));
    const sign = entryType === "SHORT" ? "" : "-";

    if (stopLossPercentage === 0) {
      setValue("stopLossPercentage", sign);
    } else {
      setValue("stopLossPercentage", `${sign}${newValue}`);
    }

    if (expanded) {
      simulateInputChangeEvent("stopLossPercentage");
    } else {
      setValue("stopLossPrice", "");
    }
  };

  useEffect(chainedPriceUpdates, [expanded, entryType, strategyPrice]);

  /**
   * Display property errors.
   *
   * @param {string} propertyName Property name to display errors for.
   * @returns {JSX.Element|null} Errors JSX element.
   */
  const displayFieldErrors = (propertyName) => {
    if (errors[propertyName]) {
      return <span className="errorText">{errors[propertyName].message}</span>;
    }

    return null;
  };

  const emptyFieldsWhenCollapsed = () => {
    if (!expanded) {
      if (errors.stopLossPercentage) {
        clearError("stopLossPercentage");
      }

      if (errors.stopLossPrice) {
        clearError("stopLossPrice");
      }
    }
  };

  useEffect(emptyFieldsWhenCollapsed, [expanded]);

  return (
    <Box className={`panel stopLossPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {expandableControl}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.stoploss" />
          </Typography>
        </Box>
      </Box>
      {expanded && (
        <Box
          className="panelContent"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-around"
        >
          <Box className="stopLoss">
            <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
              <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.stoploss" />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  disabled={fieldsDisabled.stopLossPercentage}
                  inputRef={register}
                  name="stopLossPercentage"
                  onChange={stopLossPercentageChange}
                />
                <div className="currencyBox">%</div>
              </Box>
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  disabled={fieldsDisabled.stopLossPrice}
                  inputRef={register}
                  name="stopLossPrice"
                  onChange={stopLossPriceChange}
                />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
            </Box>
            {displayFieldErrors("stopLossPercentage")}
            {displayFieldErrors("stopLossPrice")}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(StopLossPanel);
