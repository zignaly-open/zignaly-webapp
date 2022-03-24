const withTM = require("next-transpile-modules")([
  "@mui/material",
  "@mui/system",
  "zignaly-ui-test",
]); // pass the modules you would like to see transpiled

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// Pass custom env with APP_ENV
require("dotenv-flow").config({
  node_env: process.env.APP_ENV || process.env.NODE_ENV || "development",
});

const env = {};
Object.keys(process.env).forEach((key) => {
  if (key.startsWith("NEXT_PUBLIC_")) {
    env[key] = process.env[key];
  }
});

module.exports = withBundleAnalyzer(
  withTM({
    env,
    reactStrictMode: true,
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@mui/styled-engine": "@mui/styled-engine-sc",
      };
      config.module.rules.push(
        {
          test: /\.ya?ml$/,
          type: "json",
          use: "yaml-loader",
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"],
        },
      );
      return config;
    },
    compiler: {
      // ssr and displayName are configured by default
      styledComponents: true,
    },
  }),
);
