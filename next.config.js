const path = require("path");
const withTM = require("next-transpile-modules")(["@mui/material", "@mui/system"]); // pass the modules you would like to see transpiled

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
// Don't use basePath in dev
if (process.env.NODE_ENV !== "production") {
  env.NEXT_PUBLIC_BASE_PATH = "";
}

module.exports = withBundleAnalyzer(
  withTM({
    basePath: env.NEXT_PUBLIC_BASE_PATH,
    // assetPrefix: process.env.NODE_ENV === "production" ? "/ps2/" : "",
    typescript: {
      // todo: Ignore type error for now
      ignoreBuildErrors: true,
    },
    eslint: {
      // todo: Ignore lint error for now
      ignoreDuringBuilds: true,
    },
    env,
    reactStrictMode: true,
    images: {
      domains: ["res.cloudinary.com"],
      // path: "/ps2",
    },
    webpack: (config) => {
      // config.resolve.alias = {
      //   ...config.resolve.alias,
      //   "@mui/styled-engine": "@mui/styled-engine-sc",
      // };
      if (process.env.NODE_ENV === "development") {
        // This part is needed when using zignaly-ui package locally with npm link, to avoid errors about
        // multiple versions of the same package running. (Invalid hook call)
        config.resolve.alias["react"] = path.resolve("./node_modules/react");
        config.resolve.alias["react-dom"] = path.resolve("./node_modules/react-dom");
        config.resolve.alias["@mui/material"] = path.resolve("./node_modules/@mui/material");
        // config.resolve.alias["@emotion/styled"] = path.resolve("./node_modules/@emotion/styled");
        // config.resolve.alias["@emotion/react"] = path.resolve("./node_modules/@emotion/react");
        config.resolve.alias["styled-components"] = path.resolve(
          "./node_modules/styled-components",
        );
        // Seems to fix hot reload when using linked packages
        config.resolve.symlinks = false;

        // zignaly-ui sourcemap
        config.module.rules.push({
          test: /zignaly-ui\/.+\.js$/,
          use: ["source-map-loader"],
          enforce: "pre",
        });
      }

      config.module.rules.push(
        {
          test: /\.ya?ml$/,
          type: "json",
          use: "yaml-loader",
        },
        // {
        //   test: /\.svg$/i,
        //   type: "asset",
        //   resourceQuery: /url/, // *.svg?url
        // },
        // {
        //   test: /\.svg$/i,
        //   issuer: /\.[jt]sx?$/,
        //   resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        //   use: ["@svgr/webpack"],
        // },
        // {
        //   test: /\.svg$/i,
        //   type: "asset",
        // },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"],
          // loader: "@svgr/webpack",
          // options: {
          //   exportType: "named",
          // },
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
