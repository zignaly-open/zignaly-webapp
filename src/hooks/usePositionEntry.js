import React from "react";
import { useFormContext } from "react-hook-form";

/**
 * @typedef {import("../services/tradeApiClient.types").PositionEntity} PositionEntity
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
 * - From strategy price input in new positions.
 *
 * @param {PositionEntity} positionEntity Position entity.
 * @returns {PositionEntryHook} Position entry hook object.
 */
function usePositionEntry(positionEntity) {
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

    return parseFloat(draftPosition.price);
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
