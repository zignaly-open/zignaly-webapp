import { useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { simulateInputChangeEvent } from "../utils/events";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("react-hook-form/dist/types/form").Validate} Validate
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
  const { errors, getValues, setValue, watch, trigger } = useFormContext();
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
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  function validatePositionSize(positionSize) {
    const value = parseFloat(positionSize);

    if (limits.cost.min && value < limits.cost.min) {
      return formatMessage({ id: "terminal.positionsize.limit.min" }, { value: limits.cost.min });
    }

    if (limits.cost.max && value > limits.cost.max) {
      return formatMessage({ id: "terminal.positionsize.limit.max" }, { value: limits.cost.max });
    }

    if (!(value > 0)) {
      return formatMessage({ id: "terminal.positionsize.limit.zero" });
    }

    return true;
  }

  /**
   * Validate that units is within limits.
   *
   * @param {any} units Units value.
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  function validateUnits(units) {
    const value = parseFloat(units);

    if (limits.amount.min && value < limits.amount.min) {
      return formatMessage(
        { id: "terminal.positionunits.limit.min" },
        { value: limits.amount.min },
      );
    }

    if (limits.amount.max && value > limits.amount.max) {
      return formatMessage(
        { id: "terminal.positionunits.limit.max" },
        { value: limits.amount.max },
      );
    }

    if (isNaN(units)) {
      return formatMessage({ id: "terminal.positionsize.limit.zero" });
    }

    return true;
  }

  /**
   * Validate that price is within limits.
   *
   * @param {any} price Price value.
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  function validatePrice(price) {
    const value = parseFloat(price);

    if (limits.price.min && value < limits.price.min) {
      return formatMessage({ id: "terminal.positionprice.limit.min" }, { value: limits.price.min });
    }

    if (limits.price.max && value > limits.price.max) {
      return formatMessage({ id: "terminal.positionprice.limit.max" }, { value: limits.price.max });
    }

    if (!(value > 0)) {
      return formatMessage({ id: "terminal.positionprice.limit.zero" });
    }

    return true;
  }

  const realInvestmentChange = useCallback(() => {
    if (errors.realInvestment) return;

    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.realInvestment) * leverage;
    setValue("positionSize", positionSize);
    trigger("positionSize").then((isValid) => {
      if (isValid) {
        const units = positionSize / currentPrice;
        setValue("units", units.toFixed(8));
        trigger("units");
      }
    });
  }, [errors, currentPrice]);

  const positionSizeChange = useCallback(() => {
    if (errors.positionSize) return;

    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.positionSize);

    const units = positionSize / currentPrice;
    setValue("units", units.toFixed(8));
    trigger("units").then((isValid) => {
      if (isValid) {
        const realInvestment = parseFloat(draftPosition.positionSize) / leverage;
        setValue("realInvestment", realInvestment.toFixed(8));
      }
    });
  }, [errors, currentPrice, getValues, leverage, setValue, trigger]);

  const unitsChange = () => {
    const draftPosition = getValues();
    const units = parseFloat(draftPosition.units);
    if (isNaN(units)) return;

    const positionSize = units * currentPrice;
    setValue("positionSize", positionSize.toFixed(8));
    trigger("positionSize").then((isValid) => {
      if (isValid) {
        const realInvestment = positionSize / leverage;
        setValue("realInvestment", realInvestment.toFixed(8));
      }
    });
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
    priceChange,
    realInvestmentChange,
    unitsChange,
    validatePositionSize,
    validatePrice,
    validateUnits,
  };
};

export default usePositionSizeHandlers;
