import moment from "moment";

/**
 *
 * @param {Array<*>} dailyData
 * @param {function} addValue
 * @returns {Array<*>}
 */
export const generateDailyData = (dailyData, addValue) => {
  let res = [];

  /**
   * Fill missing days with passed amount value
   * @param {number} daysCount
   * @param {Date} afterDate
   * @param {numer} amount
   * @returns {void}
   */
  const generateMissingDays = (daysCount, afterDate, amount) => {
    for (let i = 0; i < daysCount; i++) {
      const date = moment(afterDate).add(i + 1, "d");
      res.push(addValue(date, amount));
    }
  };

  dailyData.reduce((/** @type {{date: Date, amount: number}} */ aggregatedData, currentData) => {
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
      amount: amount,
    };
  }, null);

  return res;
};
