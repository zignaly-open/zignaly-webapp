import React, { useState, useEffect } from "react";
import "./TradingPerformance.scss";
import { Box } from "@material-ui/core";
import TradingPerformanceGraph from "./TradingPerformanceGraph";
import WeeklyData from "./WeeklyData";
import { generateStats } from "../../../../utils/stats";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);

/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").ProviderPerformanceEntity} ProviderPerformanceEntity
 * @typedef {import("../../../../services/tradeApiClient.types").DefaultProviderPerformanceWeeklyStats} DefaultProviderPerformanceWeeklyStats
 * @typedef {import("./WeeklyData/WeeklyData").DefaultQuarter} DefaultQuarter
 * @typedef {import("../../../../utils/stats").StatsOptions} StatsOptions
 */

/**
 * @typedef {Object} DefaultProps
 * @property {ProviderPerformanceEntity} performance
 * @property {string} [unit]
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSX component.
 */

const TradingPerformance = ({ performance, unit = "%" }) => {
  const [quarters, setQuarters] = useState(/** @type {Array<DefaultQuarter>} */ ([]));

  const [selectedQuarter, setSelectedQuarter] = useState(
    /** @type {DefaultQuarter} */
    {
      weeklyStats: [],
      total: 0,
      label: "",
    },
  );

  /**
   * Get start of the date quarter, starting at the begining of the week.
   * e.g. Thu Jan 14 -> Sun Jan 3
   * @param {dayjs.Dayjs} date Date
   * @return {dayjs.Dayjs} Date
   */
  const getQuarterWeekStart = (date) => {
    let quarterStart = date.startOf("quarter");
    if (quarterStart.day() > 0) {
      // Start at the beginning of the week (Fri Jan 1 -> Sun Jan 3)
      quarterStart = quarterStart.add(1, "w").startOf("w");
    }

    return quarterStart;
  };

  /**
   * Update the weekly stats to fill missing weeks and group them by quarters
   * @returns {void}
   */
  const prepareData = () => {
    if (!performance.weeklyStats.length) return;

    /** @type {Array<DefaultQuarter>} */
    const _quarters = [];

    const firstStatsDay = dayjs(performance.weeklyStats[0].day);
    let startDate = getQuarterWeekStart(firstStatsDay);

    // If we have stats for the first week of the quarter we skipped, they will be added
    // to the previous quarter. (e.g. Sat Apr 3 will be assigned to quarter 1, not 2)
    if (firstStatsDay.isBefore(startDate)) {
      startDate = startDate.subtract(1, "quarter");
    }

    /** @type {StatsOptions} */
    const options = {
      unit: "w",
      startDate,
      endDate: dayjs().endOf("quarter").startOf("d"),
      dateKey: "day",
    };

    generateStats(performance.weeklyStats, options, (weekDate, data) => {
      const lastQuarter = _quarters && _quarters[_quarters.length - 1];
      let currentQuarterId = weekDate.quarter();

      const returns = data ? data.return : 0;
      const weekStats = {
        day: weekDate.startOf("w").format(),
        week: weekDate.week().toString(),
        return: returns,
        positions: data ? data.positions : 0,
      };

      const quarterLabel = `'${weekDate.year().toString().slice(2)} Q${currentQuarterId}`;

      if (lastQuarter && lastQuarter.label === quarterLabel) {
        // Add weekly stats to current quarter
        lastQuarter.weeklyStats.push(weekStats);
        lastQuarter.total += weekStats.return;
      } else {
        // Init new quarter
        _quarters.push({
          weeklyStats: [weekStats],
          total: returns,
          label: quarterLabel,
        });
      }
    });
    setQuarters(_quarters.reverse());
    setSelectedQuarter(_quarters[0]);
  };
  useEffect(prepareData, [performance]);

  /**
   * Callback to select a quarter.
   *
   * @param {*} data Quarter object.
   * @returns {void}
   */
  const handleChange = (data) => {
    setSelectedQuarter(data);
  };

  return (
    <Box className="tradingPerformance">
      <TradingPerformanceGraph quarter={selectedQuarter} unit={unit} />
      <WeeklyData list={quarters} onChange={handleChange} selected={selectedQuarter} unit={unit} />
    </Box>
  );
};

export default TradingPerformance;
