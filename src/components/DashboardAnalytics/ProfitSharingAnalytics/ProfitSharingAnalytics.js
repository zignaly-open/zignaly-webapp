import React, { useEffect, useState } from "react";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { showErrorAlert } from "../../../store/actions/ui";
import { useDispatch } from "react-redux";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import TradingPerformance from "../../Provider/Analytics/TradingPerformance";
import TotalEquityBar from "../../TotalEquityBar";
import EquityPart from "../../TotalEquityBar/EquityPart";
import { formatFloat, formatDate } from "../../../utils/format";
import { generateDailyData } from "../../../utils/chart";
import ProfitSharingTable from "./ProfitSharingTable";
import ProfitSharingEquityChart from "./ProfitSharingEquityChart";
import "./ProfitSharingAnalytics.scss";
import moment from "moment";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProfitSharingBalanceHistory} ProfitSharingBalanceHistory
 * @typedef {import("../../../services/tradeApiClient.types").ProviderEntity} ProviderEntity
 * @typedef {import("../../../services/tradeApiClient.types").DefaultProviderPermormanceWeeklyStats} DefaultProviderPermormanceWeeklyStats
 * @typedef {import("../../../services/tradeApiClient.types").ProviderPerformanceEntity} ProviderPerformanceEntity

 */

/**
 * @typedef {Object} DefaultProps
 * @property {ProviderEntity} provider
 */

/**
 * Render analytics panels for profit sharing providers.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const ProfitSharingAnalytics = ({ provider }) => {
  const storeSession = useStoreSessionSelector();
  const [performance, setPerformance] = useState(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [balanceHistory, setBalanceHistory] = useState(
    /** @type {ProfitSharingBalanceHistory} */ (null),
  );
  const [profitStats, setProfitStats] = useState(/** @type {Array<*>} */ (null));
  const [balanceHistoryLoading, setBalanceHistoryLoading] = useState(false);
  const storeSettings = useStoreSettingsSelector();

  const dispatch = useDispatch();

  let weeklyStats = null;
  const dailyStats = [];

  /**
   *
   * @param {Array<ProfitSharingBalanceEntry>} entries
   */
  const parseEntries = (entries) => {
    const _profitStats = generateDailyData(entries, true, (date, amount, watermark, profits) => {
      const momentDate = moment(date);
      return {
        // week: `${momentDate.year()}-${momentDate.week()}`, // group by week
        day: momentDate.format("YYYY/MM/DD"),
        totalUSDT: amount,
        // watermark,
        // profits,
        //   returns:
      };
    });
    setProfitStats(_profitStats);

    /** @type {Array<DefaultProviderPermormanceWeeklyStats>} */
    let statsAccounting = [];
    let lastEntry = null;

    let _statsPnL = [];
    entries.forEach((entry) => {
      const dayDate = entry.date.startOf("d");
      if (entry.type === "pnl") {
        const week = dayDate.week();
        const statsPnLWeek = _statsPnL.length && _statsPnL[_statsPnL.length - 1];
        if (statsPnLWeek && statsPnLWeek.day.isSame(dayDate, "w")) {
          statsPnLWeek.return += entry.amount;
        } else {
          _statsPnL.push({
            week: `${dayDate.year()}-${week}`,
            return: 0,
            day: dayDate,
            positions: 1,
          });
        }
      }
      //   if (lastEntry && moment(lastEntry.date).isSame(dayDate, "d")) {
      //   }
    });
    // setProfitStats(entries);
    const performance = {
      weeklyStats: _statsPnL,
    };
    setPerformance(performance);
  };

  const getProviderPerformance = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: provider.id,
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
  //   useEffect(getProviderPerformance, []);

  const getProfitSharingBalanceHistory = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: provider.id,
      exchangeInternalId: storeSettings.selectedExchange.internalId,
    };
    setBalanceHistoryLoading(true);

    tradeApi
      .getProfitSharingBalanceHistory(payload)
      .then((response) => {
        parseEntries(response.entries);
        setBalanceHistory(response);
        // calculateProviderPerformance(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setBalanceHistoryLoading(false);
      });
  };
  useEffect(getProfitSharingBalanceHistory, []);

  /**
   *
   * @param {ProfitSharingBalanceHistory} response Balance History
   * @returns {void}
   */
  const calculateProviderPerformance = (response) => {
    //---

    /** @type {Array<DefaultProviderPermormanceWeeklyStats>} */
    const weeklyStats = [];
    /** @type {DefaultProviderPermormanceWeeklyStats} */
    let weekData = null;
    let currentAllocated = 0;
    let losses = 0;

    response.entries.forEach((entry) => {
      const date = moment(entry.date);
      const week = date.week();
      if (weekData && weekData.week !== week) {
        weekData = { week, positions: 1, day: date, return: 0 };
        weeklyStats.push(weekData);
      }

      currentAllocated += entry.amount;

      switch (entry.type) {
        case "deposit":
          currentAllocated = entry.amount;
          break;
        case "pnl":
          if (entry.amount < 0) {
            losses -= entry.amount;
          }
          break;
        default:
          break;
      }
      watermark = currentAllocated + losses;

      //   weeklyStats.push({
      //     week,
      //     return,
      //   });

      //   return {
      //     currentAllocated,
      //   };
    });
  };

  return (
    <Box
      alignItems="center"
      className="profitSharingAnalytics"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {performanceLoading ? (
        <CircularProgress color="primary" size={50} />
      ) : (
        performance && <TradingPerformance performance={performance} />
      )}
      {balanceHistoryLoading ? (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          mt="50px"
        >
          <CircularProgress color="primary" size={50} />
        </Box>
      ) : (
        balanceHistory && (
          <>
            <TotalEquityBar>
              <>
                <EquityPart
                  name="profitsharing.initAllocated"
                  value={
                    <>
                      {balanceHistory.quote} {formatFloat(balanceHistory.initBalance)}
                    </>
                  }
                />
                <span className="operator">|</span>
                <EquityPart
                  name="profitsharing.currentAllocated"
                  //   info={<>= USDT {formatFloat(10.1)}</>}
                  value={
                    <>
                      {/* <Typography className={`number1`}> */}
                      {balanceHistory.quote} {formatFloat(balanceHistory.currentBalance)}
                      {/* </Typography> */}
                      {/* <Typography className={`number1 pnlPercent ${color}`}>10%</Typography> */}
                    </>
                  }
                />
                <span className="operator">|</span>
                <EquityPart
                  name="profitsharing.retain"
                  value={
                    <>
                      <Typography className="number1">
                        {balanceHistory.quote} {formatFloat(balanceHistory.retain)}
                      </Typography>
                    </>
                  }
                />
                <span className="operator">|</span>
                <EquityPart
                  name="profitsharing.watermark"
                  value={
                    <>
                      {balanceHistory.quote} {formatFloat(balanceHistory.watermark)}
                    </>
                  }
                />
              </>
            </TotalEquityBar>

            <Box className="chartTableBox" display="flex" width={1}>
              {profitStats && (
                <>
                  <ProfitSharingEquityChart
                    currentBalance={balanceHistory.currentBalance}
                    data={profitStats}
                    selectedExchange={storeSettings.selectedExchange}
                  />
                  <ProfitSharingTable data={profitStats} />
                </>
              )}
            </Box>
          </>
        )
      )}
    </Box>
  );
};

export default ProfitSharingAnalytics;
