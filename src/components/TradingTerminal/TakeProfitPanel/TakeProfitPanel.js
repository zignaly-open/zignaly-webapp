import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useFormContext } from "react-hook-form";
import HelperLabel from "../HelperLabel/HelperLabel";
import { OutlinedInput } from "@material-ui/core";
import { Button, Box, Switch, Typography } from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { isNumber, range, sum } from "lodash";
import "./TakeProfitPanel.scss";
import { formatFloat2Dec } from "../../../utils/format";
import { formatPrice } from "../../../utils/formatters";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 */

/**
 * @typedef {Object} TakeProfitPanelProps
 * @property {MarketSymbol} symbolData
 * @property {CoinRayCandle} lastPriceCandle
 */

/**
 * Manual trading take profit panel component.
 *
 * @param {TakeProfitPanelProps} props Component props.
 * @returns {JSX.Element} Take profit panel element.
 */
const TakeProfitPanel = (props) => {
  const { symbolData, lastPriceCandle } = props;
  const defaultExpand = false;
  const [expand, setExpand] = useState(defaultExpand);
  const expandClass = expand ? "expanded" : "collapsed";
  const { errors, getValues, register, clearError, setError, setValue, watch } = useFormContext();
  const [cardinality, setCardinality] = useState(1);
  const cardinalityRange = range(1, cardinality + 1, 1);
  const entryType = watch("entryType");
  const limitPrice = watch("price");
  const units = watch("units");
  const { limits } = symbolData;

  /**
   * Handle toggle switch action.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Click event.
   * @returns {Void} None.
   */
  const handleToggle = (event) => {
    const targetElement = event.currentTarget;
    setExpand(targetElement.checked);
  };

  const handleTargetAdd = () => {
    setCardinality(cardinality + 1);
  };

  const handleTargetRemove = () => {
    if (cardinality > 0) {
      setCardinality(cardinality - 1);
    }
  };

  /**
   * Compose dynamic target property name.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @returns {string} Property name for a given target index.
   */
  const composeTargetPropertyName = (propertyName, targetId) => {
    const targetPropertyName = `${propertyName}${targetId}`;

    return targetPropertyName;
  };

  /**
   * Get target property form state value.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @returns {number} Target property value.
   */
  const getTargetPropertyValue = (propertyName, targetId) => {
    const draftPosition = getValues();
    const targetPropertyName = composeTargetPropertyName(propertyName, targetId);

    return parseFloat(draftPosition[targetPropertyName]) || 0;
  };

  /**
   * Set target property form state value.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @param {string} value Value to set.
   * @returns {Void} None.
   */
  const setTargetPropertyValue = (propertyName, targetId, value) => {
    const targetPropertyName = composeTargetPropertyName(propertyName, targetId);

    return setValue(targetPropertyName, value);
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

  /**
   * Validate result of changed target units event.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const validateExitUnits = (event) => {
    const draftPosition = getValues();
    const allUnitsPercentage = cardinalityRange.map((index) => {
      const targetProperty = composeTargetPropertyName("exitUnitsPercentage", String(index));
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
   * Get target group ID for changed input element event.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {string} Target group ID (cardinality);
   */
  const getGroupTargetId = (event) => {
    const targetElement = event.currentTarget;
    const targetGroup = targetElement.closest(".targetGroup");
    const targetId = targetGroup.getAttribute("data-target-id");

    return targetId;
  };

  /**
   * Calculate price based on percentage change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const targetPricePercentageChange = (event) => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);
    const targetId = getGroupTargetId(event);
    const priceProperty = composeTargetPropertyName("targetPrice", targetId);
    const targetPercentage = getTargetPropertyValue("targetPricePercentage", targetId);
    const targetPrice = price * ((targetPercentage + 100) / 100);

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
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);
    const targetId = getGroupTargetId(event);
    const pricePercentageProperty = composeTargetPropertyName("targetPricePercentage", targetId);
    const targetPrice = getTargetPropertyValue("targetPrice", targetId);

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
    const draftPosition = getValues();
    const units = parseFloat(draftPosition.units) || 0;
    const targetId = getGroupTargetId(event);
    const unitsProperty = composeTargetPropertyName("exitUnits", targetId);
    const unitsPercentage = getTargetPropertyValue("exitUnitsPercentage", targetId);

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
    const draftPosition = getValues();
    const units = parseFloat(draftPosition.units) || 0;
    const targetId = getGroupTargetId(event);
    const unitsPercentageProperty = composeTargetPropertyName("exitUnitsPercentage", targetId);
    const exitUnits = getTargetPropertyValue("exitUnits", targetId);

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
  function validateCostLimits(targetId) {
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
  }

  /**
   * Progrmatically invoke change event simulation on a given element.
   *
   * @param {String} elementName Element name.
   * @returns {Void} None.
   */
  const simulateInputChangeEvent = (elementName) => {
    const matches = document.getElementsByName(elementName);
    const item = matches[0] || null;

    // @ts-ignore
    if (item && item._valueTracker) {
      // @ts-ignore
      item._valueTracker.setValue("");
      // Programatically invoke change event.
      const event = new Event("input", { bubbles: true });
      item.dispatchEvent(event);
    }
  };

  const chainedPriceUpdates = () => {
    cardinalityRange.forEach((index) => {
      const targetId = String(index);
      const currentValue = getTargetPropertyValue("targetPricePercentage", targetId);
      const newValue = formatFloat2Dec(Math.abs(currentValue));
      const sign = entryType === "SHORT" ? "-" : "";

      if (currentValue === 0) {
        setTargetPropertyValue("targetPricePercentage", targetId, sign);
      } else {
        setTargetPropertyValue("targetPricePercentage", targetId, `${sign}${newValue}`);
      }

      simulateInputChangeEvent(composeTargetPropertyName("targetPricePercentage", targetId));
    });
  };

  useEffect(chainedPriceUpdates, [entryType, cardinality, limitPrice]);

  const chainedUnitsUpdates = () => {
    cardinalityRange.forEach((index) => {
      const targetId = String(index);
      simulateInputChangeEvent(composeTargetPropertyName("exitUnitsPercentage", targetId));
    });
  };

  useEffect(chainedUnitsUpdates, [units]);

  /**
   * Compose dynamic target property errors.
   *
   * @param {string} propertyName Property base name.
   * @param {number} targetId Target index ID.
   * @returns {JSX.Element|null} Errors JSX element.
   */
  const displayTargetFieldErrors = (propertyName, targetId) => {
    const targetProperty = composeTargetPropertyName(propertyName, String(targetId));
    if (errors[targetProperty]) {
      return <span className="errorText">{errors[targetProperty].message}</span>;
    }

    return null;
  };

  return (
    <Box className={`strategyPanel takeProfitPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        <Switch onChange={handleToggle} size="small" />
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.takeprofit" />
          </Typography>
        </Box>
      </Box>
      {expand && (
        <Box
          className="panelContent"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-around"
        >
          {cardinalityRange.map((index) => (
            <Box className="targetGroup" data-target-id={index} key={`target${index}`}>
              <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
                <HelperLabel descriptionId="terminal.takeprofit.help" labelId="terminal.target" />
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    inputRef={register}
                    name={`targetPricePercentage${index}`}
                    onChange={targetPricePercentageChange}
                  />
                  <div className="currencyBox">%</div>
                </Box>
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    inputRef={register}
                    name={`targetPrice${index}`}
                    onChange={targetPriceChange}
                  />
                  <div className="currencyBox">{symbolData.quote}</div>
                </Box>
              </Box>
              {displayTargetFieldErrors("targetPrice", index)}
              <Box className="targetUnits" display="flex" flexDirection="row" flexWrap="wrap">
                <HelperLabel
                  descriptionId="terminal.unitstoexit.help"
                  labelId="terminal.unitstoexit"
                />
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    inputRef={register}
                    name={`exitUnitsPercentage${index}`}
                    onChange={exitUnitsPercentageChange}
                  />
                  <div className="currencyBox">%</div>
                </Box>
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    inputRef={register}
                    name={`exitUnits${index}`}
                    onChange={exitUnitsChange}
                  />
                  <div className="currencyBox">{symbolData.base}</div>
                </Box>
                {displayTargetFieldErrors("exitUnitsPercentage", index)}
                {displayTargetFieldErrors("exitUnits", index)}
              </Box>
            </Box>
          ))}
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
        </Box>
      )}
    </Box>
  );
};

export default TakeProfitPanel;
