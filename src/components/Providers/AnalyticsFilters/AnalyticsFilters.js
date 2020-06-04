import React from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import useQuoteAssets from "../../../hooks/useQuoteAssets";
import useBaseAssets from "../../../hooks/useBaseAssets";
import useTimeFramesOptions from "../../../hooks/useTimeFramesOptions";
import { useIntl } from "react-intl";

/**
 * @typedef {Object} ProvidersFiltersPropTypes
 * @property {React.MouseEventHandler} onClose Callback that delegate filters toggle state to caller.
 * @property {React.MouseEventHandler} clearFilters Callback that delegate filters clearing to caller.
 * @property {function} onCoinChange Callback that delegate coin change to caller.
 * @property {function} onExchangeChange Callback that delegate exchange change to caller.
 * @property {string} coin Selected coin.
 * @property {string} exchange Selected exchange.
 */

/**
 * Provides filters for filtering providers.
 *
 * @param {ProvidersFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const AnalyticsFilters = ({
  base,
  pair,
  timeFrame,
  onBaseChange,
  onPairChange,
  onTimeFrameChange,
  clearFilters,
}) => {
  const quoteAssets = useQuoteAssets();
  const baseAssets = useBaseAssets(base);
  const timeFramesOptions = useTimeFramesOptions();
  const bases = Object.keys(quoteAssets);
  const pairs = Object.entries(baseAssets).map(([key, val]) => ({
    val: val.base,
    label: val.quote + "/" + val.base,
  }));
  const intl = useIntl();

  return (
    <CustomFilters onClear={clearFilters} title="">
      <CustomSelect
        label={intl.formatMessage({
          id: "fil.timeframe",
        })}
        onChange={onTimeFrameChange}
        options={timeFramesOptions}
        value={timeFrame}
      />
      <CustomSelect
        label={intl.formatMessage({
          id: "fil.base",
        })}
        onChange={onBaseChange}
        options={bases}
        value={base}
        search={true}
      />
      <CustomSelect
        label={intl.formatMessage({
          id: "fil.pair",
        })}
        onChange={onPairChange}
        options={pairs}
        value={pair}
        search={true}
      />
    </CustomFilters>
  );
};

export default AnalyticsFilters;
