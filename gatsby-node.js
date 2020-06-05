const express = require(`express`);

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions;

  if (page.internalComponentName === "ComponentDev404Page") {
    return;
  }

  // Override position page route to support positionId argument.
  if (page.path.match(/^\/position\/$/)) {
    page.matchPath = "/position/:positionId";
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
