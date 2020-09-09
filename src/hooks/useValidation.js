import { lt, gt } from "lodash";
import { useIntl } from "react-intl";

/**
 * @typedef {Object} ValidationMethods
 * @property {function} lessThan
 * @property {function} greaterThan
 * @property {function} validPercentage
 */

/**
 * Provides methods to validate form inputs.
 *
 * @returns {ValidationMethods} ValidationMethods
 */
const useValidation = () => {
  const { formatMessage } = useIntl();

  /**
   * Check if value is less than the 2nd one. Take trade side into consideration.
   * @param {number} value value
   * @param {number} compare compared value
   * @param {string} side trade side
   * @param {string} errorId error translation id
   * @param {*} [errorValues] error translation values
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  // eslint-disable-next-line max-params
  const lessThan = (value, compare, side, errorId, errorValues = {}) => {
    const sideErrorText = side.toUpperCase() === "LONG" ? "lower" : "greater";
    const compareFn = side.toUpperCase() === "LONG" ? lt : gt;

    return (
      compareFn(value, compare) || formatMessage({ id: `${errorId}.${sideErrorText}` }, errorValues)
    );
  };

  /**
   * Check if value is greater than the 2nd one. Take trade side into consideration.
   * @param {number} value value
   * @param {number} compare compared value
   * @param {string} side trade side
   * @param {string} errorId error translation id
   * @param {*} [errorValues] error translation values
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  // eslint-disable-next-line max-params
  const greaterThan = (value, compare, side, errorId, errorValues = {}) => {
    const sideErrorText = side.toUpperCase() === "LONG" ? "greater" : "lower";
    const compareFn = side.toUpperCase() === "LONG" ? gt : lt;

    return (
      compareFn(value, compare) || formatMessage({ id: `${errorId}.${sideErrorText}` }, errorValues)
    );
  };

  /**
   * Check if value is a valid percentage.
   * @param {number} value value
   * @param {string} errorId error translation id
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  const validPercentage = (value, errorId) => {
    return (value > 0 && value <= 100) || formatMessage({ id: errorId });
  };

  return {
    lessThan,
    greaterThan,
    validPercentage,
  };
};

export default useValidation;
