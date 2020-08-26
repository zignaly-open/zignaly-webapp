import React from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../../../store/initialState").AnalyticsFilters} AnalyticsFilters
 */

/**
 * @typedef {import("../../CustomSelect/CustomSelect").OptionType} OptionType
 * @typedef {Object} AnayticsFiltersPropTypes
 * @property {function} onClear Callback that delegate filters clearing to caller.
 * @property {Array<string>} quotes Quotes options.
 * @property {Array<OptionType>} bases Bases options.
 * @property {Array<OptionType>} timeFrames
 * @property {function} setFilters Callback that delegate filters update to caller.
 * @property {AnalyticsFilters} filters Current filters.
 */

/**
 * Provides filters for filtering providers.
 *
 * @param {AnayticsFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const AnalyticsFilters = ({ onClear, bases, quotes, timeFrames, filters, setFilters }) => {
  const intl = useIntl();

  return (
    <CustomFilters onClear={onClear} title="">
      <CustomSelect
        label={intl.formatMessage({
          id: "fil.timeframe",
        })}
        onChange={(/** @type {string} */ v) => setFilters({ timeFrame: v })}
        options={timeFrames}
        value={filters.timeFrame}
      />
      <CustomSelect
        label={intl.formatMessage({
          id: "fil.quote",
        })}
        onChange={(/** @type {string} */ v) => setFilters({ quote: v })}
        options={quotes}
        search={true}
        value={filters.quote}
      />
      <CustomSelect
        label={intl.formatMessage({
          id: "fil.pair",
        })}
        onChange={(/** @type {string} */ v) => setFilters({ quote: v })}
        options={bases}
        search={true}
        value={filters.base}
      />
    </CustomFilters>
  );
};

export default AnalyticsFilters;
