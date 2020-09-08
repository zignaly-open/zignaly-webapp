import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 */

/**
 * @typedef {Object} SymbolLimitsValidateHook
 * @property {function} validateCostLimits
 * @property {function} validateTargetPriceLimits
 * @property {function} validateTargetPriceLimits2
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
  const { setError } = useFormContext();
  const { formatMessage } = useIntl();

  /**
   * Validate that target price is within limits.
   *
   * @param {number} targetPrice Rebuy target price.
   * @param {string} errorMessageGroup Error message translation group ID.
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  const validateTargetPriceLimits2 = (targetPrice, errorMessageGroup) => {
    // Skip validation when data not available.
    if (!limits.price) {
      return true;
    }

    if (limits.price.min && targetPrice < limits.price.min) {
      return formatMessage({ id: errorMessageGroup + ".minprice" }, { value: limits.price.min });
    }

    if (limits.price.max && targetPrice > limits.price.max) {
      return formatMessage({ id: errorMessageGroup + ".maxprice" }, { value: limits.price.max });
    }

    return true;
  };

  /**
   * Validate that target units is within limits.
   *
   * @param {number} amount target units.
   * @param {string} errorMessageGroup Error message translation group ID.
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  const validateUnitsLimits = (amount, errorMessageGroup) => {
    // Skip validation when data not available.
    if (!limits.amount) {
      return true;
    }

    if (limits.amount.min && amount < limits.amount.min) {
      return formatMessage({ id: errorMessageGroup + ".minunits" }, { value: limits.amount.min });
    }

    if (limits.amount.max && amount > limits.amount.max) {
      return formatMessage({ id: errorMessageGroup + ".maxunits" }, { value: limits.amount.max });
    }

    return true;
  };

  /**
   * Validate that target cost is within limits.
   *
   * @param {number} cost Cost amount.
   * @param {string} errorMessageGroup Error message translation group ID.
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  const validateCostLimits2 = (cost, errorMessageGroup) => {
    // Skip validation when data not available.
    if (!limits.cost) {
      return true;
    }

    if (limits.cost.min && cost < limits.cost.min) {
      return formatMessage({ id: errorMessageGroup + ".mincost" }, { value: limits.cost.min });
    }

    if (limits.cost.max && cost > limits.cost.max) {
      return formatMessage({ id: errorMessageGroup + ".maxcost" }, { value: limits.cost.max });
    }

    return true;
  };

  /**
   * Validate that target price is within limits.
   *
   * @param {number} targetPrice Rebuy target price.
   * @param {string} propertyName Property name that validation error attachs to.
   * @param {string} errorMessageGroup Error message translation group ID.
   * @returns {boolean} true if validation pass, false otherwise.
   */
  const validateTargetPriceLimits = (targetPrice, propertyName, errorMessageGroup) => {
    // Skip validation when data not available.
    if (!limits.price) {
      return true;
    }

    if (limits.price.min && targetPrice < limits.price.min) {
      setError(propertyName, {
        type: "manual",
        message: formatMessage(
          { id: errorMessageGroup + ".minprice" },
          { value: limits.price.min },
        ),
      });
      return false;
    }

    if (limits.price.max && targetPrice > limits.price.max) {
      setError(propertyName, {
        type: "manual",
        message: formatMessage(
          { id: errorMessageGroup + ".maxprice" },
          { value: limits.price.max },
        ),
      });
      return false;
    }

    return true;
  };

  /**
   * Validate that cost is within limits.
   *
   * @param {number} cost Cost amount.
   * @param {string} propertyName Property name that validation error attachs to.
   * @param {string} errorMessageGroup Error message translation group ID.
   * @returns {boolean} true if validation pass, false otherwise.
   */
  const validateCostLimits = (cost, propertyName, errorMessageGroup) => {
    if (!limits.cost) {
      return true;
    }

    if (!isNaN(cost)) {
      if (limits.cost.min && cost < limits.cost.min) {
        setError(propertyName, {
          type: "manual",
          message: formatMessage(
            { id: errorMessageGroup + ".mincost" },
            { value: limits.cost.min },
          ),
        });
        return false;
      }

      if (limits.cost.max && cost > limits.cost.max) {
        setError(propertyName, {
          type: "manual",
          message: formatMessage(
            { id: errorMessageGroup + ".maxcost" },
            { value: limits.cost.max },
          ),
        });
        return false;
      }
    }

    return true;
  };

  return {
    validateCostLimits,
    validateCostLimits2,
    validateUnitsLimits,
    validateTargetPriceLimits,
    validateTargetPriceLimits2,
  };
};

export default useSymbolLimitsValidate;
