import React from "react";
import "./WeeklyData.scss";
import { Box, Typography } from "@material-ui/core";

/**
 *
 * @typedef {import("../../../../../services/tradeApiClient.types").DefaultProviderPermormanceWeeklyStats} DefaultProviderPermormanceWeeklyStats
 * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
 */

/**
 *
 * @typedef {Object} DefaultQuarter
 * @property {Array<DefaultProviderPermormanceWeeklyStats>} weeklyStats
 * @property {Number} total
 * @property {Number} id
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<DefaultQuarter>} list
 * @property {DefaultQuarter} selected
 * @property {Function} onChange
 */

/**
 * Trading performance chart component.
 *
 * @param {DefaultProps} props Default props.
 * @return {JSX.Element} JSX component.
 */

const WeeklyData = ({ list, selected, onChange }) => {
  const weekLabels = [
    "w1",
    "w2",
    "w3",
    "w4",
    "w5",
    "w6",
    "w7",
    "w8",
    "w9",
    "w10",
    "w11",
    "w12",
    "w13",
  ];

  /**
   * Funciton to select a quarter.
   *
   * @param {Number} id id of the quarter on which user clicks.
   * @returns {void} None.
   */
  const handleChange = (id) => {
    let found = [...list].find((item) => item.id === id);
    if (found) {
      onChange(found);
    }
  };

  return (
    <Box
      alignItems="flex-start"
      className="weeklyData"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Box
        alignItems="center"
        className="weekLabels"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        {weekLabels.map((item, index) => (
          <Typography key={index} variant="h4">
            {item}
          </Typography>
        ))}
        <Typography className="total" variant="h4">
          Total
        </Typography>
      </Box>

      <Box className="weekData">
        {list.map((item, index) => (
          <Box
            alignItems="center"
            className={"quarterBox " + (selected.id === item.id ? "selected" : "")}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            key={index}
            onClick={() => handleChange(item.id)}
          >
            {item.weeklyStats.map((item2, index2) => (
              <Typography className={item2.return > 0 ? "green" : "red"} key={index2} variant="h4">
                {item2.return.toFixed(2)}
              </Typography>
            ))}
            <Typography className={"total " + (item.total > 0 ? "green" : "red")} variant="h4">
              {item.total.toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WeeklyData;
