/**
 * Calculate DCA target price for a DCA percentage.
 *
 * @param {number} price Current quote price.
 * @param {number} dcaPercentage DCA target percentage.
 * @returns {number} DCA target price.
 */
export const calculateDcaPrice = (price, dcaPercentage) => {
  return price + (price * dcaPercentage) / 100;
};

/**
 * @typedef {import("services/coinRayDataFeed").MarketSymbol} MarketSymbol
 */

/**
 * @param {number} positionSize positionSize
 * @param {number} price price
 * @param {MarketSymbol} symbol Exchange market symbol data.
 * @returns {number} units
 */
export const calculateUnits = (positionSize, price, symbol) => {
  const { contractType, multiplier = 1 } = symbol;
  if (contractType === "inverse") {
    return (price * positionSize) / multiplier;
  }
  return positionSize / (price * multiplier);
};
