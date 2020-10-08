import React, { useEffect, useState } from "react";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { showErrorAlert } from "../../../store/actions/ui";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import TradingPerformance from "../../Provider/Analytics/TradingPerformance";
import TotalEquityBar from "../../TotalEquityBar";
import EquityPart from "../../TotalEquityBar/EquityPart";
import { formatFloat2Dec, formatFloat } from "../../../utils/format";
import TotalEquityGraph from "../../Balance/TotalEquity/TotalEquityGraph";
import TitleBar from "../../Balance/TotalEquity//TitleBar";
import EquityFilter from "../../Balance/TotalEquity//EquityFilter";
import EquityGraphLabels from "../../Balance/TotalEquity//GraphLabels";

/**
 * @typedef {import("../../../store/initialState").DashboardAnalyticsFilters} DashboardAnalyticsFilters
 */

/**
 * @typedef {Object} DefaultProps
 * @property {string} providerId
 */

/**
 * Render analytics panels for profit sharing providers.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const ProfitSharingAnalytics = ({ providerId }) => {
  const storeSession = useStoreSessionSelector();
  const [performance, setPerformance] = useState(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const color = "green";
  const balance = {
    totalUSDT: 100,
    totalBTC: 0.01,
    pnlBTC: 0,
    pnlUSDT: 0,
    totalFreeBTC: 0,
    totalFreeUSDT: 0,
    totalLockedBTC: 0,
    totalLockedUSDT: 0,
  };
  const balancesTest = [
    {
      totalUSDT: 100,
      totalBTC: 0.01,
      date: "2020-10-08",
    },
    {
      totalUSDT: 60,
      totalBTC: 0.006,
      date: "2020-10-07",
    },
    {
      totalUSDT: 50,
      totalBTC: 0.005,
      date: "2020-10-06",
    },
  ];
  const [balances, setBalances] = useState(balancesTest);

  const dispatch = useDispatch();

  const getProviderPerformance = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId,
    };
    setPerformanceLoading(true);

    tradeApi
      .providerPerformanceGet(payload)
      .then((response) => {
        setPerformance(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setPerformanceLoading(false);
      });
  };

  useEffect(getProviderPerformance, []);

  return (
    <Box>
      {performanceLoading ? (
        <CircularProgress color="primary" size={50} />
      ) : (
        performance && <TradingPerformance performance={performance} />
      )}
      <TotalEquityBar>
        {balance && (
          <>
            <EquityPart
              name="profitsharing.initAllocated"
              //   info={<div>= USDT {formatFloat(balance.totalFreeUSDT)}</div>}
              value={<>BTC {formatFloat(0.001)}</>}
            />
            <span className="operator">+</span>
            <EquityPart
              name="profitsharing.currentAllocated"
              //   info={<>= USDT {formatFloat(10.1)}</>}
              value={<>BTC {formatFloat(0.0012)}</>}
            />
            <span className="operator">+</span>
            <EquityPart
              name="profitsharing.retain"
              value={
                <>
                  <Typography className={`number1 ${color}`}>BTC {formatFloat(0.004)}</Typography>
                  <Typography className={`number1 pnlPercent ${color}`}>10%</Typography>
                </>
              }
            />
            <span className="operator">=</span>
            <EquityPart
              name="profitsharing.watermark"
              info={
                <>
                  <Typography variant="h4">
                    <FormattedMessage id="balance.total" />
                  </Typography>
                  <Typography className="smallText number3">= USDT {formatFloat(10)}</Typography>
                </>
              }
              value={<>BTC {formatFloat(0.0001)}</>}
            />
          </>
        )}
      </TotalEquityBar>
      <Box
        alignItems="flex-start"
        className="totalEquity"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box
          alignItems="flex-start"
          className="equityHeader"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <TitleBar balance={balance} />
          <EquityFilter list={balances} onChange={(b) => setBalances(b)} />
        </Box>
        <Box width={1}>
          <TotalEquityGraph list={balances} modal={false} />
          <EquityGraphLabels list={balances} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfitSharingAnalytics;
