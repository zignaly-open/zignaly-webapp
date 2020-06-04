import React, { useState } from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";
import useQuoteAssets from "../../../hooks/useQuoteAssets";
import ProvidersProfitsTable from "../../Providers/ProvidersProfitsTable";
import AnalyticsFilters from "../../Providers/AnalyticsFilters";
import { useIntl, FormattedMessage } from "react-intl";
import { Box } from "@material-ui/core";

/**
 * @typedef {Object} ProvidersAnalyticsPropTypes
 * @property {React.MouseEventHandler} clearFilters Callback that delegate filters clearing to caller.
 * @property {function} onCoinChange Callback that delegate coin change to caller.
 * @property {function} onExchangeChange Callback that delegate exchange change to caller.
 * @property {string} base Selected coin.
 * @property {string} pair Selected pair.
 * @property {string} type Selected timeFrame.
 */

/**
 * Provides filters for filtering providers.
 *
 * @param {ProvidersAnalyticsPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersAnalytics = ({
  //   onClose,
  //   coin,
  //   exchange,
  //   onCoinChange,
  //   onExchangeChange,
  //   clearFilters,
  type,
}) => {
  //   const quoteAssets = useQuoteAssets();
  //   const coins = Object.keys(quoteAssets);
  const [base, setBase] = useState("BTC");
  console.log("parent");
  const [pair, setPair] = useState("");
  const [timeFrame, setTimeFrame] = useState("");
  const onClear = () => {
    setBase("BTC");
    setPair("");
    setTimeFrame("");
  };

  return (
    <Box>
      <AnalyticsFilters
        type={type}
        base={base}
        onBaseChange={setBase}
        pair={pair}
        onPairChange={setPair}
        timeFrame={timeFrame}
        onTimeFrameChange={setTimeFrame}
        onClear={onClear}
      />
      <ProvidersProfitsTable
        persistKey={`${type}Analytics`}
        title={<FormattedMessage id={`${type}.performance`} />}
        type={type}
      />
    </Box>
  );
};

export default ProvidersAnalytics;
