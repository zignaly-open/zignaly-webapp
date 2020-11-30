/**
 *
 * @typedef {import("../services/tradeApiClient.types").ExchangeListEntity} ExchangeListEntity
 * @typedef {import("../services/tradeApiClient.types").ProviderExchangeSettingsObject} ProviderExchangeSettingsObject
 * @typedef {import("../services/tradeApiClient.types").QuoteAssetsDict} QuoteAssetsDict
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

/**
 * Check if user has allocated balance to any quote inside settings.
 *
 * @param {QuoteAssetsDict} quotesList Exchange quotes.
 * @param {ProviderExchangeSettingsObject} settingsData Provider settings object.
 * @param {React.SetStateAction<*>} callback callback.
 *
 * @returns {void}
 */
export const checkAllocated = (quotesList, settingsData, callback) => {
  const someValuesAllocated = Object.keys(quotesList).some((item) => {
    const settingsKey = "positionSize" + item + "Value";
    // @ts-ignore
    return settingsData[settingsKey] > 0;
  });
  callback(someValuesAllocated);
};
