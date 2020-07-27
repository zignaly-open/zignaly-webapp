import { useFormContext } from "react-hook-form";

/**
 * @typedef {import("../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} PositionEntryHook
 * @property {function} getEntryPrice
 * @property {function} getEntrySize
 * @property {function} getEntrySizeQuote
 * @property {function} getEntryPricePercentChange
 */

/**
 * Provides dynamic resolution of position entry price.
 *
 * The entry price resolves as follows:
 * - From buyPrice on existing position.
 * - From strategy price input in new positions.
 *
 * @param {PositionEntity} positionEntity Position entity.
 * @returns {PositionEntryHook} Position entry hook object.
 */
function usePositionEntry(positionEntity) {
  const { watch } = useFormContext();
  const lastPrice = watch("lastPrice");
  const strategyPrice = watch("price");
  const positionSize = watch("positionSize");
  const units = watch("units");
  const currentPrice = parseFloat(strategyPrice) || parseFloat(lastPrice);

  /**
   * Resolve position entry price for new or existing position.
   *
   * @returns {number} Entry price.
   */
  const getEntryPrice = () => {
    if (positionEntity) {
      return positionEntity.buyPrice;
    }

    return currentPrice;
  };

  /**
   * Calculate price percent change from existing position.
   *
   * @returns {number} Price percentage change form entry price.
   */
  const getEntryPricePercentChange = () => {
    if (positionEntity && positionEntity.buyPrice > 0 && lastPrice > 0) {
      const { buyPrice } = positionEntity;
      const percentChange = (1 - buyPrice / lastPrice) * 100;
      return percentChange;
    }

    // Not known yet.
    return 0;
  };

  /**
   * Resolve position entry size (base) for new or existing position.
   *
   * @returns {number} Base entry size.
   */
  const getEntrySize = () => {
    if (positionEntity) {
      return positionEntity.amount;
    }

    return parseFloat(units) || 0;
  };

  /**
   * Resolve position entry size (quote) for new or existing position.
   *
   * @returns {number} Quote entry size.
   */
  const getEntrySizeQuote = () => {
    if (positionEntity) {
      return positionEntity.positionSizeQuote;
    }

    return parseFloat(positionSize) || 0;
  };

  return { getEntryPrice, getEntryPricePercentChange, getEntrySize, getEntrySizeQuote };
}

export default usePositionEntry;
