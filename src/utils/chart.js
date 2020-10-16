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
 * @param {function} addValue Callback to format the new aggregated value
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
      const date = moment(afterDate).add(i + 1, "d");
      res.push(addValue(date, amount));
    }
  };

  const lastAggregatedData = dailyData.reduce((aggregatedData, currentData) => {
    const currentDate = currentData.date;
    let amount = currentData.amount;

    if (aggregatedData) {
      amount += aggregatedData.amount;
      const daysDiff = moment(currentData.date).diff(moment(aggregatedData.date), "days");

      if (daysDiff > 1) {
        // Adding missing days
        generateMissingDays(daysDiff - 1, aggregatedData.date, aggregatedData.amount);
      }
    }

    // Add calculated daily amount
    res.push(addValue(currentDate, amount));

    // Return last aggregated data
    return {
      date: currentDate,
      amount,
    };
  }, null);

  if (lastAggregatedData) {
    // Adding missing days until today
    const daysDiff = moment().diff(moment(lastAggregatedData.date), "days");
    if (daysDiff > 1) {
      generateMissingDays(daysDiff - 1, lastAggregatedData.date, lastAggregatedData.amount);
    }
  }

  return res;
};
