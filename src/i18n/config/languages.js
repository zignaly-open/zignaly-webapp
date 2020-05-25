/**
 * @typedef {Object} LocalizationLanguage
 * @property {String} locale
 * @property {String} label
 * @property {Boolean=} default
 * @property {Object<string, string>} routes
 */

/**
 * @type {Array<LocalizationLanguage>} LocalizationLanguages
 */
const LocalizationLanguages = [
  {
    locale: "cs",
    label: "Čeština",
    routes: {
      "/": "/",
      "/login": "prihlasit-se",
      "/dashboard/balance": "/dashboard/balance",
      "/dashboard/positions": "/dashboard/positions",
      "/dashboard/connectedTraders": "/dashboard/connectedTraders",
      "/copyTraders/browse": "/copyTraders/browse",
      "/copyTraders/analytics": "/copyTraders/analytics",
      "/signalProviders/browse": "/signalProviders/browse",
      "/signalProviders/analytics": "/signalProviders/analytics",
      "/tradingTerminal": "/tradingTerminal",
      "/subpage/page1": "/podstranka/stranka1",
      "/subpage/subsubpage/page1": "/podstranka/podpodstranka/stranka1",
    },
  },
  {
    default: true,
    locale: "en",
    label: "English",
    routes: {
      "/": "/",
      "/login": "/login",
      "/dashboard/balance": "/dashboard/balance",
      "/dashboard/positions": "/dashboard/positions",
      "/dashboard/connectedTraders": "/dashboard/connectedTraders",
      "/copyTraders/browse": "/copyTraders/browse",
      "/copyTraders/analytics": "/copyTraders/analytics",
      "/signalProviders/browse": "/signalProviders/browse",
      "/signalProviders/analytics": "/signalProviders/analytics",
      "/tradingTerminal": "/tradingTerminal",
      "/subpage/page1": "/subpage/page1",
      "/subpage/subsubpage/page1": "/subpage/subsubpage/page1",
    },
  },
];

module.exports = LocalizationLanguages;
