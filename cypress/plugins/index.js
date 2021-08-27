/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const dotenvPlugin = require("cypress-dotenv");

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  require("@cypress/code-coverage/task")(on, config);

  // Detect proper env file but it currently only works with dev env
  const appStage = process.env.STAGE || "dev";

  // Assign env variables to cypress config
  config = dotenvPlugin(
    config,
    {
      path: `.env.${appStage}`,
    },
    true,
  );

  // Skip examples
  config.ignoreTestFiles = "**/examples/*.spec.js";

  return config;
};
