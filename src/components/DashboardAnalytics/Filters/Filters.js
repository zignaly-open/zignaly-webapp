import React from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../../CustomSelect/CustomSelect").OptionType} OptionType
 * @typedef {Object} AnayticsFiltersPropTypes
 * @property {function} onClear Callback that delegate filters clearing to caller.
 * @property {function} onQuoteChange Callback that delegate quote change to caller.
 * @property {function} onTimeFrameChange Callback that delegate time frame change to caller.
 * @property {string} quote Selected quote (base currency).
 * @property {Array<string>} quotes Quotes options.
 * @property {string} timeFrame Selected time frame.
 * @property {Array<OptionType>} timeFrames
 * @property {Array<OptionType>} providers Providers options.
 * @property {OptionType} provider Selected provider.
 * @property {function} onProviderChange
 */

/**
 * Provides filters for filtering profile stats.
 *
 * @param {AnayticsFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const Filters = ({
  quote,
  timeFrame,
  onQuoteChange,
  onTimeFrameChange,
  onClear,
  quotes,
  timeFrames,
  provider,
  providers,
  onProviderChange,
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
          id: "fil.quote",
        })}
        onChange={onQuoteChange}
        options={quotes}
        search={true}
        value={quote}
      />
      <CustomSelect
        label={intl.formatMessage({
          id: "fil.providers",
        })}
        onChange={onProviderChange}
        options={providers}
        search={true}
        value={provider}
      />
    </CustomFilters>
  );
};

export default Filters;
