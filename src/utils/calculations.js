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
