import { isString, isEmpty } from "lodash";

/**
 *
 * @param {string} password
 * @returns {number}
 */

export const validatePassword = (password) => {
  let strength = 0;
  let specialRegex = /[ `!@#$%^&*()_+\-=[\]{};':"|,.<>/?~\\]/;
  if (password) {
    if (password.length >= 3) {
      strength += 1;
      for (let a = 0; a < password.length; a++) {
        if (password[a] === password[a].toUpperCase()) {
          strength += 1;
          break;
        }
      }
      let str = String(password);
      for (let a = 0; a < str.length; a++) {
        let char = parseInt(str.charAt(a));
        if (!isNaN(char)) {
          strength += 1;
          break;
        }
      }
      if (specialRegex.test(password) && password.length >= 8) {
        strength += 1;
      }
    }
  }
  return strength;
};

/**
 * Validate if value is valid integer or float without separators and only one fractional point.
 *
 * @param {number|string} value Numeric value to check.
 * @returns {boolean} true if validation pass, false otherwise.
 */
export const isValidIntOrFloat = (value) => {
  // Assume empty string as pass check.
  if (isString(value) && isEmpty(value)) {
    return true;
  }

  const pattern = new RegExp(/^-{0,1}\d*\.{0,1}\d+$/);
  const passed = pattern.test(String(value));

  return passed;
};
