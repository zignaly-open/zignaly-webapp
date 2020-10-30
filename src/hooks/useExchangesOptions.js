import { useIntl } from "react-intl";

/**
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 */

/**
 * Provides exchanges options.
 * @param {boolean} allOption Flag to indicate wether to add All Exchanges option.
 * @returns {Array<OptionType>} Exchanges
 */
const useExchangesOptions = (allOption) => {
  const intl = useIntl();
  let exchanges = allOption
    ? [
        {
          val: "ALL",
          label: intl.formatMessage({ id: "fil.allexchanges" }),
        },
      ]
    : [];

  exchanges = exchanges.concat(
    ["Binance", "Zignaly", "BitMEX", "KuCoin"].map((label) => ({
      val: label.toLowerCase(),
      label,
    })),
  );

  return exchanges;
};

export default useExchangesOptions;
