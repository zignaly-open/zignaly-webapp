import React, { useState, useEffect } from "react";
import "./Analytics.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CopiersGraph from "../../../components/Provider/Analytics/CopiersGraph";
import TradingPerformance from "../../../components/Provider/Analytics/TradingPerformance";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import GraphLabels from "../../../components/Balance/TotalEquity/GraphLabels";
import MoreInfo from "../../../components/Provider/Analytics/MoreInfo";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import {
  createProviderCopiersEmptyEntity,
  createEmptyProfileProviderStatsEntity,
} from "../../../services/tradeApiClient.types";
import { formatFloat2Dec } from "../../../utils/format";
import ProviderStats from "./ProviderStats";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const CopyTradersAnalytics = ({ provider }) => {
  const storeSession = useStoreSessionSelector();
  const emptyPerformance = {
    closePositions: 0,
    openPositions: 0,
    totalBalance: 0,
    totalTradingVolume: 0,
    weeklyStats: [{ return: 0, day: "", positions: 0 }],
  };
  const emptyFollowers = createProviderCopiersEmptyEntity();
  const emptyStats = createEmptyProfileProviderStatsEntity();
  const [followers, setFollowers] = useState([emptyFollowers]);
  const [performance, setPerformance] = useState(emptyPerformance);
  const [stats, setStats] = useState(emptyStats);
  const dispatch = useDispatch();
  const [copiersLoading, setCopiersLoading] = useState(false);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [increase, setIncrease] = useState(0);
  const [increasePercentage, setIncreasePercentage] = useState(0);

  const payload = {
    token: storeSession.tradeApi.accessToken,
    providerId: provider.id,
  };

  const statsPayload = {
    token: storeSession.tradeApi.accessToken,
    providerId: provider.id,
    ro: true,
  };

  const getProviderPerformance = () => {
    if (provider.isCopyTrading) {
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
    }
  };

  useEffect(getProviderPerformance, []);

  const getProviderStats = () => {
    if (!provider.isCopyTrading) {
      setStatsLoading(true);
      tradeApi
        .profileProviderStatsGet(statsPayload)
        .then((response) => {
          setStats(response);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setStatsLoading(false);
        });
    }
  };

  useEffect(getProviderStats, []);

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
      })
      .finally(() => {
        setCopiersLoading(false);
      });
  };

  useEffect(getProviderFollowers, []);

  const calculateIncrease = () => {
    if (followers.length > 0) {
      let total = 0;
      let targetDate = new Date().setDate(new Date().getDate() - 7);
      let list = followers.sort((a, b) => a.totalFollowers - b.totalFollowers);
      let latest = list[list.length - 1];
      for (let i = 0; i < list.length; i++) {
        let itemTime = new Date(list[i].date).getTime();
        if (itemTime >= targetDate) {
          total += list[i].followers;
        }
      }
      setIncrease(total);
      let percent = (total / latest.totalFollowers) * 100;
      setIncreasePercentage(percent);
    }
  };

  useEffect(calculateIncrease, [followers]);

  return (
    <Box className="providerAnalytics">
      {provider.isCopyTrading && (
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
            {performanceLoading ? (
              <CircularProgress color="primary" size={50} />
            ) : (
              <TradingPerformance performance={performance} />
            )}
          </Box>
        </Box>
      )}

      {!provider.isCopyTrading && (
        <Box bgcolor="grid.content" className="providerStatsBox">
          {statsLoading && (
            <Box
              alignItems="center"
              className="graphBox"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <CircularProgress color="primary" size={50} />
            </Box>
          )}
          {!statsLoading && <ProviderStats data={stats.signalsInfo} />}
        </Box>
      )}

      <Box bgcolor="grid.content" className="copiersBox">
        <Box alignItems="center" className="titleBox" display="flex" flexDirection="row">
          <Typography variant="h3">
            <FormattedMessage id="trader.people" />
          </Typography>

          <Typography className={increase >= 0 ? "green" : "red"} variant="h4">
            {`+${increase} (${
              !isNaN(increasePercentage) ? formatFloat2Dec(increasePercentage) : 0
            }%) Copiers Last 7 Days`}
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
        <MoreInfo provider={provider} />
      </Box>
    </Box>
  );
};

export default CopyTradersAnalytics;
