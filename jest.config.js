const appStage = process.env.STAGE || "dev";
require("dotenv").config({
  path: `.env.${appStage}`,
});

// tsconfig paths
const { compilerOptions } = require("./tsconfig.json");
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const paths = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: `<rootDir>/${compilerOptions.baseUrl}/`,
});

module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "<rootDir>/jest-preprocess.js",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test))\\.([tj]sx?)$",
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/file-mock.js",
    ...paths,
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["node_modules", ".cache", "types"],
  transformIgnorePatterns: ["node_modules/(?!(gatsby)/)"],
  globals: {
    __PATH_PREFIX__: "",
  },
  setupFilesAfterEnv: ["<rootDir>/loadershim.js", "<rootDir>/jest.setup.js"],
  moduleDirectories: [
    "node_modules",
    __dirname, // the root directory
    "src",
    "src/utils/test",
  ],
  testEnvironment: "jsdom",
};
