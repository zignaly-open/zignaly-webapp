import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
dayjs.extend(quarterOfYear);

/**
 * @typedef {import('dayjs').OpUnitType} OpUnitType
 */

/**
 * @typedef {Object} StatsOptions
 * @property {OpUnitType} [unit]
 * @property {string} [dateKey]
 * @property {string|Date|dayjs.Dayjs} [startDate]
 * @property {string|Date|dayjs.Dayjs} [endDate]
 */

/** @type {StatsOptions} */
const defaultOptions = {
  unit: "d",
  startDate: null,
  endDate: null,
  dateKey: "date",
};

/**
 * Generate stats
 *
 * @template {Object.<string, *>} T
 * @param {Array<T>} data Array of weekly stats data.
 * @param {StatsOptions} options Options
 * @param {function(dayjs.Dayjs, T): *} makeStats Callback to add the stats data
 * @returns {void}
 */
export const generateStats = (data, options, makeStats) => {
  if (!data.length) return;
  const opts = { ...defaultOptions, ...options };

  // Start at passed startDate or first date
  let startDate = opts.startDate ? dayjs(opts.startDate) : dayjs(data[0][opts.dateKey]);
  startDate = startDate.startOf("d");

  // End at passed date or today
  let endDate = opts.endDate ? dayjs(opts.endDate) : dayjs();
  endDate = endDate.startOf("d");

  const diff = endDate.diff(startDate, opts.unit);
  let currentDate = startDate;
  let lastIndex = 0;

  /**
   * Optimized method to find all data matching date in array
   * @return {Array<T>} Matched results
   */
  const findAllData = () => {
    /** @type {typeof data} */
    let matches = [];
    for (let i = lastIndex; i < data.length; i++) {
      const d = data[i];
      lastIndex = i;

      if (dayjs(d[opts.dateKey]).isSame(currentDate, opts.unit)) {
        // Found a match
        matches.push(d);
      } else {
        // Stop looking for a match if we already passed a date with no result.
        break;
      }
    }

    return matches;
  };

  for (let i = 0; i <= diff; i++) {
    const matchingData = findAllData();
    if (!matchingData.length) {
      // Add stats for empty days
      makeStats(currentDate, null);
    } else {
      // eslint-disable-next-line no-loop-func
      matchingData.forEach((d) => makeStats(currentDate, d));
    }
    currentDate = currentDate.add(1, opts.unit);
  }
};

/**
//  * Function to generate a new array that contains weekly stats data.
//  * (Currently only used for the trader performance stats)
//  *
//  * @param {Array<WeeklyData>} weeklyData Array of weekly stats data.
//  * @param {function(Date, number): *} formatStats Callback to format the stats data
//  * @returns {Array<*>} Result
//  */
// export const generateWeeklyStats = (weeklyData, formatStats) => {
//   /**
//    * @type {Array<*>}
//    */
//   let stats = [];
//   const generateMissingWeeks = generateMissingStats(stats, formatStats, "w");

//   if (weeklyData.length) {
//     // Adding missing weeks until start date
//     const firstDate = dayjs(weeklyData[0].day);
//     const quarterStart = firstDate.startOf("quarter");
//     // First week day of the first week of the quarter
//     if (quarterStart.day() > 0) {
//       quarterStart.add(1, "w").startOf("w");
//     }
//     const firstWeekDate = firstDate.startOf("week");
//     const daysDiff = firstWeekDate.diff(quarterStart, "w");
//     if (daysDiff > 0) {
//       // Adding missing weeks
//       generateMissingWeeks(quarterStart.toDate(), daysDiff, 0);
//     }
//   }

//   const lastAggregatedData = weeklyData.reduce((aggregatedData, currentData) => {
//     let amount = currentData.return;
//     const currentDate = dayjs(currentData.day).startOf("d");

//     if (aggregatedData) {
//       const lastDate = dayjs(aggregatedData.day).startOf("d");
//       const weeksDiff = currentDate.diff(lastDate, "week");
//       if (weeksDiff > 1) {
//         // Adding missing weeks
//         generateMissingWeeks(dayjs(aggregatedData.day).add(1, "w").toDate(), weeksDiff - 1, 0);
//       }
//     }
//     // const watermark = amount + totalLosses;
//     // const profitPercentage = (lastWeekBalance * profits) / 100;

//     // Add calculated weekly amount
//     stats.push(formatStats(currentDate.toDate(), amount));

//     // Return last aggregated data
//     return {
//       day: currentDate.toDate(),
//       return: amount,
//     };
//   }, null);

//   if (lastAggregatedData) {
//     // Adding missing weeks until today
//     const weeksDiff = dayjs()
//       .endOf("quarter")
//       .startOf("d")
//       .diff(dayjs(lastAggregatedData.day).startOf("d"), "week");
//     if (weeksDiff > 1) {
//       generateMissingWeeks(dayjs(lastAggregatedData.day).add(1, "w").toDate(), weeksDiff, 0);
//     }
//   }

//   return stats;
// };
