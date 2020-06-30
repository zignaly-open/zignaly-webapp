import React, { useState, useEffect } from "react";
import "./TradingPerformance.scss";
import { Box } from "@material-ui/core";
import TradingPerformanceGraph from "./TradingPerformanceGraph";
import WeeklyData from "./WeeklyData";

/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").ProviderPerformanceEntity} ProviderPerformanceEntity
 * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {ProviderPerformanceEntity} performance
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSX component.
 */

const TradingPerformance = ({ performance }) => {
  const [list, setList] = useState([]);
  const [selectedQuater, setSelectedQuarter] = useState({
    weeklyStats: [],
    total: 0,
    id: 0,
    label: "",
  });

  const prepareData = () => {
    let weeklyStats = performance.weeklyStats;
    if (weeklyStats) {
      weeklyStats = prepareYear(weeklyStats);
      let listing = [];
      let week = 0;
      for (let a = 0; a < 4; a++) {
        /**
         * @type {*}
         */
        let quarter = { weeklyStats: [], total: 0, id: 0, label: "" };
        let total = 0;
        for (let b = 0; b < 13; b++) {
          let stats = weeklyStats[week];
          if (stats.week === week + 1 && new Date(stats.day).getFullYear() === 2020) {
            quarter.weeklyStats.push(weeklyStats[week]);
            total += weeklyStats[week].return;
            quarter.total = total;
          } else {
            quarter.weeklyStats.push({ week: week, return: 0, day: "", positions: 0 });
          }
          week++;
        }
        quarter.id = Math.random();
        quarter.label = `'20 Q${Math.ceil(week / 13)}`;
        listing.push(quarter);
      }
      setList([...listing]);
      setSelectedQuarter(listing[0]);
    }
  };

  /**
   *
   * @param {*} data initial weekly stats from backend.
   * @returns {Array<*>} Weekly data for 52 weeks.
   */
  const prepareYear = (data) => {
    data = [...data].sort((a, b) => a.week - b.week);
    let newData = [];
    for (let a = 1; a <= 52; a++) {
      let item = [...data].find((i) => i.week === a);
      if (item) {
        newData.push(item);
      } else {
        newData.push({ week: a, return: 0, day: "", positions: 0 });
      }
    }
    return newData;
  };

  useEffect(prepareData, [performance]);

  /**
   * Function to select a quarter.
   *
   * @param {*} data quarter object received.
   * @returns {void} None.
   */
  const handleChange = (data) => {
    setSelectedQuarter(data);
  };

  return (
    <Box className="tradingPerformance">
      <TradingPerformanceGraph quarter={selectedQuater} />
      <WeeklyData list={list} onChange={handleChange} selected={selectedQuater} />
    </Box>
  );
};

export default TradingPerformance;
