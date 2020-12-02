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

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const { styles } = require("@ckeditor/ckeditor5-dev-utils");
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const svgCKEditorRegex = /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/;

exports.onCreateWebpackConfig = ({ stage, loaders, actions, getConfig }) => {
  const config = getConfig();

  /**
   * Modify gatsby generated webpack config to support building ckEditor from source.
   * https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html#integrating-ckeditor-5-built-from-source
   */

  config.module.rules.forEach((rule) => {
    if (rule.oneOf) {
      rule.oneOf.forEach((subRule) => {
        if ([String(cssRegex), String(cssModuleRegex)].includes(String(subRule.test))) {
          if (!subRule.exclude) subRule.exclude = [];
          subRule.exclude.push(/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/);
        }
      });
    } else if (String(rule.test).includes("svg")) {
      if (!rule.exclude) rule.exclude = [];
      rule.exclude.push(svgCKEditorRegex);
    }
  });

  config.module.rules.push(
    {
      test: svgCKEditorRegex,
      use: ["raw-loader"],
    },
    {
      test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
      use: [
        {
          loader: "style-loader",
          options: {
            injectType: "singletonStyleTag",
            attributes: {
              "data-cke": true,
            },
          },
        },
        {
          loader: "postcss-loader",
          options: styles.getPostCssConfig({
            themeImporter: {
              themePath: require.resolve("@ckeditor/ckeditor5-theme-lark"),
            },
            minify: true,
          }),
        },
      ],
    },
  );

  if (stage === "build-html") {
    // Fix WebpackError: ReferenceError: window is not defined
    // https://www.gatsbyjs.org/docs/debugging-html-builds/
    config.module.rules.push(
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
      {
        test: /canvas/,
        use: loaders.null(),
      },
    );
  }

  config.plugins.push(new CaseSensitivePathsPlugin());
  config.resolve.plugins.push(new TsconfigPathsPlugin({ extensions: [".js", ".ts", ".tsx"] }));
  // eslint-disable-next-line no-console
  console.log("Webpack build config updated");
  //   console.log(JSON.stringify(config.module.rules, null, 2));
  //   console.log(
  //     config.module.rules.map((c) =>
  //       c.oneOf ? c.oneOf.map((c2) => String(c2.test)) : String(c.test),
  //     ),
  //   );
  actions.replaceWebpackConfig(config);
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

const express = require("express");

// Enable development support for serving HTML from `./static` folder
exports.onCreateDevServer = ({ app }) => {
  app.use(express.static("static"));
};
