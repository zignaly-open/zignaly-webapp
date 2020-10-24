import React, { useState, useEffect } from "react";
import "./TradingPerformance.scss";
import { Box } from "@material-ui/core";
import TradingPerformanceGraph from "./TradingPerformanceGraph";
import WeeklyData from "./WeeklyData";
import { generateWeeklyData } from "../../../../utils/chart";
import moment from "moment";

/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").ProviderPerformanceEntity} ProviderPerformanceEntity
 * @typedef {import("../../../../services/tradeApiClient.types").DefaultProviderPermormanceWeeklyStats} DefaultProviderPermormanceWeeklyStats
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

  const prepareData0 = () => {
    let weeklyStats = performance.weeklyStats;
    if (weeklyStats) {
      weeklyStats = prepareYear(weeklyStats);
      let listing = [];
      let week = 0;
      for (let i = 0; i < 4; i++) {
        /**
         * @type {*}
         */
        let quarter = { weeklyStats: [], total: 0, id: 0, label: "", quarterNumber: i + 1 };
        let total = 0;
        for (let j = 0; j < 13; j++) {
          let stats = weeklyStats.find();
          if (stats.week === week + 1 && new Date(stats.day).getFullYear() === 2020) {
            quarter.weeklyStats.push(weeklyStats[week]);
            total += weeklyStats[week].return;
            quarter.total = total;
          } else {
            // no weekly stats for this quarter
            quarter.weeklyStats.push({ week: week, return: 0, day: "", positions: 0 });
          }
          week++;
        }
        quarter.id = Math.random();
        quarter.label = `'20 Q${Math.ceil(week / 13)}`;
        if (quarter.total) {
          listing.push(quarter);
        }
      }
      listing.sort((a, b) => {
        return b.quarterNumber - a.quarterNumber;
      });
      setList([...listing]);
      let initital = listing.length
        ? listing[0]
        : { weeklyStats: [], total: 0, id: 0, label: "", quarterNumber: 0 };
      setSelectedQuarter(initital);
    }
  };

  /**
   *
   * @param {*} data initial weekly stats from backend.
   * @returns {Array<*>} Weekly data for 52 weeks.
   */
  const prepareYear = (data) => {
    console.log(data);
    data = data.sort((a, b) => a.week - b.week);
    let newData = [];
    for (let i = 1; i <= 52; i++) {
      let item = data.find((i) => i.week === i);
      if (item) {
        newData.push(item);
      } else {
        // Empty week
        newData.push({ week: i, return: 0, day: "", positions: 0 });
      }
    }
    console.log(newData);
    return newData;
  };

  /**
   * Update the weekly stats to fill missing weeks and group them by quarters
   * @returns {void}
   */
  const prepareData = () => {
    const quarters = [];
    generateWeeklyData(performance.weeklyStats, (date, amount) => {
      const lastQuarter = quarters && quarters[quarters.length - 1];
      const dateMoment = moment(date);
      const currentQuarterId = dateMoment.quarter();
      const weekStats = {
        day: dateMoment.format(), // start of week date
        return: amount, // total PnL
        positions: 1,
      };
      if (lastQuarter && lastQuarter.id === currentQuarterId) {
        lastQuarter.weeklyStats.push(weekStats);
        lastQuarter.total += weekStats.return;
      } else {
        quarters.push({
          weeklyStats: [weekStats],
          total: 0,
          id: currentQuarterId,
          label: `'${dateMoment.year().toString().slice(2)} Q${currentQuarterId}`,
        });
      }
    });
    setList(quarters.reverse());
    setSelectedQuarter(quarters[0]);
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
