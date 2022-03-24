const withTM = require("next-transpile-modules")(["@mui/material", "@mui/system"]); // pass the modules you would like to see transpiled

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

module.exports = withTM({
  env,
  reactStrictMode: true,
  webpack: (config) => {
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   "@mui/styled-engine": "@mui/styled-engine-sc",
    // };
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
});
