// import { openExchangeConnectionView, openSettingsView } from "./src/store/actions/ui";
// import { useDispatch } from "react-redux";
const express = require(`express`);

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions;
  //   const dispatch = useDispatch();

  if (page.internalComponentName === "ComponentDev404Page") {
    return;
  }

  // Override position page route to support positionId argument.
  if (page.path.match(/^\/position\/$/)) {
    page.matchPath = "/position/:positionId";
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

  if (page.path.match(/^\/exchangeAccounts\/$/)) {
    page.matchPath = "/exchangeAccounts/";
    page.componentPath =
      "/Users/chris/Dev/Projects/zignaly-api-php/webapp2/src/pages/dashboard/positions/index.js";
    page.component =
      "/Users/chris/Dev/Projects/zignaly-api-php/webapp2/src/pages/dashboard/positions/index.js";
    console.log(page, actions);
    // createPage(page);
    // console.log(action);
    // dispatch(openExchangeConnectionView(true));
    //   createPage({ path: "/dashboard/balance/index.js" });
    createPage(page);

    return;
  }
};

// Enable development support for serving Trading View static assets. Workaround
// until a fix is implemented for:
// https://github.com/gatsbyjs/gatsby/issues/13072
exports.onCreateDevServer = ({ app }) => {
  app.use(express.static("public"));
};

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
        ],
      },
    });
  }
};
