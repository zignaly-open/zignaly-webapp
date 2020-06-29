import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { simulateInputChangeEvent } from "../utils/events";

/**
 * @typedef {import("../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("react-hook-form").Validate} Validate
 */

/**
 * @typedef {Object} PositionSizeHandlersHook
 * @property {React.ChangeEventHandler} positionSizeChange
 * @property {React.ChangeEventHandler} priceChange
 * @property {React.ChangeEventHandler} realInvestmentChange
 * @property {React.ChangeEventHandler} unitsChange
 * @property {Validate} validatePositionSize
 * @property {Validate} validatePrice
 * @property {Validate} validateUnits
 */

/**
 * Trading terminal position size handlers.
 *
 * @param {MarketSymbol} selectedSymbol Exchange market symbol data.
 * @param {number} defaultLeverage Current leverage.
 *
 * @returns {PositionSizeHandlersHook} Position handlers hook object.
 */
const usePositionSizeHandlers = (selectedSymbol, defaultLeverage = null) => {
  const { limits } = selectedSymbol;
  const { clearError, getValues, setError, setValue, watch } = useFormContext();
  const leverage = defaultLeverage || watch("leverage");
  const entryType = watch("entryType");

  /**
   * Validate that position size is within limits.
   *
   * @param {any} positionSize Position size value.
   * @returns {boolean} Validation result.
   */
  function validatePositionSize(positionSize) {
    const value = parseFloat(positionSize);

    clearError("positionSize");
    if (isNaN(value)) {
      setError("positionSize", "error", "Position size must be a numeric value.");
      return false;
    }

    if (limits.cost.min && value < limits.cost.min) {
      setError("positionSize", "error", `Position size cannot be lower than ${limits.cost.min}`);
      return false;
    }

    if (limits.cost.max && value > limits.cost.max) {
      setError("positionSize", "error", `Position size cannot be greater than ${limits.cost.max}`);
      return false;
    }

    return true;
  }

  /**
   * Validate that units is within limits.
   *
   * @param {any} units Units value.
   * @returns {boolean} Validation result.
   */
  function validateUnits(units) {
    const value = parseFloat(units);

    clearError("units");
    if (isNaN(value)) {
      setError("units", "error", "Position size must be a numeric value.");
      return false;
    }

    if (limits.amount.min && value < limits.amount.min) {
      setError("units", "error", `Units cannot be lower than ${limits.amount.min}`);
      return false;
    }

    if (limits.amount.max && value > limits.amount.max) {
      setError("units", "error", `Units cannot be greater than ${limits.amount.max}`);
      return false;
    }

    return true;
  }

  /**
   * Validate that price is within limits.
   *
   * @param {number} price Price value.
   * @returns {boolean} Validation result.
   */
  function validatePrice(price) {
    clearError("price");
    if (limits.price.min && price < limits.price.min) {
      setError("price", "error", `Price cannot be lower than ${limits.price.min}`);
      return false;
    }

    if (limits.price.max && price > limits.price.max) {
      setError("price", "error", `Price cannot be greater than ${limits.price.max}`);
      return false;
    }

    return true;
  }

  const realInvestmentChange = () => {
    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.realInvestment) * leverage;
    setValue("positionSize", positionSize);
    validatePositionSize(positionSize);

    const price = parseFloat(draftPosition.price);
    const units = positionSize / price;
    setValue("units", units.toFixed(8));
    validateUnits(units);
  };

  const positionSizeChange = () => {
    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.positionSize);
    validatePositionSize(positionSize);

    const price = parseFloat(draftPosition.price);
    const units = positionSize / price;
    setValue("units", units.toFixed(8));
    validateUnits(units);

    const realInvestment = parseFloat(draftPosition.positionSize) / leverage;
    setValue("realInvestment", realInvestment.toFixed(8));
  };

  const unitsChange = () => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price);
    const units = parseFloat(draftPosition.units);
    validateUnits(units);

    const positionSize = units * price;
    setValue("positionSize", positionSize.toFixed(8));
    validatePositionSize(positionSize);

    const realInvestment = positionSize / leverage;
    setValue("realInvestment", realInvestment.toFixed(8));
  };

  const priceChange = () => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price);
    validatePrice(price);
  };

  const chainedPriceUpdates = () => {
    simulateInputChangeEvent("realInvestment");
  };

  useEffect(chainedPriceUpdates, [entryType, leverage]);

  return {
    positionSizeChange,
    priceChange,
    realInvestmentChange,
    unitsChange,
    validatePositionSize,
    validatePrice,
    validateUnits,
  };
};

export default usePositionSizeHandlers;
