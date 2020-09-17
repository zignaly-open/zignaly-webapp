import React from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../../../store/initialState").DashboardAnalyticsFilters} DashboardAnalyticsFilters
 */

/**
 * @typedef {import("../../CustomSelect/CustomSelect").OptionType} OptionType
 * @typedef {Object} AnayticsFiltersPropTypes
 * @property {function} onClear Callback that delegate filters clearing to caller.
 * @property {Array<string>} quotes Quotes options.
 * @property {Array<OptionType>} timeFrames
 * @property {Array<OptionType>} providers Providers options.
 * @property {function} setFilters Callback that delegate filters update to caller.
 * @property {DashboardAnalyticsFilters} filters Current filters.
 */

/**
 * Provides filters for filtering profile stats.
 *
 * @param {AnayticsFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const Filters = ({ onClear, quotes, timeFrames, providers, setFilters, filters }) => {
  const intl = useIntl();

  return (
    <CustomFilters onClear={onClear} title="">
      {timeFrames.length && quotes.length && providers.length > 2 ?
        <>
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
            onChange={(/** @type {OptionType} */ v) => setFilters({ quote: v })}
            options={quotes}
            search={true}
            value={filters.quote}
          />
          <CustomSelect
            label={intl.formatMessage({
              id: "fil.providers",
            })}
            onChange={(/** @type {OptionType} */ v) => setFilters({ provider: v })}
            options={providers}
            search={true}
            value={filters.provider}
          />
        </>
        : null
      }
    </CustomFilters>
  );
};

export default Filters;
