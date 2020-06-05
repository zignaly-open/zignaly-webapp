import React from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import useQuoteAssets from "../../../hooks/useQuoteAssets";
import useBaseAssets from "../../../hooks/useBaseAssets";
import useTimeFramesOptions from "../../../hooks/useTimeFramesOptions";
import { useIntl } from "react-intl";

/**
 * @typedef {Object} AnayticsFiltersPropTypes
 * @property {function} onClear Callback that delegate filters clearing to caller.
 * @property {function} onBaseChange Callback that delegate base change to caller.
 * @property {function} onQuoteChange Callback that delegate quote change to caller.
 * @property {function} onTimeFrameChange Callback that delegate time frame change to caller.
 * @property {string} quote Selected quote (base currency).
 * @property {string} base Selected base (pair).
 * @property {string} timeFrame Selected time frame.
 */

/**
 * Provides filters for filtering providers.
 *
 * @param {AnayticsFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const AnalyticsFilters = ({
  quote,
  base,
  timeFrame,
  onBaseChange,
  onQuoteChange,
  onTimeFrameChange,
  onClear,
}) => {
  const quoteAssets = useQuoteAssets();
  const baseAssets = useBaseAssets(base);
  const timeFramesOptions = useTimeFramesOptions();
  const quotes = Object.keys(quoteAssets);
  const bases = Object.entries(baseAssets).map(([key, val]) => ({
    val: key,
    label: val.quote + "/" + val.base,
  }));
  const intl = useIntl();

  return (
    <CustomFilters onClear={onClear} title="">
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
        onChange={onQuoteChange}
        options={quotes}
        search={true}
        value={quote}
      />
      <CustomSelect
        label={intl.formatMessage({
          id: "fil.pair",
        })}
        onChange={onBaseChange}
        options={bases}
        search={true}
        value={base}
      />
    </CustomFilters>
  );
};

export default AnalyticsFilters;
