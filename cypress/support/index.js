// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Dark mode
import "cypress-dark";

import "@cypress/code-coverage/support";

// Define a proxy method for mirage
// Cypress.on("window:before:load", (win) => {
//   win.handleFromCypress = (request) => {
//     return fetch(request.url, {
//       method: request.method,
//       headers: request.requestHeaders,
//       body: request.requestBody,
//     }).then((res) => {
//       let content = res.headers.get("content-type").includes("application/json")
//         ? res.json()
//         : res.text();
//       return new Promise((resolve) => {
//         content.then((body) => resolve([res.status, res.headers, body]));
//       });
//     });
//   };
// });
