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
import { formatFloat, FormatedDateTime } from "../../../utils/format";
import ProfitSharingTable from "./ProfitSharingTable";
import ProfitSharingEquityChart from "./ProfitSharingEquityChart";
import "./ProfitSharingAnalytics.scss";

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
    <Box className="profitSharingAnalytics">
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

      <Box display="flex" width={1}>
        <ProfitSharingEquityChart />
        <ProfitSharingTable />
      </Box>
    </Box>
  );
};

export default ProfitSharingAnalytics;
