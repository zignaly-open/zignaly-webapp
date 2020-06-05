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
        id: "timeframe.week.1",
      }),
      val: "7days",
    },
    {
      label: intl.formatMessage({
        id: "timeframe.week.2",
      }),
      val: "2weeks",
    },
    {
      label: intl.formatMessage({
        id: "timeframe.month.1",
      }),
      val: "30days",
    },
    {
      label: intl.formatMessage({
        id: "timeframe.month.3",
      }),
      val: "3months",
    },
    {
      label: intl.formatMessage({
        id: "timeframe.month.6",
      }),
      val: "6months",
    },
  ];
};

export default useTimeFramesOptions;
