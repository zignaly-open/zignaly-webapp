import { useIntl } from "react-intl";
import useExchangeList from "./useExchangeList";

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
  const { exchanges } = useExchangeList();
  let exchangeOptions = allOption
    ? [
        {
          val: "ALL",
          label: intl.formatMessage({ id: "fil.allexchanges" }),
        },
      ]
    : [];

  exchangeOptions = exchangeOptions.concat(
    exchanges &&
      exchanges.map(
        (item) =>
          item.enabled && {
            val: item.name.toLowerCase(),
            label: item.name,
          },
      ),
  );

  return exchangeOptions;
};

export default useExchangesOptions;
