import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { isNumber, lt, gt } from "lodash";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Box, OutlinedInput, Typography } from "@material-ui/core";
import { formatFloat2Dec } from "../../../utils/format";
import { formatPrice } from "../../../utils/formatters";
import { isValidIntOrFloat } from "../../../utils/validators";
import { useFormContext } from "react-hook-form";
import { simulateInputChangeEvent } from "../../../utils/events";
import useExpandable from "../../../hooks/useExpandable";
import useSymbolLimitsValidate from "../../../hooks/useSymbolLimitsValidate";
import usePositionEntry from "../../../hooks/usePositionEntry";
import "./StopLossPanel.scss";

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
  const existsStopLoss = positionEntity
    ? isNumber(positionEntity.stopLossPrice) && isNumber(positionEntity.stopLossPercentage)
    : false;
  const { expanded, expandClass, expandableControl } = useExpandable(existsStopLoss);
  const { clearErrors, errors, getValues, register, setError, setValue, watch } = useFormContext();
  const { validateTargetPriceLimits } = useSymbolLimitsValidate(symbolData);
  const { getEntryPrice, getEntryPricePercentChange } = usePositionEntry(positionEntity);
  const { formatMessage } = useIntl();
  // Strategy panels inputs to observe for changes.
  const entryType = positionEntity ? positionEntity.side : watch("entryType");
  const strategyPrice = watch("price");
  const isCopy = positionEntity ? positionEntity.isCopyTrading : false;
  const isClosed = positionEntity ? positionEntity.closed : false;
  const isCopyTrader = positionEntity ? positionEntity.isCopyTrader : false;
  const isUpdating = positionEntity ? positionEntity.updating : false;
  const isOpening = positionEntity ? positionEntity.status === 1 : false;
  const isReadOnly = (isCopy && !isCopyTrader) || isClosed || isUpdating || isOpening;

  const getFieldsDisabledStatus = () => {
    /**
     * @type {Object<string, boolean>}
     */
    const fieldsDisabled = {};
    let disabled = false;
    if (isReadOnly) {
      disabled = true;
    }

    fieldsDisabled.stopLossPrice = disabled;
    fieldsDisabled.stopLossPercentage = disabled;

    return fieldsDisabled;
  };

  const fieldsDisabled = getFieldsDisabledStatus();

  /**
   * Validate target percentage limits.
   *
   * @returns {boolean} true if validation pass, false otherwise.
   */
  function validateStopLossPercentageLimits() {
    const draftPosition = getValues();
    const stopLossPercentage = parseFloat(draftPosition.stopLossPercentage);
    const valueType = entryType === "LONG" ? "lower" : "greater";
    const compareFn = entryType === "LONG" ? gt : lt;
    const pricePercentChange = formatFloat2Dec(getEntryPricePercentChange());

    if (draftPosition.stopLossPercentage !== "-") {
      if (
        !isValidIntOrFloat(draftPosition.stopLossPercentage) ||
        compareFn(stopLossPercentage, pricePercentChange)
      ) {
        setError("stopLossPercentage", {
          type: "manual",
          message: formatMessage(
            { id: "terminal.stoploss.valid.percentage" },
            { type: valueType, value: pricePercentChange },
          ),
        });

        return false;
      }
    }

    return true;
  }

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

    if (!validateStopLossPercentageLimits()) {
      return;
    }

    if (!isNaN(price) && price > 0) {
      setValue("stopLossPrice", formatPrice(stopLossPrice, "", ""));
    } else {
      setValue("stopLossPrice", "");
    }

    if (!validateTargetPriceLimits(stopLossPrice, "stopLossPrice", "terminal.stoploss.limit")) {
      return;
    }

    if (errors.stopLossPercentage) {
      clearErrors("stopLossPercentage");
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

    if (!isValidIntOrFloat(draftPosition.stopLossPrice) || stopLossPrice < 0) {
      setError("stopLossPrice", {
        type: "manual",
        message: formatMessage({ id: "terminal.stoploss.limit.zero" }),
      });
      return;
    }

    if (!isNaN(priceDiff) && priceDiff !== 0) {
      const stopLossPercentage = (priceDiff / price) * 100;
      setValue("stopLossPercentage", formatFloat2Dec(stopLossPercentage));
      if (validateStopLossPercentageLimits()) {
        if (errors.stopLossPercentage) {
          clearErrors("stopLossPercentage");
        }
      }
    } else {
      setValue("stopLossPercentage", "");
    }

    if (!validateTargetPriceLimits(stopLossPrice, "stopLossPrice", "terminal.stoploss.limit")) {
      return;
    }

    if (errors.stopLossPrice) {
      clearErrors("stopLossPrice");
    }
  };

  const chainedPriceUpdates = () => {
    const draftPosition = getValues();
    const initialStopLossPercentage = positionEntity ? positionEntity.stopLossPercentage : null;
    const stopLossPercentage =
      parseFloat(draftPosition.stopLossPercentage) || initialStopLossPercentage;
    const newValue = formatFloat2Dec(Math.abs(stopLossPercentage));
    const sign = entryType === "SHORT" ? "" : "-";

    if (!stopLossPercentage) {
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

  useEffect(chainedPriceUpdates, [expanded, positionEntity, entryType, strategyPrice]);

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
        clearErrors("stopLossPercentage");
      }

      if (errors.stopLossPrice) {
        clearErrors("stopLossPrice");
      }
    }
  };

  useEffect(emptyFieldsWhenCollapsed, [expanded]);

  return (
    <Box className={`panel stopLossPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!isClosed && expandableControl}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.stoploss" />
          </Typography>
          <input name="unrealizedProfitLossesPercentage" ref={register} type="hidden" />
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
