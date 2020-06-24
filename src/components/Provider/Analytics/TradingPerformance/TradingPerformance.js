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
  const [selectedQuater, setSelectedQuarter] = useState({ weeklyStats: [], total: 0, id: 0 });

  const prepareData = () => {
    let quarters = Math.ceil(performance.weeklyStats.length / 13);
    if (quarters > 4) {
      quarters = 4;
    }
    let week = 0;
    let listing = [];
    for (let a = 0; a < quarters; a++) {
      /**
       * @type {*}
       */
      let quarter = { weeklyStats: [], total: 0 };
      let total = 0;
      for (let b = 0; b < 13; b++) {
        if (performance.weeklyStats[week]) {
          quarter.weeklyStats.push(performance.weeklyStats[week]);
          total += performance.weeklyStats[week].return;
          quarter.total = total;
        } else {
          quarter.weeklyStats.push({ week: week, return: 0, day: "", positions: 0 });
        }
        week++;
      }
      quarter.id = Math.random();
      listing.push(quarter);
    }
    setList([...listing]);
    setSelectedQuarter(listing[0]);
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
