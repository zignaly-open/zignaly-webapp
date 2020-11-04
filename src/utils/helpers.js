/**
 *
 * @typedef {import("../services/tradeApiClient.types").ExchangeListEntity} ExchangeListEntity
 */

/**
 *
 * @param {Array<ExchangeListEntity>} allExchanges all exchanges.
 * @param {String} seperator name sepearator
 *
 * @returns {String} exchange names combined.
 */
export const getExchangeNamesCombined = (allExchanges, seperator) => {
  let names = "";
  if (allExchanges) {
    const list = allExchanges.filter((e) => e.enabled && e.name.toLowerCase() !== "zignaly");
    list.forEach((item, index) => {
      names += `${item.name}`;
      if (index !== list.length - 1) {
        names += ` ${seperator} `;
      }
    });
  }
  return names;
};
