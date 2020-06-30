import { useFormContext } from "react-hook-form";

/**
 * @typedef {import("../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 */

/**
 * @typedef {Object} SymbolLimitsValidateHook
 * @property {function} validateCostLimits
 * @property {function} validateTargetPriceLimits
 * @property {function} validateUnitsLimits
 */

/**
 * Hook that provides symbol data limits validations.
 *
 * @param {MarketSymbol} symbolData Market symbol data object.
 * @returns {SymbolLimitsValidateHook} Symbol limits hook.
 */
const useSymbolLimitsValidate = (symbolData) => {
  const { limits } = symbolData;
  const { clearError, setError } = useFormContext();

  /**
   * Validate that target price is within limits.
   *
   * @param {number} targetPrice Rebuy target price.
   * @param {string} propertyName Property name that validation error attachs to.
   * @returns {Void} None.
   */
  const validateTargetPriceLimits = (targetPrice, propertyName) => {
    clearError(propertyName);
    if (limits.price.min && targetPrice < limits.price.min) {
      setError(propertyName, "error", `Target price cannot be lower than ${limits.price.min}`);
    }

    if (limits.price.max && targetPrice > limits.price.max) {
      setError(propertyName, "error", `Target price cannot be greater than ${limits.price.max}`);
    }
  };

  /**
   * Validate that cost is within limits.
   *
   * @param {number} cost Cost amount.
   * @param {string} propertyName Property name that validation error attachs to.
   * @returns {Void} None.
   */
  const validateCostLimits = (cost, propertyName) => {
    if (!isNaN(cost)) {
      if (limits.cost.min && cost < limits.cost.min) {
        setError(propertyName, "error", `Target cost cannot be lower than ${limits.cost.min}`);
      }

      if (limits.cost.max && cost > limits.cost.max) {
        setError(propertyName, "error", `Target cost cannot be greater than ${limits.cost.max}`);
      }
    }
  };

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
        `Target units to exit cannot be lower than ${limits.amount.min}`,
      );
    }

    if (limits.amount.max && units > limits.amount.max) {
      setError(
        propertyName,
        "error",
        `Target units to exit cannot be greater than ${limits.amount.max}`,
      );
    }
  };

  return {
    validateCostLimits,
    validateTargetPriceLimits,
    validateUnitsLimits,
  };
};

export default useSymbolLimitsValidate;
