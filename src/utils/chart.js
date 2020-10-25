import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
dayjs.extend(quarterOfYear);

/**
 * @typedef {import('dayjs').OpUnitType} OpUnitType
 */

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
 * Make the missing stats generator function.
 * @param {Array<*>} res Stats array
 * @param {function(Date, number): *} addValue Callback to format the new aggregated value
 * @param {OpUnitType} unit Unit
 * @returns {function} Missing stats generator function
 */
const generateMissingStats = (res, addValue, unit) => {
  /**
   * Fill missing stats with passed amount value
   * @param {string|Date} startDate Date after which to start generating
   * @param {number} daysCount Number of days to generate
   * @param {number} amount Amount value for each day
   * @returns {void}
   */
  const fn = (startDate, daysCount, amount) => {
    let date = dayjs(startDate);
    for (let i = 0; i < daysCount; i++) {
      res.push(addValue(date.toDate(), amount));
      date = date.add(1, unit);
    }
  };
  return fn;
};

/**
 * Function to generate a new array that contains daily amount data.
 *
 * @param {Array<DailyData>} dailyData Array of daily amount data.
 * @param {function(Date, number): *} parseValue Callback to format the new aggregated value
 * @returns {Array<*>} Result
 */
export const generateDailyStats = (dailyData, parseValue) => {
  /**
   * @type {Array<*>}
   */
  let res = [];

  const generateMissingDays = generateMissingStats(res, parseValue, "d");

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
    const currentDate = dayjs(currentData.date).startOf("d");

    let sameDay = false;
    if (aggregatedData) {
      amount += aggregatedData.amount;
      const lastDate = dayjs(aggregatedData.date).startOf("d");
      const daysDiff = currentDate.diff(lastDate, "d");
      if (daysDiff > 1) {
        // Adding missing days
        generateMissingDays(lastDate.add(1, "d"), daysDiff - 1, aggregatedData.amount);
      } else if (daysDiff === 0) {
        sameDay = true;
        // Still same day as previous one
        // Sum daily profits
        // profits = aggregatedData.profits + profits;
        // lastAggregatedData.amount = amount;
      }
      //   } else if (!currentDate.isSame(lastDate, "week")) {
      //     lastWeekBalance += amount;
      //   }
    }
    const watermark = amount + totalLosses;
    // const profitPercentage = (lastWeekBalance * profits) / 100;

    // Add calculated daily amount
    const newValue = parseValue(currentDate.toDate(), amount);
    if (!sameDay) {
      res.push(newValue);
    } else {
      // Update stats data
      res[res.length - 1] = newValue;
    }

    // Return last aggregated data
    return {
      date: currentDate.toDate(),
      amount,
      watermark,
    };
  }, null);

  if (lastAggregatedData) {
    // Adding missing days until today
    const lastDate = dayjs(lastAggregatedData.date).startOf("d");
    const daysDiff = dayjs().startOf("d").diff(lastDate, "d");
    if (daysDiff > 1) {
      generateMissingDays(lastDate.add(1, "d"), daysDiff - 1, lastAggregatedData.amount);
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
export const generateWeeklyStats = (dailyData, addValue) => {
  /**
   * @type {Array<*>}
   */
  let res = [];

  const generateMissingWeeks = generateMissingStats(res, addValue, "w");

  if (dailyData.length) {
    // Adding missing weeks until start date
    const firstDate = dayjs(dailyData[0].day);
    const quarterStart = firstDate.startOf("quarter");
    // First week day of the first week of the quarter
    if (quarterStart.day() > 0) {
      quarterStart.add(1, "w").startOf("w");
    }
    const firstWeekDate = firstDate.startOf("week");
    const daysDiff = firstWeekDate.diff(quarterStart, "w");
    if (daysDiff > 0) {
      // Adding missing weeks
      generateMissingWeeks(quarterStart.toDate(), daysDiff, 0);
    }
  }

  const lastAggregatedData = dailyData.reduce((aggregatedData, currentData) => {
    let amount = currentData.return;
    const currentDate = dayjs(currentData.day).startOf("d");

    if (aggregatedData) {
      amount += aggregatedData.return;
      const lastDate = aggregatedData.day.startOf("d");
      const daysDiff = currentDate.diff(lastDate, "week");
      if (daysDiff > 1) {
        // Adding missing weeks
        generateMissingWeeks(
          dayjs(aggregatedData.day).add(1, "w").toDate(),
          daysDiff,
          aggregatedData.return,
        );
      }
    }
    // const watermark = amount + totalLosses;
    // const profitPercentage = (lastWeekBalance * profits) / 100;

    // Add calculated weekly amount
    res.push(addValue(currentDate.toDate(), amount));

    // Return last aggregated data
    return {
      day: currentDate.toDate(),
      return: amount,
    };
  }, null);

  if (lastAggregatedData) {
    // Adding missing weeks until today
    const weeksDiff = dayjs()
      .endOf("quarter")
      .startOf("d")
      .diff(dayjs(lastAggregatedData.day).startOf("d"), "week");
    if (weeksDiff > 1) {
      generateMissingWeeks(dayjs(lastAggregatedData.day).add(1, "w").toDate(), weeksDiff, 0);
    }
  }

  return res;
};
