const appStage = process.env.STAGE || "dev";
require("dotenv").config({
  path: `.env.${appStage}`,
});

process.env.GATSBY_BUILD_MODE = process.env.NODE_ENV || "dev";

// eslint-disable-next-line no-console
console.log("\nTRADE API URL:", process.env.GATSBY_TRADEAPI_URL, "\n\n");

module.exports = {
  pathPrefix: "/",
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
  ],
};
