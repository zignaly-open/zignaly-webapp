const appStage = process.env.STAGE || "dev";
require("dotenv").config({
  path: `.env.${appStage}`,
});

module.exports = {
  transform: {
    "^.+\\.jsx?$": "<rootDir>/jest-preprocess.js",
    ".*\\.(yml)$": "yaml-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.([tj]sx?)$",
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/file-mock.js",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["node_modules", ".cache"],
  transformIgnorePatterns: ["node_modules/(?!(gatsby)/)"],
  globals: {
    __PATH_PREFIX__: "",
  },
  setupFiles: ["<rootDir>/loadershim.js", "<rootDir>/jest.setup.js"],
  moduleDirectories: [
    "node_modules",
    // add the directory with the test-utils.js file, for example:
    "__tests__/utils/", // a utility folder
    __dirname, // the root directory
  ],
};
