import moment from "moment";
/**
 * @typedef {Object} DailyData
 * @property {Date} date Date
 * @property {number} amount Amount
 */

/**
 * Function to generate a new array that contains daily amount data.
 *
 * @param {Array<DailyData>} dailyData Array of daily amount data.
 * @param {function(Date, number): *} addValue Callback to format the new aggregated value
 * @returns {Array<*>} Result
 */
export const generateDailyData = (dailyData, withWaterfall, addValue) => {
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
  const generateMissingDays = (daysCount, afterDate, amount, waterfall) => {
    for (let i = 0; i < daysCount; i++) {
      const date = moment(afterDate).add(i + 1, "d");
      res.push(addValue(date.toDate(), amount, waterfall));
    }
  };

  let totalLosses = 0;
  let lastWeekBalance = 0;
  const lastAggregatedData = dailyData.reduce((aggregatedData, currentData) => {
    let amount = currentData.amount;
    let balance;
    let profits = 0;
    if (currentData.type === "pnl") {
      if (amount < 0) {
        totalLosses += Math.abs(currentData.amount);
      }
      profits = currentData.amount;
    }
    let dayDate = currentData.date;
    let sameDay = false;

    if (aggregatedData) {
      amount += aggregatedData.amount;
      const currentDate = moment(currentData.date);
      const lastDate = moment(aggregatedData.date);
      const daysDiff = currentDate.startOf("d").diff(lastDate.startOf("d"), "days");
      if (daysDiff > 1) {
        // Adding missing days
        generateMissingDays(
          daysDiff - 1,
          aggregatedData.date,
          aggregatedData.amount,
          aggregatedData.watermark,
        );
      } else if (daysDiff === 0) {
        // Still same day as previous one
        dayDate = lastDate;
        sameDay = true;
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
    if (!sameDay) {
      res.push(addValue(dayDate, amount, watermark));
    }

    // Return last aggregated data
    return {
      date: dayDate,
      amount,
      watermark,
      //   profits,
    };
  }, null);

  if (lastAggregatedData) {
    // Adding missing days until today
    const daysDiff = moment().startOf().diff(moment(lastAggregatedData.date).startOf(), "days");
    if (daysDiff > 1) {
      generateMissingDays(
        daysDiff - 1,
        lastAggregatedData.date,
        lastAggregatedData.amount,
        lastAggregatedData.waterfall,
      );
    }
  }

  return res;
};

/**
 * Function to generate a new array that contains daily amount data.
 *
 * @param {Array<DailyData>} dailyData Array of daily amount data.
 * @param {function(Date, number): *} addValue Callback to format the new aggregated value
 * @returns {Array<*>} Result
 */
// export const generateWeeklyData = (dailyData, withWaterfall, addValue) => {
//   /**
//    * @type {Array<*>}
//    */
//   let res = [];

//   const lastAggregatedData = dailyData.reduce((aggregatedData, currentData) => {
//     const currentDate = currentData.date;
//       let amount = currentData.amount;
//       let watermark = amount-

//     if (aggregatedData) {
//       amount += aggregatedData.amount;
//     }

//     // Add calculated daily amount
//     res.push(addValue(currentDate, amount));

//     // Return last aggregated data
//     return {
//       date: currentDate,
//       amount,
//       waterfall,
//     };
//   }, null);

//   return res;
// };
