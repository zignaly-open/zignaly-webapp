const appStage = process.env.STAGE || "dev";
require("dotenv").config({
  path: `.env.${appStage}`,
});

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
        data: `@import "${__dirname}/src/styles/index";`,
      },
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-purgecss",
      options: {
        printRejected: true,
        // Enable while using `gatsby develop`
        develop: true,
      },
    },
  ],
};
