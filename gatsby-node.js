/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  if (page.internalComponentName === "ComponentDev404Page") {
    deletePage(page);
    return;
  }

  // Override position page route to support positionId argument.
  if (page.path.match(/^\/position\/$/)) {
    page.matchPath = "/position/:positionId";
    createPage(page);
    return;
  }
  // Override position page route to support positionId argument.
  if (page.path.match(/^\/recover\/$/)) {
    page.matchPath = "/recover/:token";
    createPage(page);
    return;
  }
  // Override position page route to support positionId argument.
  if (page.path.match(/^\/copyTraders\/$/)) {
    page.matchPath = "/copyTraders/*";
    createPage(page);
    return;
  }
  // Override position page route to support positionId argument.
  if (page.path.match(/^\/signalProviders\/$/)) {
    page.matchPath = "/signalProviders/*";
    createPage(page);
    return;
  }
};

// Enable development support for serving Trading View static assets. Workaround
// until a fix is implemented for:
// https://github.com/gatsbyjs/gatsby/issues/13072
// exports.onCreateDevServer = ({ app }) => {
//   const express = require(`express`);
//   app.use(express.static("public"));
// };

const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
// Fix WebpackError: ReferenceError: window is not defined
// https://www.gatsbyjs.org/docs/debugging-html-builds/
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /charting_library/,
            use: loaders.null(),
          },
          {
            test: /react-rte/,
            use: loaders.null(),
          },
          {
            test: /roundedBarCharts/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  actions.setWebpackConfig({
    plugins: [new CaseSensitivePathsPlugin()],
  });
};

exports.onCreateBabelConfig = ({ actions }) => {
  // https://material-ui.com/guides/minimizing-bundle-size/
  actions.setBabelPlugin({
    name: "babel-plugin-transform-imports",
    options: {
      "@material-ui/core": {
        transform: "@material-ui/core/esm/${member}",
        preventFullImport: true,
      },
      "@material-ui/lab": {
        transform: "@material-ui/lab/esm/${member}",
        preventFullImport: true,
      },
      "@material-ui/icons": {
        transform: "@material-ui/icons/esm/${member}",
        preventFullImport: true,
      },
      lodash: {
        transform: "lodash/${member}",
        preventFullImport: true,
      },
    },
  });
};
