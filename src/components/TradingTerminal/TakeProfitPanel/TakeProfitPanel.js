import React, { useEffect } from "react";
import { isNumber, range, size, sum } from "lodash";
import { FormattedMessage } from "react-intl";
import { useFormContext } from "react-hook-form";
import { Button, Box, OutlinedInput, Typography } from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import HelperLabel from "../HelperLabel/HelperLabel";
import { formatFloat2Dec, revertPercentageRange } from "../../../utils/format";
import { formatPrice } from "../../../utils/formatters";
import useExpandable from "../../../hooks/useExpandable";
import useTargetGroup from "../../../hooks/useTargetGroup";
import usePositionEntry from "../../../hooks/usePositionEntry";
import "./TakeProfitPanel.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} TakeProfitPanelProps
 * @property {MarketSymbol} symbolData
 * @property {PositionEntity} [positionEntity] Position entity (optional) for position edit trading view.
 */

/**
 * Manual trading take profit panel component.
 *
 * @param {TakeProfitPanelProps} props Component props.
 * @returns {JSX.Element} Take profit panel element.
 */
const TakeProfitPanel = (props) => {
  const { symbolData, positionEntity = null } = props;
  const positionTargetsCardinality = positionEntity ? size(positionEntity.takeProfitTargets) : 0;
  const targetIndexes = range(1, positionTargetsCardinality + 1, 1);
  const { expanded, expandClass, expandableControl } = useExpandable(
    positionTargetsCardinality > 0,
  );

  const { clearError, errors, getValues, register, setError, setValue, watch } = useFormContext();
  const defaultCardinality = positionTargetsCardinality || 1;
  const {
    cardinality,
    cardinalityRange,
    composeTargetPropertyName,
    getGroupTargetId,
    getTargetPropertyValue,
    handleTargetAdd,
    handleTargetRemove,
    setTargetPropertyValue,
    simulateInputChangeEvent,
  } = useTargetGroup("takeProfit", defaultCardinality);

  // Other panels watched variables to react on changes.
  const entryType = watch("entryType");
  const strategyPrice = watch("price");
  const strategyUnits = watch("units");
  const { limits } = symbolData;
  const { getEntryPrice, getEntrySize } = usePositionEntry(positionEntity);
  const isCopy = positionEntity ? positionEntity.isCopyTrading : false;
  const isClosed = positionEntity ? positionEntity.closed : false;
  const targetsDone = positionEntity ? positionEntity.takeProfitTargetsCountSuccess : 0;
  const isTargetLocked = cardinality === targetsDone;
  const disableCardinalityActions = isCopy || isClosed || isTargetLocked;

  const getFieldsDisabledStatus = () => {
    /**
     * @type {Object<string, boolean>}
     */
    const fieldsDisabled = {};
    targetIndexes.forEach((index) => {
      const target = positionEntity ? positionEntity.takeProfitTargets[index] : { done: false };

      let disabled = false;
      if (target.done) {
        disabled = true;
      } else if (isCopy || isClosed) {
        disabled = true;
      }

      fieldsDisabled[composeTargetPropertyName("exitUnitsPercentage", index)] = disabled;
      fieldsDisabled[composeTargetPropertyName("exitUnits", index)] = disabled;
      fieldsDisabled[composeTargetPropertyName("targetPrice", index)] = disabled;
      fieldsDisabled[composeTargetPropertyName("targetPricePercentage", index)] = disabled;
    });

    return fieldsDisabled;
  };

  const fieldsDisabled = getFieldsDisabledStatus();

  const initValuesFromPositionEntity = () => {
    if (positionEntity) {
      targetIndexes.forEach((index) => {
        const profitTarget = positionEntity.takeProfitTargets[index];
        const priceTargetPercentage = revertPercentageRange(profitTarget.priceTargetPercentage);
        const amountPercentage = revertPercentageRange(profitTarget.amountPercentage);
        setTargetPropertyValue("targetPricePercentage", index, priceTargetPercentage);
        setTargetPropertyValue("exitUnitsPercentage", index, amountPercentage);
      });
    }
  };

  useEffect(initValuesFromPositionEntity, [positionEntity, expanded]);

  /**
   * Validate result of changed target units event.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const validateExitUnits = (event) => {
    const draftPosition = getValues();
    const allUnitsPercentage = cardinalityRange.map((targetId) => {
      const targetProperty = composeTargetPropertyName("exitUnitsPercentage", targetId);
      return parseFloat(draftPosition[targetProperty]) || 0;
    });

    const targetId = getGroupTargetId(event);
    const unitsPercentageProperty = composeTargetPropertyName("exitUnitsPercentage", targetId);
    const exitUnits = getTargetPropertyValue("exitUnits", targetId);
    const allUnitsPercentageTotal = sum(allUnitsPercentage);

    clearError(unitsPercentageProperty);
    if (exitUnits <= 0) {
      setError(unitsPercentageProperty, "error", "Units must be greater than zero.");
    } else if (allUnitsPercentageTotal > 100) {
      setError(
        unitsPercentageProperty,
        "error",
        "Total units (cumulative) cannot be greater than 100%.",
      );
    }

    validateTargetExitUnitsLimits(targetId);
    validateCostLimits(targetId);
  };

  /**
   * Calculate price based on percentage change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const targetPricePercentageChange = (event) => {
    const price = getEntryPrice();
    const targetId = getGroupTargetId(event);
    const priceProperty = composeTargetPropertyName("targetPrice", targetId);
    const targetPercentage = getTargetPropertyValue("targetPricePercentage", targetId);
    const targetPrice = price * ((targetPercentage + 100) / 100);

    if (isNaN(targetPercentage)) {
      setError(
        composeTargetPropertyName("targetPricePercentage", targetId),
        "error",
        "Target percentage must be a number.",
      );

      setValue(priceProperty, "");
      return;
    }

    if (isNumber(targetPercentage) && targetPercentage !== 0) {
      setValue(priceProperty, formatPrice(targetPrice));
    } else {
      setValue(priceProperty, "");
    }

    validateTargetPriceLimits(targetId);
  };

  /**
   * Calculate percentage based on price change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const targetPriceChange = (event) => {
    const price = getEntryPrice();
    const targetId = getGroupTargetId(event);
    const pricePercentageProperty = composeTargetPropertyName("targetPricePercentage", targetId);
    const targetPrice = getTargetPropertyValue("targetPrice", targetId);

    if (isNaN(targetPrice)) {
      setError(
        composeTargetPropertyName("targetPrice", targetId),
        "error",
        "Target price must be a number.",
      );

      setValue(pricePercentageProperty, "");
      return;
    }

    if (isNumber(targetPrice) && targetPrice !== 0) {
      const priceDiff = targetPrice - price;
      const targetPercentage = (priceDiff / price) * 100;
      setValue(pricePercentageProperty, formatFloat2Dec(targetPercentage));
    } else {
      setValue(pricePercentageProperty, "");
    }

    validateTargetPriceLimits(targetId);
  };

  /**
   * Calculate units based on units percentage change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const exitUnitsPercentageChange = (event) => {
    const units = getEntrySize();
    const targetId = getGroupTargetId(event);
    const unitsProperty = composeTargetPropertyName("exitUnits", targetId);
    const unitsPercentage = getTargetPropertyValue("exitUnitsPercentage", targetId);

    if (isNaN(unitsPercentage)) {
      setError(
        composeTargetPropertyName("exitUnitsPercentage", targetId),
        "error",
        "Exit units percentage must be a number.",
      );

      setValue(unitsProperty, "");
      return;
    }

    if (unitsPercentage > 0) {
      const targetUnits = units * (unitsPercentage / 100);
      setValue(unitsProperty, formatPrice(targetUnits));
    } else {
      setValue(unitsProperty, "");
    }

    validateExitUnits(event);
  };

  /**
   * Calculate units percentage based on units change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const exitUnitsChange = (event) => {
    const units = getEntrySize();
    const targetId = getGroupTargetId(event);
    const unitsPercentageProperty = composeTargetPropertyName("exitUnitsPercentage", targetId);
    const exitUnits = getTargetPropertyValue("exitUnits", targetId);

    if (isNaN(exitUnits)) {
      setError(
        composeTargetPropertyName("exitUnits", targetId),
        "error",
        "Exit units must be a number.",
      );

      setValue(unitsPercentageProperty, "");
      return;
    }

    if (units > 0 && exitUnits > 0) {
      const unitsDiff = units - exitUnits;
      const unitsPercentage = (1 - unitsDiff / units) * 100;
      setValue(unitsPercentageProperty, formatFloat2Dec(unitsPercentage));
    } else {
      setValue(unitsPercentageProperty, "");
    }

    validateExitUnits(event);
  };

  /**
   * Validate that target price is within limits.
   *
   * @param {string} targetId Target index ID.
   * @returns {Void} None.
   */
  const validateTargetPriceLimits = (targetId) => {
    const priceProperty = composeTargetPropertyName("targetPrice", targetId);
    const targetPrice = getTargetPropertyValue("targetPrice", targetId);

    clearError(priceProperty);
    if (limits.price.min && targetPrice < limits.price.min) {
      setError(priceProperty, "error", `Target price cannot be lower than ${limits.price.min}`);
    }

    if (limits.price.max && targetPrice > limits.price.max) {
      setError(priceProperty, "error", `Target price cannot be greater than ${limits.price.max}`);
    }

    validateCostLimits(targetId);
  };

  /**
   * Validate that cost is within limits.
   *
   * @param {string} targetId Target index ID.
   * @returns {Void} None.
   */
  const validateCostLimits = (targetId) => {
    const unitsProperty = composeTargetPropertyName("exitUnits", targetId);
    const targetPrice = getTargetPropertyValue("targetPrice", targetId);
    const exitUnits = getTargetPropertyValue("exitUnits", targetId);
    const cost = Math.abs(targetPrice * exitUnits);

    clearError(unitsProperty);
    if (limits.cost.min && cost > 0 && cost < limits.cost.min) {
      setError(unitsProperty, "error", `Exit cost cannot be lower than ${limits.cost.min}`);
    }

    if (limits.cost.max && cost > 0 && cost > limits.cost.max) {
      setError(unitsProperty, "error", `Exit cost cannot be greater than ${limits.cost.max}`);
    }
  };

  /**
   * Validate that target units is within limits.
   *
   * @param {string} targetId Target index ID.
   * @returns {Void} None.
   */
  const validateTargetExitUnitsLimits = (targetId) => {
    const unitsProperty = composeTargetPropertyName("exitUnits", targetId);
    const exitUnits = getTargetPropertyValue("exitUnits", targetId);

    clearError(unitsProperty);
    if (limits.amount.min && exitUnits < limits.amount.min) {
      setError(
        unitsProperty,
        "error",
        `Target units to exit cannot be lower than ${limits.amount.min}`,
      );
    }

    if (limits.amount.max && exitUnits > limits.amount.max) {
      setError(
        unitsProperty,
        "error",
        `Target units to exit cannot be greater than ${limits.amount.max}`,
      );
    }
  };

  const chainedPriceUpdates = () => {
    cardinalityRange.forEach((targetId) => {
      const currentValue = getTargetPropertyValue("targetPricePercentage", targetId);
      const newValue = formatFloat2Dec(Math.abs(currentValue));
      const sign = entryType === "SHORT" ? "-" : "";

      if (isNaN(currentValue)) {
        setTargetPropertyValue("targetPricePercentage", targetId, sign);
      } else {
        setTargetPropertyValue("targetPricePercentage", targetId, `${sign}${newValue}`);
      }

      simulateInputChangeEvent(composeTargetPropertyName("targetPricePercentage", targetId));
    });
  };

  useEffect(chainedPriceUpdates, [expanded, entryType, cardinality, strategyPrice]);

  const chainedUnitsUpdates = () => {
    cardinalityRange.forEach((targetId) => {
      simulateInputChangeEvent(composeTargetPropertyName("exitUnitsPercentage", targetId));
    });
  };

  useEffect(chainedUnitsUpdates, [strategyUnits]);

  const emptyFieldsWhenCollapsed = () => {
    if (!expanded) {
      cardinalityRange.forEach((targetId) => {
        clearError(composeTargetPropertyName("exitUnitsPercentage", targetId));
        clearError(composeTargetPropertyName("exitUnits", targetId));
        clearError(composeTargetPropertyName("targetPrice", targetId));
        clearError(composeTargetPropertyName("targetPricePercentage", targetId));
      });
    }
  };

  useEffect(emptyFieldsWhenCollapsed, [expanded]);

  /**
   * Compose dynamic target property errors.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @returns {JSX.Element|null} Errors JSX element.
   */
  const displayTargetFieldErrors = (propertyName, targetId) => {
    const targetProperty = composeTargetPropertyName(propertyName, targetId);
    if (errors[targetProperty]) {
      return <span className="errorText">{errors[targetProperty].message}</span>;
    }

    return null;
  };

  return (
    <Box className={`panel takeProfitPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {expandableControl}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.takeprofit" />
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
          {cardinalityRange.map((targetId) => (
            <Box className="targetGroup" data-target-id={targetId} key={`target${targetId}`}>
              <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
                <HelperLabel descriptionId="terminal.takeprofit.help" labelId="terminal.target" />
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    disabled={
                      fieldsDisabled[composeTargetPropertyName("targetPricePercentage", targetId)]
                    }
                    inputRef={register}
                    name={composeTargetPropertyName("targetPricePercentage", targetId)}
                    onChange={targetPricePercentageChange}
                  />
                  <div className="currencyBox">%</div>
                </Box>
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    disabled={fieldsDisabled[composeTargetPropertyName("targetPrice", targetId)]}
                    inputRef={register}
                    name={composeTargetPropertyName("targetPrice", targetId)}
                    onChange={targetPriceChange}
                  />
                  <div className="currencyBox">{symbolData.quote}</div>
                </Box>
              </Box>
              {displayTargetFieldErrors("targetPricePercentage", targetId)}
              {displayTargetFieldErrors("targetPrice", targetId)}
              <Box className="targetUnits" display="flex" flexDirection="row" flexWrap="wrap">
                <HelperLabel
                  descriptionId="terminal.unitstoexit.help"
                  labelId="terminal.unitstoexit"
                />
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    disabled={
                      fieldsDisabled[composeTargetPropertyName("exitUnitsPercentage", targetId)]
                    }
                    inputRef={register}
                    name={composeTargetPropertyName("exitUnitsPercentage", targetId)}
                    onChange={exitUnitsPercentageChange}
                  />
                  <div className="currencyBox">%</div>
                </Box>
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    disabled={fieldsDisabled[composeTargetPropertyName("exitUnits", targetId)]}
                    inputRef={register}
                    name={composeTargetPropertyName("exitUnits", targetId)}
                    onChange={exitUnitsChange}
                  />
                  <div className="currencyBox">{symbolData.base}</div>
                </Box>
                {displayTargetFieldErrors("exitUnitsPercentage", targetId)}
                {displayTargetFieldErrors("exitUnits", targetId)}
              </Box>
            </Box>
          ))}
          {!disableCardinalityActions && (
            <Box className="targetActions" display="flex" flexDirection="row" flexWrap="wrap">
              <Button className="removeTarget" onClick={handleTargetRemove}>
                <RemoveCircle />
                <FormattedMessage id="terminal.target.remove" />
              </Button>
              <Button className="addTarget" onClick={handleTargetAdd}>
                <AddCircle />
                <FormattedMessage id="terminal.target.add" />
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(TakeProfitPanel);
