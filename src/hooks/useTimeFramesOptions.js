import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../services/tradeApiClient.types").QuoteAssetsDict} QuoteAssetsDict
 */

/**
 * Provides bases assets.
 *
 * @returns
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
