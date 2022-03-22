import React, { useEffect, useState } from "react";
import tradeApi from "../../../services/tradeApiClient";
import useSelectedExchange from "hooks/useSelectedExchange";
import { showErrorAlert } from "../../../store/actions/ui";
import { useDispatch } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import TradingPerformance from "../../Provider/Analytics/TradingPerformance";
import TotalEquityBar from "../../TotalEquityBar";
import EquityPart from "../../TotalEquityBar/EquityPart";
import { formatFloat } from "../../../utils/format";
import { generateStats } from "../../../utils/stats";
import ProfitSharingTable from "./ProfitSharingTable";
import ProfitSharingEquityChart from "./ProfitSharingEquityChart";
import "./ProfitSharingAnalytics.scss";
import dayjs from "dayjs";
import { retainInfoUrl, highWaterMarkInfoUrl } from "../../../utils/affiliateURLs";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProfitSharingBalanceHistory} ProfitSharingBalanceHistory
 * @typedef {import("../../../services/tradeApiClient.types").HasBeenUsedProviderEntity} ProviderEntity
 * @typedef {import("../../../services/tradeApiClient.types").DefaultProviderPerformanceWeeklyStats} DefaultProviderPerformanceWeeklyStats
 * @typedef {import("../../../services/tradeApiClient.types").ProviderPerformanceEntity} ProviderPerformanceEntity
 * @typedef {import("../../../services/tradeApiClient.types").ProfitSharingBalanceEntry} ProfitSharingBalanceEntry
 * @typedef {import("../../Balance/TotalEquity/TotalEquityGraph/TotalEquityGraph").EquityChartData} EquityChartData
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
  const [balanceHistory, setBalanceHistory] = useState(
    /** @type {ProfitSharingBalanceHistory} */ (null),
  );
  const [balanceHistoryLoading, setBalanceHistoryLoading] = useState(false);

  /**
   * @typedef {Object} Stats
   * @property {Array<ProfitSharingBalanceEntry>} accounting
   * @property {Array<EquityChartData>} balance
   * @property {ProviderPerformanceEntity} performance
   */
  const [stats, setStats] = useState(
    /** @type {Stats} */ ({
      accounting: [],
      balance: [],
      performance: null,
    }),
  );
  const selectedExchange = useSelectedExchange();
  const dispatch = useDispatch();

  /**
   * Parse balance entries to prepare stats
   * @param {Array<ProfitSharingBalanceEntry>} entries Balance entries
   * @returns {void}
   */
  const parseEntries = (entries) => {
    /** @type {Array<EquityChartData>} */
    const balanceStats = [];
    // Prepare balance daily stats
    generateStats(entries, {}, (date, data) => {
      const lastData = balanceStats.length ? balanceStats[balanceStats.length - 1] : null;
      const amount = data ? data.amount : 0;

      if (lastData && date.isSame(lastData.date, "d")) {
        // Multiple data for same day, update last stats
        balanceStats[balanceStats.length - 1].totalUSDT += amount;
        // Todo: Refactor TotalEquityGraph to not require totalWalletUSDT
        balanceStats[balanceStats.length - 1].totalWalletUSDT += amount;
      } else {
        const lastAmount = lastData ? lastData.totalUSDT : 0;
        // Add new daily stats
        balanceStats.push({
          date: date.format("YYYY/MM/DD"),
          totalUSDT: lastAmount + amount,
          totalWalletUSDT: lastAmount + amount,
        });
      }
    });

    /** @type {Array<DefaultProviderPerformanceWeeklyStats>} */
    let weekStats = [];
    /** @type {Array<ProfitSharingBalanceEntry>} */
    let accountingStats = [];

    // Prepare weekly profit stats and accounting stats
    entries.forEach((entry) => {
      const dayDate = dayjs(entry.date).startOf("d");
      if (["pnl", "successFee"].includes(entry.type)) {
        // Calculate total PnL by week for weekly profit stats
        const statsPnLWeek = weekStats.length && weekStats[weekStats.length - 1];
        if (statsPnLWeek && dayjs(statsPnLWeek.day).isSame(dayDate, "w")) {
          statsPnLWeek.return += entry.amount;
        } else {
          weekStats.push({
            return: entry.amount,
            day: dayDate.format(),
            positions: 1,
          });
        }
      }

      const existingStats = accountingStats.find(
        (s) => dayjs(s.date).isSame(entry.date, "d") && s.type === entry.type,
      );

      // Prepare accounting data, grouped by day and type
      if (existingStats) {
        existingStats.amount += entry.amount;
      } else {
        accountingStats.push({
          date: dayDate.toDate(),
          amount: entry.amount,
          type: entry.type,
        });
      }
    });

    setStats({
      performance: {
        weeklyStats: weekStats,
        closePositions: 0,
        openPositions: 0,
        totalBalance: 0,
        totalTradingVolume: 0,
      },
      accounting: accountingStats,
      balance: balanceStats,
    });
  };

  const getProfitSharingBalanceHistory = () => {
    const payload = {
      providerId: provider.id,
      exchangeInternalId: selectedExchange.internalId,
    };
    setBalanceHistoryLoading(true);

    tradeApi
      .getProfitSharingBalanceHistory(payload)
      .then((response) => {
        parseEntries(response.entries);
        setBalanceHistory(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setBalanceHistoryLoading(false);
      });
  };
  useEffect(getProfitSharingBalanceHistory, [provider]);

  return (
    <Box
      alignItems="center"
      className="profitSharingAnalytics"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
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
            <TradingPerformance
              performance={stats.performance}
              unit={balanceHistory?.quote || ""}
            />
            <TotalEquityBar>
              <>
                <EquityPart
                  name="profitsharing.initAllocated"
                  tooltip={{ message: "profitsharing.initAllocated.tooltip" }}
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
                  tooltip={{ message: "profitsharing.currentAllocated.tooltip" }}
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
                  tooltip={{ message: "profitsharing.retain.tooltip", url: retainInfoUrl }}
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
                  tooltip={{
                    message: "profitsharing.watermark.tooltip",
                    url: highWaterMarkInfoUrl,
                  }}
                  value={
                    <>
                      {balanceHistory.quote} {formatFloat(balanceHistory.watermark)}
                    </>
                  }
                />
              </>
            </TotalEquityBar>

            <Box className="chartTableBox" display="flex" width={1}>
              <ProfitSharingEquityChart
                currentBalance={balanceHistory.currentBalance}
                data={stats.balance}
                selectedExchange={selectedExchange}
              />
              <ProfitSharingTable data={stats.accounting} />
            </Box>
          </>
        )
      )}
    </Box>
  );
};

export default ProfitSharingAnalytics;
