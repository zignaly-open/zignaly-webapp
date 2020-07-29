import React, { useState, useEffect } from "react";
import "./providerAnalytics.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import CopiersGraph from "../../../components/Provider/Analytics/CopiersGraph";
import TradingPerformance from "../../../components/Provider/Analytics/TradingPerformance";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import GraphLabels from "../../../components/Balance/TotalEquity/GraphLabels";
import MoreInfo from "../../../components/Provider/Analytics/MoreInfo";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import { createProviderCopiersEmptyEntity } from "../../../services/tradeApiClient.types";
import { formatFloat2Dec } from "../../../utils/format";
import { Helmet } from "react-helmet";

const CopyTradersAnalytics = () => {
  const storeSession = useStoreSessionSelector();
  const storeViews = useStoreViewsSelector();
  const emptyPerformance = {
    closePositions: 0,
    openPositions: 0,
    totalBalance: 0,
    totalTradingVolume: 0,
    weeklyStats: [{ week: 0, return: 0, day: "", positions: 0 }],
  };
  const emptyFollowers = createProviderCopiersEmptyEntity();
  const [followers, setFollowers] = useState([emptyFollowers]);
  const [performance, setPerformance] = useState(emptyPerformance);
  const dispatch = useDispatch();
  const [copiersLoading, setCopiersLoading] = useState(false);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [increase, setIncrease] = useState(0);
  const [increasePercentage, setIncreasePercentage] = useState(0);
  const intl = useIntl();

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
      .providerCopiersGet(payload)
      .then((response) => {
        setFollowers(response);
        setCopiersLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(getProviderFollowers, []);

  const calculateIncrease = () => {
    if (followers.length > 0) {
      let total = 0;
      let targetDate = new Date().setDate(new Date().getDate() - 7);
      let list = [...followers].sort((a, b) => a.totalFollowers - b.totalFollowers);
      let latest = list[list.length - 1];
      for (let a = 0; a < list.length; a++) {
        let itemTime = new Date(list[a].date).getTime();
        if (itemTime >= targetDate) {
          total += list[a].followers;
        }
      }
      setIncrease(total);
      let percent = (total / latest.totalFollowers) * 100;
      setIncreasePercentage(percent);
    }
  };

  useEffect(calculateIncrease, [followers]);

  return (
    <Box className="profileAnalyticsPage">
      <Helmet>
        <title>
          {`${storeViews.provider.name} - ${intl.formatMessage({
            id: "srv.analytics",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Box bgcolor="grid.content" className="tradingPerformanceBox">
        <Typography className="boxTitle" variant="h3">
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

      <Box bgcolor="grid.content" className="copiersBox">
        <Box alignItems="center" className="titleBox" display="flex" flexDirection="row">
          <Typography variant="h3">
            <FormattedMessage id="trader.people" />
          </Typography>

          <Typography className={increase >= 0 ? "green" : "red"} variant="h4">
            {`+${increase} (${formatFloat2Dec(increasePercentage)}%) Copiers Last 7 Days`}
          </Typography>
        </Box>
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

      <Box bgcolor="grid.content" className="moreInfoBox">
        <MoreInfo provider={storeViews.provider} />
      </Box>
    </Box>
  );
};

export default CopyTradersAnalytics;
