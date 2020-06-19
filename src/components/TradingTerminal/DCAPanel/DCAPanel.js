import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Button, Box, OutlinedInput, Typography } from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { formatFloat2Dec } from "../../../utils/format";
import useExpandable from "../../../hooks/useExpandable";
import useTargetGroup from "../../../hooks/useTargetGroup";
import { useFormContext } from "react-hook-form";
import "./DCAPanel.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 */

/**
 * @typedef {Object} DCAPanelProps
 * @property {MarketSymbol} symbolData
 */

/**
 * Manual trading take profit panel component.
 *
 * @param {DCAPanelProps} props Component props.
 * @returns {JSX.Element} Take profit panel element.
 */
const DCAPanel = (props) => {
  const { symbolData } = props;
  const { expanded, expandClass, expandableControl } = useExpandable();
  const { clearError, errors, getValues, register, setError, watch } = useFormContext();
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
  } = useTargetGroup("dca");
  const { limits } = symbolData;
  const entryType = watch("entryType");
  const strategyPrice = watch("price");
  const strategyPositionSize = watch("positionSize");

  /**
   * Validate that target price is within limits.
   *
   * @param {number} targetPrice Rebuy target price.
   * @param {string} propertyName Property name that validation error attachs to.
   * @returns {Void} None.
   */
  const validateTargetPriceLimits = (targetPrice, propertyName) => {
    console.log("targetPrice: ", targetPrice);
    clearError(propertyName);
    if (limits.price.min && targetPrice < limits.price.min) {
      setError(
        propertyName,
        "error",
        `Rebuy target price cannot be lower than ${limits.price.min}`,
      );
    }

    if (limits.price.max && targetPrice > limits.price.max) {
      setError(
        propertyName,
        "error",
        `Rebuy target price cannot be greater than ${limits.price.max}`,
      );
    }
  };

  /**
   * Validate that cost is within limits.
   *
   * @param {number} cost Cost amount.
   * @param {string} propertyName Property name that validation error attachs to.
   * @returns {Void} None.
   */
  function validateCostLimits(cost, propertyName) {
    if (limits.cost.min && cost > 0 && cost < limits.cost.min) {
      setError(propertyName, "error", `Rebuy cost cannot be lower than ${limits.cost.min}`);
    }

    if (limits.cost.max && cost > 0 && cost > limits.cost.max) {
      setError(propertyName, "error", `Rebuy cost cannot be greater than ${limits.cost.max}`);
    }
  }

  /**
   * Validate that target units is within limits.
   *
   * @param {number} units Rebuy units.
   * @param {string} propertyName Property name that validation error attachs to.
   * @returns {Void} None.
   */
  const validateUnitsLimits = (units, propertyName) => {
    clearError(propertyName);
    if (limits.amount.min && units < limits.amount.min) {
      setError(
        propertyName,
        "error",
        `Rebuy target units to exit cannot be lower than ${limits.amount.min}`,
      );
    }

    if (limits.amount.max && units > limits.amount.max) {
      setError(
        propertyName,
        "error",
        `Rebuy target units to exit cannot be greater than ${limits.amount.max}`,
      );
    }
  };

  /**
   * Calculate the target price and trigger validation.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const targetPricePercentageChange = (event) => {
    const draftPosition = getValues();
    const targetId = getGroupTargetId(event);
    const price = parseFloat(draftPosition.price);
    const targetPricePercentage = getTargetPropertyValue("targetPricePercentage", targetId);
    const targetPrice = price - (price * targetPricePercentage) / 100;
    validateTargetPriceLimits(
      targetPrice,
      composeTargetPropertyName("targetPricePercentage", targetId),
    );

    const units = parseFloat(draftPosition.units);
    const rebuyPercentage = getTargetPropertyValue("rebuyPercentage", targetId);
    const rebuyUnits = units * (rebuyPercentage / 100);
    const cost = Math.abs(targetPrice * rebuyUnits);

    validateCostLimits(cost, composeTargetPropertyName("targetPricePercentage", targetId));
  };

  /**
   * Calculate the target position size and trigger validation.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const rebuyPercentageChange = (event) => {
    const draftPosition = getValues();
    const targetId = getGroupTargetId(event);
    const units = parseFloat(draftPosition.units);
    const rebuyPercentage = getTargetPropertyValue("rebuyPercentage", targetId);
    const rebuyUnits = units * (rebuyPercentage / 100);
    validateUnitsLimits(rebuyUnits, composeTargetPropertyName("rebuyPercentage", targetId));

    const price = parseFloat(draftPosition.price);
    const targetPricePercentage = getTargetPropertyValue("targetPricePercentage", targetId);
    const targetPrice = price * (1 - targetPricePercentage / 100);
    const cost = Math.abs(targetPrice * rebuyUnits);
    validateCostLimits(cost, composeTargetPropertyName("rebuyPercentage", targetId));
  };

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

  const chainedPriceUpdates = () => {
    cardinalityRange.forEach((targetId) => {
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

  useEffect(chainedPriceUpdates, [entryType, cardinality, strategyPrice]);

  const chainedUnitsUpdates = () => {
    cardinalityRange.forEach((targetId) => {
      simulateInputChangeEvent(composeTargetPropertyName("rebuyPercentage", targetId));
    });
  };

  useEffect(chainedUnitsUpdates, [strategyPositionSize]);

  return (
    <Box className={`strategyPanel dcaPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {expandableControl}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.dca" />
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
                <HelperLabel descriptionId="terminal.dca.help" labelId="terminal.target" />
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    inputRef={register}
                    name={composeTargetPropertyName("targetPricePercentage", targetId)}
                    onChange={targetPricePercentageChange}
                  />
                  <div className="currencyBox">%</div>
                </Box>
                {displayTargetFieldErrors("targetPricePercentage", targetId)}
                <HelperLabel descriptionId="terminal.rebuy.help" labelId="terminal.rebuy" />
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    inputRef={register}
                    name={composeTargetPropertyName("rebuyPercentage", targetId)}
                    onChange={rebuyPercentageChange}
                  />
                  <div className="currencyBox">%</div>
                </Box>
              </Box>
              {displayTargetFieldErrors("rebuyPercentage", targetId)}
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

export default DCAPanel;
