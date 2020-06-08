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
