import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { simulateInputChangeEvent } from "../utils/events";
import { isValidIntOrFloat } from "../utils/validators";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("react-hook-form/dist/types/form").Validate} Validate
 */

/**
 * @typedef {Object} PositionSizeHandlersHook
 * @property {React.ChangeEventHandler} positionSizeChange
 * @property {React.ChangeEventHandler} positionSizePercentageChange
 * @property {React.ChangeEventHandler} priceChange
 * @property {React.ChangeEventHandler} realInvestmentChange
 * @property {React.ChangeEventHandler} unitsChange
 * @property {Validate} validatePositionSize
 * @property {Validate} validatePositionSizePercentage
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
  const { errors, clearErrors, getValues, setError, setValue, watch } = useFormContext();
  const leverage = defaultLeverage || watch("leverage");
  const entryType = watch("entryType");
  const lastPrice = watch("lastPrice");
  const strategyPrice = watch("price");
  const currentPrice = parseFloat(strategyPrice) || parseFloat(lastPrice);
  const { formatMessage } = useIntl();

  /**
   * Validate that position size is within limits.
   *
   * @param {any} positionSize Position size value.
   * @returns {boolean} Validation result.
   */
  function validatePositionSize(positionSize) {
    const value = parseFloat(positionSize);

    if (!isValidIntOrFloat(positionSize)) {
      setError("positionSize", {
        type: "manual",
        message: formatMessage({ id: "terminal.positionsize.limit.zero" }),
      });
      return false;
    }

    if (limits.cost.min && value < limits.cost.min) {
      setError("positionSize", {
        type: "manual",
        message: formatMessage(
          { id: "terminal.positionsize.limit.min" },
          { value: limits.cost.min },
        ),
      });
      return false;
    }

    if (limits.cost.max && value > limits.cost.max) {
      setError("positionSize", {
        type: "manual",
        message: formatMessage(
          { id: "terminal.positionsize.limit.max" },
          { value: limits.cost.max },
        ),
      });
      return false;
    }

    if (errors.positionSize) {
      clearErrors("positionSize");
    }

    return true;
  }

  /**
   * Validate that position size percentage.
   *
   * @param {any} positionSizePercentage Position size value.
   * @returns {boolean} Validation result.
   */
  function validatePositionSizePercentage(positionSizePercentage) {
    if (!isValidIntOrFloat(positionSizePercentage)) {
      setError("positionSizePercentage", {
        type: "manual",
        message: formatMessage({ id: "terminal.positionsize.valid.percentage" }),
      });
      return false;
    }

    if (errors.positionsSizePercentage) {
      clearErrors("positionSizePercentage");
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

    if (!isValidIntOrFloat(units)) {
      setError("units", {
        type: "manual",
        message: formatMessage({ id: "terminal.positionunits.limit.zero" }),
      });
      return false;
    }

    if (limits.amount.min && value < limits.amount.min) {
      setError("units", {
        type: "manual",
        message: formatMessage(
          { id: "terminal.positionunits.limit.min" },
          { value: limits.amount.min },
        ),
      });
      return false;
    }

    if (limits.amount.max && value > limits.amount.max) {
      setError("units", {
        type: "manual",
        message: formatMessage(
          { id: "terminal.positionunits.limit.max" },
          { value: limits.amount.max },
        ),
      });
      return false;
    }

    if (errors.units) {
      clearErrors("units");
    }

    return true;
  }

  /**
   * Validate that price is within limits.
   *
   * @param {any} price Price value.
   * @returns {boolean} Validation result.
   */
  function validatePrice(price) {
    const value = parseFloat(price);

    if (!isValidIntOrFloat(price)) {
      setError("price", {
        type: "manual",
        message: formatMessage({ id: "terminal.positionprice.limit.zero" }),
      });
      return false;
    }

    if (limits.price.min && value < limits.price.min) {
      setError("price", {
        type: "manual",
        message: formatMessage(
          { id: "terminal.positionprice.limit.min" },
          { value: limits.price.min },
        ),
      });
      return false;
    }

    if (limits.price.max && value > limits.price.max) {
      setError("price", {
        type: "manual",
        message: formatMessage(
          { id: "terminal.positionprice.limit.max" },
          { value: limits.price.max },
        ),
      });
      return false;
    }

    if (errors.price) {
      clearErrors("price");
    }

    return true;
  }

  const realInvestmentChange = () => {
    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.realInvestment) * leverage;
    setValue("positionSize", positionSize);
    validatePositionSize(positionSize);

    const units = positionSize / currentPrice;
    setValue("units", units.toFixed(8));
    validateUnits(units);
  };

  const positionSizeChange = () => {
    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.positionSize);
    validatePositionSize(draftPosition.positionSize);

    const units = positionSize / currentPrice;
    setValue("units", units.toFixed(8));
    validateUnits(units);

    const realInvestment = parseFloat(draftPosition.positionSize) / leverage;
    setValue("realInvestment", realInvestment.toFixed(8));
  };

  const positionSizePercentageChange = () => {
    const draftPosition = getValues();
    validatePositionSizePercentage(draftPosition.positionSizePercentage);
  };

  const unitsChange = () => {
    const draftPosition = getValues();
    const units = parseFloat(draftPosition.units);
    validateUnits(draftPosition.units);

    const positionSize = units * currentPrice;
    setValue("positionSize", positionSize.toFixed(8));
    validatePositionSize(positionSize);

    const realInvestment = positionSize / leverage;
    setValue("realInvestment", realInvestment.toFixed(8));
  };

  const priceChange = () => {
    validatePrice(strategyPrice);
    const draftPosition = getValues();
    if (parseFloat(draftPosition.positionSize) > 0) {
      simulateInputChangeEvent("positionSize");
    }
  };

  const chainedPriceUpdates = () => {
    simulateInputChangeEvent("realInvestment");
  };

  useEffect(chainedPriceUpdates, [entryType, leverage]);

  return {
    positionSizeChange,
    positionSizePercentageChange,
    priceChange,
    realInvestmentChange,
    unitsChange,
    validatePositionSize,
    validatePositionSizePercentage,
    validatePrice,
    validateUnits,
  };
};

export default usePositionSizeHandlers;
