import { useIntl } from "react-intl";

/**
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 */

/**
 * Provides bases assets.
 *
 * @returns {Array<OptionType>} Time frames
 */
const useTimeFramesOptions = () => {
  const intl = useIntl();
  return [
    {
      label: intl.formatMessage({
        id: "timeframe.days.3",
      }),
      val: "3",
    },
    {
      label: intl.formatMessage({
        id: "timeframe.days.7",
      }),
      val: "7",
    },
    {
      label: intl.formatMessage({
        id: "timeframe.days.15",
      }),
      val: "15",
    },
    {
      label: intl.formatMessage({
        id: "timeframe.days.30",
      }),
      val: "30",
    },
    {
      label: intl.formatMessage({
        id: "timeframe.days.60",
      }),
      val: "60",
    },
    {
      label: intl.formatMessage({
        id: "timeframe.weekly",
      }),
      val: "monthly",
    },
    {
      label: intl.formatMessage({
        id: "timeframe.monthly",
      }),
      val: "weekly",
    },
    {
      label: intl.formatMessage({
        id: "timeframe.yearly",
      }),
      val: "yearly",
    },
  ];
};

export default useTimeFramesOptions;
