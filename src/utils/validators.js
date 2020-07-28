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
 * Validate if number has correct amount of decimals
 * @param {string} value
 * @param {string} integerMultiple
 * @returns {boolean|string}
 */
export const validateDecimals = (value, integerMultiple) => {
  if (!value) return false;
  const splitValueDot = value.split(".");
  if (splitValueDot.length !== 2) return false;
  const decimals = splitValueDot[1].length;

  const integerMultipleFloat = parseFloat(integerMultiple);
  const maxDecimals = integerMultipleFloat > 1 ? 0 : Math.abs(Math.log10(integerMultipleFloat));
  return (
    decimals < maxDecimals ||
    `Please enter numbers with no more than ${maxDecimals} decimal places.`
  );
};
