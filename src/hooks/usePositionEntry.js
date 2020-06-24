import React from "react";
import { useFormContext } from "react-hook-form";

/**
 * @typedef {import("../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 */

/**
 * @typedef {Object} PositionEntryHook
 * @property {function} getEntryPrice
 * @property {function} getEntrySize
 */

/**
 * Provides dynamic resolution of position entry price.
 *
 * The entry price resolves as follows:
 * - From buyPrice on existing position.
 * - From strategy price input or latest symbol market price in new positions.
 *
 * @param {PositionEntity} positionEntity Position entity.
 * @param {CoinRayCandle} lastPriceCandle Coinray price candle.
 * @returns {PositionEntryHook} Position entry hook object.
 */
function usePositionEntry(positionEntity, lastPriceCandle) {
  const { getValues } = useFormContext();

  /**
   * Resolve position entry price for new or existing position.
   *
   * @returns {number} Entry price.
   */
  const getEntryPrice = () => {
    if (positionEntity) {
      return positionEntity.buyPrice;
    }

    const draftPosition = getValues();

    return parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);
  };

  /**
   * Resolve position entry size for new or existing position.
   *
   * @returns {number} Entry price.
   */
  const getEntrySize = () => {
    if (positionEntity) {
      return parseFloat(positionEntity.positionSize);
    }

    const draftPosition = getValues();

    return parseFloat(draftPosition.units) || 0;
  };

  return { getEntryPrice, getEntrySize };
}

export default usePositionEntry;
