import { useEffect, useCallback, useContext } from "react";
import { useFormContext } from "react-hook-form";
import { simulateInputChangeEvent } from "../utils/events";
import { useIntl } from "react-intl";
import TradingViewContext from "components/TradingTerminal/TradingView/TradingViewContext";

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
  const { limits, contractType } = selectedSymbol;
  const multiplier = selectedSymbol.multiplier || 1;
  const { errors, getValues, setValue, watch, trigger } = useFormContext();
  const leverage = watch("leverage", defaultLeverage);
  const entryType = watch("entryType");
  const entryStrategy = watch("entryStrategy");
  const { lastPrice, providerService } = useContext(TradingViewContext);
  const strategyPrice = watch("price");
  const currentPrice = parseFloat(strategyPrice) || lastPrice;
  // Short price for 'multi' strategy
  let currentPriceShort = 0;
  if (entryStrategy === "multi") {
    const strategyPriceShort = watch("priceShort");
    currentPriceShort = parseFloat(strategyPriceShort) || lastPrice;
  }
  const providerAllocatedBalance = providerService ? providerService.providerPayableBalance : 0;
  const { formatMessage } = useIntl();

  /**
   * Validate that position size is within limits.
   *
   * @param {any} positionSize Position size value.
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  function validatePositionSize(positionSize) {
    const value = parseFloat(positionSize);
    const limitsCost = contractType === "inverse" ? limits.amount : limits.cost;

    if (limitsCost.min && value < limitsCost.min) {
      return formatMessage({ id: "terminal.positionsize.limit.min" }, { value: limitsCost.min });
    }

    if (limitsCost.max && value > limitsCost.max) {
      return formatMessage({ id: "terminal.positionsize.limit.max" }, { value: limitsCost.max });
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
    const limitsAmount = contractType === "inverse" ? limits.cost : limits.amount;

    if (limitsAmount.min && value < limitsAmount.min) {
      return formatMessage({ id: "terminal.positionunits.limit.min" }, { value: limitsAmount.min });
    }

    if (limitsAmount.max && value > limitsAmount.max) {
      return formatMessage({ id: "terminal.positionunits.limit.max" }, { value: limitsAmount.max });
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

  /**
   * @param {number} positionSize positionSize
   * @param {number} price price
   * @returns {number} units
   */
  const calculateUnits = (positionSize, price) => {
    if (contractType === "inverse") {
      return (price * positionSize) / multiplier;
    }
    return positionSize / (price * multiplier);
  };

  const realInvestmentChange = useCallback(() => {
    if (errors.realInvestment) return;

    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.realInvestment) * leverage;
    setValue("positionSize", positionSize);
    trigger("positionSize").then((isValid) => {
      if (isValid) {
        updateUnits(positionSize);
        trigger("units");
      }
    });
  }, [errors, currentPrice, leverage, getValues, multiplier, entryStrategy, currentPriceShort]);

  /**
   * @param {number} positionSize .
   * @returns {void}
   */
  const updateUnits = (positionSize) => {
    const units = calculateUnits(positionSize, currentPrice);
    setValue("units", units.toFixed(8));

    if (entryStrategy === "multi") {
      const unitsShort = calculateUnits(positionSize, currentPriceShort);
      setValue("unitsShort", unitsShort.toFixed(8));
    }
  };

  const positionSizeChange = useCallback(() => {
    if (errors.positionSize) return;

    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.positionSize);

    updateUnits(positionSize);
    trigger("units").then((isValid) => {
      if (isValid) {
        const realInvestment = parseFloat(draftPosition.positionSize) / leverage;
        setValue("realInvestment", realInvestment.toFixed(8));
      }
    });
  }, [
    errors,
    currentPrice,
    getValues,
    setValue,
    trigger,
    leverage,
    multiplier,
    entryStrategy,
    currentPriceShort,
  ]);

  const positionSizePercentageChange = useCallback(() => {
    if (errors.positionSizePercentage) return;

    const draftPosition = getValues();
    const positionSizePercentage = parseFloat(draftPosition.positionSizePercentage);

    const positionSize = (positionSizePercentage * providerAllocatedBalance) / 100;
    setValue("positionSizeAllocated", positionSize.toFixed(8));
  }, [errors, getValues, setValue, providerAllocatedBalance]);

  const unitsChange = () => {
    const draftPosition = getValues();
    const units = parseFloat(draftPosition.units);
    if (isNaN(units)) return;

    let positionSize = units * currentPrice;
    if (selectedSymbol.contractType === "inverse") {
      positionSize = (units / currentPrice) * selectedSymbol.multiplier;
    } else if (
      selectedSymbol.contractType === "quanto" ||
      selectedSymbol.contractType === "linear"
    ) {
      positionSize *= selectedSymbol.multiplier;
    }

    setValue("positionSize", positionSize.toFixed(8));
    trigger("positionSize").then((isValid) => {
      if (isValid) {
        const realInvestment = positionSize / leverage;
        setValue("realInvestment", realInvestment.toFixed(8));
      }
    });
  };

  const priceChange = () => {
    const draftPosition = getValues();
    if (parseFloat(draftPosition.positionSize) > 0) {
      simulateInputChangeEvent("positionSize");
    }
  };

  // Trigger position size recalculation on leverage/entryType change
  useEffect(() => {
    simulateInputChangeEvent("realInvestment");
  }, [entryType, leverage]);

  return {
    positionSizeChange,
    positionSizePercentageChange,
    priceChange,
    realInvestmentChange,
    unitsChange,
    validatePositionSize,
    validatePrice,
    validateUnits,
  };
};

export default usePositionSizeHandlers;
