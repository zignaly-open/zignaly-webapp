import { useIntl } from "react-intl";

/**
 * @typedef {import("services/tradeApiClient.types").MarketSymbol} MarketSymbol
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
  const { limits, contractType } = symbolData;
  const { formatMessage } = useIntl();

  /**
   * Validate that target price is within limits.
   *
   * @param {number} targetPrice Rebuy target price.
   * @param {string} errorMessageGroup Error message translation group ID.
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  const validateTargetPriceLimits = (targetPrice, errorMessageGroup) => {
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
    const limitsAmount = contractType === "inverse" ? limits.cost : limits.amount;

    // Skip validation when data not available.
    if (!limitsAmount) {
      return true;
    }

    if (limitsAmount.min && amount < limitsAmount.min) {
      return formatMessage({ id: errorMessageGroup + ".minunits" }, { value: limitsAmount.min });
    }

    if (limitsAmount.max && amount > limitsAmount.max) {
      return formatMessage({ id: errorMessageGroup + ".maxunits" }, { value: limitsAmount.max });
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
  const validateCostLimits = (cost, errorMessageGroup) => {
    const limitsCost = contractType === "inverse" ? limits.amount : limits.cost;

    // Skip validation when data not available.
    if (!limitsCost) {
      return true;
    }

    if (limitsCost.min && cost < limitsCost.min) {
      return formatMessage({ id: errorMessageGroup + ".mincost" }, { value: limitsCost.min });
    }

    if (limitsCost.max && cost > limitsCost.max) {
      return formatMessage({ id: errorMessageGroup + ".maxcost" }, { value: limitsCost.max });
    }

    return true;
  };

  return {
    validateCostLimits,
    validateUnitsLimits,
    validateTargetPriceLimits,
  };
};

export default useSymbolLimitsValidate;
