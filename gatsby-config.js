require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

// eslint-disable-next-line no-console
console.log("TRADE API URL:", process.env);
// eslint-disable-next-line no-console
console.log("===========================");

module.exports = {
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
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "gatsby-starter-default",
        short_name: "Zignaly",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        // This path is relative to the root of the site.
        icon: "src/images/gatsby-icon.png",
      },
    },
    {
      resolve: "gatsby-plugin-purgecss",
      options: {
        printRejected: true,
        // Enable while using `gatsby develop`
        develop: true,
      },
    },
    {
      resolve: "gatsby-plugin-react-css-modules",
      options: {
        filetypes: {
          ".scss": { syntax: "postcss-scss" },
        },
        // Exclude global styles from the plugin using a RegExp:
        exclude: "\/global\/",
      },
    },
    {
      resolve: "gatsby-plugin-eslint",
      options: {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|.cache|public)/,
        stages: ["develop"],
        options: {
          emitWarning: true,
          failOnError: false,
        },
      },
    },
    {
      resolve: "gatsby-plugin-ts",
      options: {
        // TODO: Disable until all contrib packages data types are resolved.
        typeCheck: false,
        failOnError: true,
        codegen: true,
      }
    }
  ],
};
