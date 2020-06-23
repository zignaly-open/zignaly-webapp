import React, { useState, useEffect } from "react";
import "./providerAnalytics.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import { FormattedMessage } from "react-intl";
import CopiersGraph from "../../../components/Provider/Analytics/CopiersGraph";
import TradingPerformance from "../../../components/Provider/Analytics/TradingPerformance";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import GraphLabels from "../../../components/Balance/TotalEquity/GraphLabels";
import MoreInfo from "../../../components/Provider/Analytics/MoreInfo";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";

const SignalProviderAnalytics = () => {
  const storeSession = useStoreSessionSelector();
  const storeViews = useStoreViewsSelector();
  const [followers, setFollowers] = useState([]);
  const emptyObject = {
    closePositions: 0,
    openPositions: 0,
    totalBalance: 0,
    totalTradingVolume: 0,
    weeklyStats: [{ week: 0, return: 0, day: "", positions: 0 }],
  };
  const [performance, setPerformance] = useState(emptyObject);
  const dispatch = useDispatch();
  const [copiersLoading, setCopiersLoading] = useState(false);
  const [performanceLoading, setPerformanceLoading] = useState(false);

  const payload = {
    token: storeSession.tradeApi.accessToken,
    providerId: storeViews.provider.id,
  };

  const getProviderPerformance = () => {
    setPerformanceLoading(true);
    tradeApi
      .providerPerformanceGet(payload)
      .then((response) => {
        setPerformance(response);
        setPerformanceLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(getProviderPerformance, []);

  const getProviderFollowers = () => {
    setCopiersLoading(true);
    tradeApi
      .providerFollowersGet(payload)
      .then((response) => {
        setFollowers(response);
        setCopiersLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(getProviderFollowers, []);

  return (
    <Box className="profileAnalyticsPage">
      <Box bgcolor="grid.main" className="tradingPerformanceBox">
        <Typography variant="h3">
          <FormattedMessage id="copyt.tradingperformance" />
        </Typography>

        <Box
          alignItems="center"
          className="graphBox"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {performanceLoading && <CircularProgress color="primary" size={50} />}
          {!performanceLoading && <TradingPerformance performance={performance} />}
        </Box>
      </Box>

      <Box bgcolor="grid.main" className="copiersBox">
        <Typography variant="h3">
          <FormattedMessage id="trader.people" />
        </Typography>
        <Box
          alignItems="center"
          className="graphBox"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {copiersLoading && <CircularProgress color="primary" size={50} />}
          {!copiersLoading && (
            <>
              <CopiersGraph list={followers} />
              <GraphLabels list={followers} />
            </>
          )}
        </Box>
      </Box>

      <Box bgcolor="grid.main" className="moreInfoBox">
        <MoreInfo provider={storeViews.provider} />
      </Box>
    </Box>
  );
};

export default compose(withProviderLayout)(SignalProviderAnalytics);
