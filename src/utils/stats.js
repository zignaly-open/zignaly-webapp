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
 * @property {Date} day Day
 * @property {number} return Return
 */

/**
 * Make the missing stats generator function.
 * @param {Array<*>} stats Stats array
 * @param {function(Date, number): *} formatStats Callback to format the new aggregated value
 * @param {OpUnitType} unit Unit
 * @returns {function} Missing stats generator function
 */
const generateMissingStats = (stats, formatStats, unit) => {
  /**
   * Fill missing stats for each unit of time, from startDate to count
   * @param {string|Date} startDate Date after which to start generating
   * @param {number} count Number of days to generate
   * @param {number} amount Amount value for each unit of time
   * @returns {void}
   */
  const fn = (startDate, count, amount) => {
    let date = dayjs(startDate);
    for (let i = 0; i < count; i++) {
      stats.push(formatStats(date.toDate(), amount));
      date = date.add(1, unit);
    }
  };
  return fn;
};

/**
 * Function to generate a new array that contains daily stats data.
 *
 * @param {Array<DailyData>} dailyData Array of daily stats data.
 * @param {function(Date, number): *} formatStats Callback to format the new aggregated stats
 * @returns {Array<*>} Result
 */
export const generateDailyStats = (dailyData, formatStats) => {
  /**
   * @type {Array<*>}
   */
  let stats = [];
  const generateMissingDays = generateMissingStats(stats, formatStats, "d");

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
    const newValue = formatStats(currentDate.toDate(), amount);
    if (!sameDay) {
      stats.push(newValue);
    } else {
      // Update stats data
      stats[stats.length - 1] = newValue;
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

  return stats;
};

/**
 * @typedef {Object} Options
 * @property {boolean} accumulateAmount The total stats amount value will by summed up for each entry
 */
const defaultOptions = {
  accumulateAmount: true,
};

/**
 * Function to generate a new array that contains weekly stats data.
 *
 * @param {Array<WeeklyData>} weeklyData Array of weekly stats data.
 * @param {Options} opts Options
 * @param {function(Date, number): *} formatStats Callback to format the new aggregated stats
 * @returns {Array<*>} Result
 */
export const generateWeeklyStats = (weeklyData, opts, formatStats) => {
  const options = { ...defaultOptions, ...opts };
  /**
   * @type {Array<*>}
   */
  let stats = [];
  const generateMissingWeeks = generateMissingStats(stats, formatStats, "w");

  if (weeklyData.length) {
    // Adding missing weeks until start date
    const firstDate = dayjs(weeklyData[0].day);
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

  const lastAggregatedData = weeklyData.reduce((aggregatedData, currentData) => {
    let amount = currentData.return;
    const currentDate = dayjs(currentData.day).startOf("d");

    if (aggregatedData) {
      if (options.accumulateAmount) {
        amount += aggregatedData.return;
      }
      const lastDate = dayjs(aggregatedData.day).startOf("d");
      const weeksDiff = currentDate.diff(lastDate, "week");
      if (weeksDiff > 1) {
        // Adding missing weeks
        generateMissingWeeks(
          dayjs(aggregatedData.day).add(1, "w").toDate(),
          weeksDiff - 1,
          options.accumulateAmount ? aggregatedData.return : 0,
        );
      }
    }
    // const watermark = amount + totalLosses;
    // const profitPercentage = (lastWeekBalance * profits) / 100;

    // Add calculated weekly amount
    stats.push(formatStats(currentDate.toDate(), amount));

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

  return stats;
};
