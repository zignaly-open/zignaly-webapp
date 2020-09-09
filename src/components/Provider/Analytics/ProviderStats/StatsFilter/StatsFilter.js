import React, { useState, useEffect } from "react";
import "./StatsFilter.scss";
import { Box } from "@material-ui/core";
import useQuoteAssets from "../../../../../hooks/useQuoteAssets";
import useExchangesOptions from "../../../../../hooks/useExchangesOptions";
import CustomSelect from "../../../../CustomSelect";
import { useIntl } from "react-intl";
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
  const [exchange, setExchange] = useState("ALL");
  const [quote, setQuote] = useState("ALL");
  const intl = useIntl();
  const exchanges = useExchangesOptions(true);
  const quoteAssets = useQuoteAssets();
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
        options={exchanges}
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
