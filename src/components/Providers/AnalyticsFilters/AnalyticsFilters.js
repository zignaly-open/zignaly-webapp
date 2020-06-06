import React from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../../CustomSelect/CustomSelect").OptionType} OptionType
 * @typedef {Object} AnayticsFiltersPropTypes
 * @property {function} onClear Callback that delegate filters clearing to caller.
 * @property {function} onBaseChange Callback that delegate base change to caller.
 * @property {function} onQuoteChange Callback that delegate quote change to caller.
 * @property {function} onTimeFrameChange Callback that delegate time frame change to caller.
 * @property {string} quote Selected quote (base currency).
 * @property {Array<string>} quotes Quotes options.
 * @property {OptionType} base Selected base (pair).
 * @property {Array<OptionType>} bases Bases options.
 * @property {string} timeFrame Selected time frame.
 * @property {Array<OptionType>} timeFrames
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
  bases,
  quotes,
  timeFrames,
}) => {
  const intl = useIntl();

  return (
    <CustomFilters onClear={onClear} title="">
      <CustomSelect
        label={intl.formatMessage({
          id: "fil.timeframe",
        })}
        onChange={onTimeFrameChange}
        options={timeFrames}
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
