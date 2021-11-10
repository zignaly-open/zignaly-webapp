const appStage = process.env.STAGE || "dev";
require("dotenv").config({
  path: `.env.${appStage}`,
});

// Set base path into environment variable that components can access.
process.env.GATSBY_BASE_PATH = process.env.NODE_ENV === "production" ? "/app" : "";
process.env.GATSBY_BUILD_MODE = process.env.NODE_ENV || "dev";

// eslint-disable-next-line no-console
console.log("\nTRADE API URL:", process.env.GATSBY_TRADEAPI_URL, "\n\n");

module.exports = {
  // This only works on prod build so currently is not possible to use app path
  // on develop mode, see issue: https://github.com/gatsbyjs/gatsby/issues/3721
  pathPrefix: "/app",
  siteMetadata: {
    title: "Zignaly Gatsby Starter",
    description: "Zignaly the copy-trader platform.",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-sass",
      options: {
        additionalData: `@import "${__dirname}/src/styles/index";`,
      },
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-layout",
      options: {},
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/logo/logoIcon.svg",
      },
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: process.env.GATSBY_GTM_ID,
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,
        defaultDataLayer: { platform: "webapp2" },
        routeChangeEventName: "route_change",
      },
    },
    {
      // Generate mui styles for server side rendering
      resolve: "gatsby-plugin-material-ui",
      //   options: {
      //     stylesProvider: {
      //       injectFirst: true,
      //     },
      //   },
    },
    {
      resolve: "gatsby-plugin-tsconfig-paths",
      options: {},
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.inline\.svg$/,
        },
      },
    },
    {
      resolve: "gatsby-plugin-newrelic",
      options: {
        configs: {
          test: {
            instrumentationType: "proAndSPA",
            accountId: "3238823",
            trustKey: "3238823",
            agentID: "32253586",
            licenseKey: "NRJS-ac29673573719df2357",
            applicationID: "242080714",
            beacon: "bam.eu01.nr-data.net",
            errorBeacon: "bam.eu01.nr-data.net",
          },
          staging: {
            instrumentationType: "proAndSPA",
            accountId: "3238823",
            trustKey: "3238823",
            agentID: "32253586",
            licenseKey: "NRJS-ac29673573719df2357",
            applicationID: "242080714",
            beacon: "bam.eu01.nr-data.net",
            errorBeacon: "bam.eu01.nr-data.net",
          },
          prod: {
            instrumentationType: "proAndSPA",
            accountId: "3238823",
            trustKey: "3238823",
            agentID: "32253586",
            licenseKey: "NRJS-ac29673573719df2357",
            applicationID: "242080714",
            beacon: "bam.eu01.nr-data.net",
            errorBeacon: "bam.eu01.nr-data.net",
          },
        },
      },
    },
  ],
};
