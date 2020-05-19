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
