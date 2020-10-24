import React, { useState, useEffect } from "react";
import "./TradingPerformance.scss";
import { Box } from "@material-ui/core";
import TradingPerformanceGraph from "./TradingPerformanceGraph";
import WeeklyData from "./WeeklyData";
import { generateWeeklyData } from "../../../../utils/chart";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);

/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").ProviderPerformanceEntity} ProviderPerformanceEntity
 * @typedef {import("../../../../services/tradeApiClient.types").DefaultProviderPerformanceWeeklyStats} DefaultProviderPerformanceWeeklyStats
 * @typedef {import("./WeeklyData/WeeklyData").DefaultQuarter} DefaultQuarter
 * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
 */

/**
 * @typedef {Object} DefaultProps
 * @property {ProviderPerformanceEntity} performance
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSX component.
 */

const TradingPerformance = ({ performance }) => {
  const [quarters, setQuarters] = useState(/** @type {Array<DefaultQuarter>} */ ([]));

  const [selectedQuater, setSelectedQuarter] = useState(
    /** @type {DefaultQuarter} */
    {
      weeklyStats: [],
      total: 0,
      id: 0,
      label: "",
    },
  );

  /**
   * Update the weekly stats to fill missing weeks and group them by quarters
   * @returns {void}
   */
  const prepareData = () => {
    /** @type {Array<DefaultQuarter>} */
    const _quarters = [];

    // keep?
    // const weeklyData = performance.weeklyStats.map((s) => ({
    //   ...s,
    //   date: s.day,
    //   amount: s.return,
    // }));
    generateWeeklyData(performance.weeklyStats, (date, amount) => {
      const lastQuarter = _quarters && _quarters[_quarters.length - 1];
      const weekDate = dayjs(date);
      const currentQuarterId = dayjs(date).quarter();
      const weekStats = {
        day: weekDate.format(),
        week: weekDate.week().toString(),
        return: amount,
        positions: 1, // todo if needed
      };
      if (lastQuarter && lastQuarter.id === currentQuarterId) {
        lastQuarter.weeklyStats.push(weekStats);
        lastQuarter.total += weekStats.return;
      } else {
        _quarters.push({
          weeklyStats: [weekStats],
          total: 0,
          id: currentQuarterId,
          label: `'${weekDate.year().toString().slice(2)} Q${currentQuarterId}`,
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
      <TradingPerformanceGraph quarter={selectedQuater} />
      <WeeklyData list={quarters} onChange={handleChange} selected={selectedQuater} />
    </Box>
  );
};

export default TradingPerformance;
