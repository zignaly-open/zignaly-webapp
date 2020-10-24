import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
dayjs.extend(quarterOfYear);

/**
 * @typedef {Object} DailyData
 * @property {Date} date Date
 * @property {number} amount Amount
 */

/**
 * @typedef {Object} WeeklyData
 * @property {Date|string} day Day
 * @property {number} return Return
 */

/**
 * Function to generate a new array that contains daily amount data.
 *
 * @param {Array<DailyData>} dailyData Array of daily amount data.
 * @param {function(Date, number): *} addValue Callback to format the new aggregated value
 * @returns {Array<*>} Result
 */
export const generateDailyData = (dailyData, addValue) => {
  /**
   * @type {Array<*>}
   */
  let res = [];

  /**
   * Fill missing days with passed amount value
   * @param {number} daysCount Number of days to generate
   * @param {Date} afterDate Date after which to start generating
   * @param {number} amount Amount value for each day
   * @returns {void}
   */
  const generateMissingDays = (daysCount, afterDate, amount) => {
    for (let i = 0; i < daysCount; i++) {
      const date = dayjs(afterDate).add(i + 1, "d");
      res.push(addValue(date.toDate(), amount));
    }
  };

  let totalLosses = 0;
  //   let lastWeekBalance = 0;
  const lastAggregatedData = dailyData.reduce((aggregatedData, currentData) => {
    let amount = currentData.amount;
    // let balance;
    // let profits = 0;
    // if (currentData.type === "pnl") {
    //   if (amount < 0) {
    //     totalLosses += Math.abs(currentData.amount);
    //   }
    //   profits = currentData.amount;
    // }
    let dayDate = currentData.date;

    if (aggregatedData) {
      amount += aggregatedData.amount;
      const currentDate = dayjs(currentData.date).startOf("d");
      const lastDate = dayjs(aggregatedData.date).startOf("d");
      const daysDiff = currentDate.diff(lastDate, "d");
      if (daysDiff > 1) {
        // Adding missing days
        generateMissingDays(daysDiff - 1, aggregatedData.date, aggregatedData.amount);
      } else if (daysDiff === 0) {
        // Still same day as previous one
        // Sum daily profits
        // profits = aggregatedData.profits + profits;
      }
      //   } else if (!currentDate.isSame(lastDate, "week")) {
      //     lastWeekBalance += amount;
      //   }
    }
    const watermark = amount + totalLosses;
    // const profitPercentage = (lastWeekBalance * profits) / 100;

    // Add calculated daily amount
    res.push(addValue(dayDate, amount));

    // Return last aggregated data
    return {
      date: dayDate,
      amount,
      watermark,
    };
  }, null);

  if (lastAggregatedData) {
    // Adding missing days until today
    const daysDiff = dayjs().startOf("d").diff(dayjs(lastAggregatedData.date).startOf("d"), "d");
    if (daysDiff > 1) {
      generateMissingDays(daysDiff - 1, lastAggregatedData.date, lastAggregatedData.amount);
    }
  }

  return res;
};

/**
 * Function to generate a new array that contains daily amount data.
 *
 * @param {Array<WeeklyData>} dailyData Array of daily amount data.
 * @param {function(Date, number): *} addValue Callback to format the new aggregated value
 * @returns {Array<*>} Result
 */
export const generateWeeklyData = (dailyData, addValue) => {
  /**
   * @type {Array<*>}
   */
  let res = [];

  /**
   * Fill missing days with passed amount value
   * @param {string|Date} startDate Date after which to start generating
   * @param {number} daysCount Number of days to generate
   * @param {number} amount Amount value for each day
   * @returns {void}
   */
  const generateMissingDays = (startDate, daysCount, amount) => {
    let date = dayjs(startDate);
    for (let i = 0; i < daysCount; i++) {
      res.push(addValue(date.toDate(), amount));
      date = date.add(1, "w");
    }
  };

  if (dailyData.length) {
    // Adding missing days until start date
    const firstDate = dayjs(dailyData[0].day);
    const quarterStart = firstDate.startOf("quarter");
    // First week day of the first week of the quarter
    if (quarterStart.day() > 0) {
      quarterStart.add(1, "w").startOf("w");
    }
    const firstWeekDate = firstDate.startOf("week");
    const daysDiff = firstWeekDate.diff(quarterStart, "w");
    if (daysDiff > 0) {
      // Adding missing days
      generateMissingDays(quarterStart.toDate(), daysDiff, 0);
    }
  }

  const lastAggregatedData = dailyData.reduce((aggregatedData, currentData) => {
    let amount = currentData.return;
    let dayDate = currentData.day;

    if (aggregatedData) {
      amount += aggregatedData.return;
      const currentDate = dayjs(currentData.day).startOf("d");
      const lastDate = dayjs(aggregatedData.day).startOf("d");
      const daysDiff = currentDate.diff(lastDate, "week");
      if (daysDiff > 1) {
        // Adding missing days
        generateMissingDays(
          dayjs(aggregatedData.day).add(1, "w").toDate(),
          daysDiff,
          aggregatedData.return,
        );
      }
    }
    // const watermark = amount + totalLosses;
    // const profitPercentage = (lastWeekBalance * profits) / 100;

    // Add calculated daily amount
    res.push(addValue(dayDate, amount));

    // Return last aggregated data
    return {
      day: dayDate,
      return: amount,
    };
  }, null);

  if (lastAggregatedData) {
    // Adding missing days until today
    const daysDiff = dayjs()
      .endOf("quarter")
      .startOf("d")
      .diff(dayjs(lastAggregatedData.day).startOf("d"), "week");
    if (daysDiff > 1) {
      generateMissingDays(dayjs(lastAggregatedData.day).add(1, "w").toDate(), daysDiff, 0);
    }
  }

  return res;
};
