import React, { useState, useEffect } from "react";
import "./StatsFilter.scss";
import { Box } from "@material-ui/core";
import useExchangesOptions from "../../../../../hooks/useExchangesOptions";
import CustomSelect from "../../../../CustomSelect";
import { useIntl } from "react-intl";
import useExchangeQuotes from "../../../../../hooks/useExchangeQuotes";
import useExchangeList from "../../../../../hooks/useExchangeList";
/**
 *
 * @typedef {import("../../../../../services/tradeApiClient.types").ProfileProviderStatsSignalsObject} ProfileProviderStatsSignalsObject
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<ProfileProviderStatsSignalsObject>} list
 * @property {Function} onChange
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSX Component.
 */
const StatsFilter = ({ list, onChange }) => {
  const { exchanges } = useExchangeList();
  const [exchange, setExchange] = useState("ALL");
  const [quote, setQuote] = useState("ALL");
  const intl = useIntl();
  const exchangeOptions = useExchangesOptions(true);
  const selectedBaseExchange =
    exchanges &&
    exchanges.find(
      (item) => item.name.toLowerCase() === (exchange === "ALL" ? "binance" : exchange),
    );
  const { quoteAssets } = useExchangeQuotes({
    exchangeId: selectedBaseExchange && selectedBaseExchange.id ? selectedBaseExchange.id : "",
    exchangeType:
      selectedBaseExchange && selectedBaseExchange.type ? selectedBaseExchange.type[0] : "",
  });
  const quotes = [
    {
      val: "ALL",
      label: intl.formatMessage({ id: "fil.allcoins" }),
    },
  ].concat(
    Object.keys(quoteAssets).map((label) => ({
      val: label,
      label,
    })),
  );

  const filterData = () => {
    let newList = [...list].filter(
      (item) =>
        (!quote || quote === "ALL" || item.quote === quote) &&
        (!exchange || exchange === "ALL" || item.exchange.toLowerCase() === exchange.toLowerCase()),
    );
    onChange(newList);
  };

  useEffect(filterData, [exchange, quote]);

  return (
    <Box alignItems="center" className="statsFilter" display="flex" flexDirection="row">
      <CustomSelect
        onChange={(/** @type {string} */ v) => setExchange(v)}
        options={exchangeOptions}
        value={exchange}
      />
      <CustomSelect
        onChange={(/** @type {import("../../../../CustomSelect/CustomSelect").OptionType} */ v) =>
          // @ts-ignore
          setQuote(v.val)
        }
        options={quotes}
        search={true}
        value={quote}
      />
    </Box>
  );
};

export default StatsFilter;
