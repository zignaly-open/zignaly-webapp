/**
 *
 * @typedef {import('../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 */
/**
 * @typedef {Object} NavigationLink Navigation link object.
 * @property {string} id Link ID.
 * @property {string} to Link path.
 */

/**
 * @typedef {Object} SectionNavigation Section navigation object.
 * @property {string} id Section ID.
 * @property {string} subtitleId Section subtitle.
 * @property {string} subtitle2Id Section subtitle 2.
 * @property {Array<NavigationLink>} links Section navigation links.
 */

/**
 * Map path to section navigation object.
 *
 * @param {string} path Path to map section links for.
 * @returns {SectionNavigation} A section navigation object.
 */
export const routesMapping = (path) => {
  let id = path.split("/")[1];

  switch (id) {
    case "dashboard":
      return {
        id: id,
        subtitleId: "",
        subtitle2Id: "",
        links: [
          {
            id: "dashboard.positions",
            to: "/dashboard/positions",
          },
          {
            id: "dashboard.balance",
            to: "/dashboard/balance",
          },
          {
            id: "dashboard.traders",
            to: "/dashboard/connectedTraders",
          },
        ],
      };
    case "copyTraders":
      return {
        id: "menu.copytraders",
        subtitleId: "copyt.subtitle",
        subtitle2Id: "",
        links: [
          {
            id: "srv.browse",
            to: "/copyTraders/browse",
          },
          {
            id: "srv.analytics",
            to: "/copyTraders/analytics",
          },
        ],
      };
    case "signalProviders":
      return {
        id: "menu.signalproviders",
        subtitleId: "signalp.subtitle",
        subtitle2Id: "signalp.subtitle2",
        links: [
          {
            id: "srv.browse",
            to: "/signalProviders/browse",
          },
          {
            id: "srv.analytics",
            to: "/signalProviders/analytics",
          },
        ],
      };
    case "copyTrader":
      return {
        id: "",
        subtitleId: "",
        subtitle2Id: "",
        links: [
          {
            id: "srv.profile",
            to: "/copyTrader/profile",
          },
          {
            id: "srv.analytics",
            to: "/copyTrader/analytics",
          },
          {
            id: "srv.positions",
            to: "/copyTrader/positions",
          },
        ],
      };
    case "signalProvider":
      return {
        id: "",
        subtitleId: "",
        subtitle2Id: "",
        links: [
          {
            id: "srv.profile",
            to: "/signalProvider/positions",
          },
          {
            id: "srv.analytics",
            to: "/signalProvider/positions",
          },
          {
            id: "srv.positions",
            to: "/signalProvider/positions",
          },
        ],
      };
    default:
      return {
        id: "dashboard",
        subtitleId: "",
        subtitle2Id: "",
        links: [
          {
            id: "dashboard.positions",
            to: "/dashboard/positions",
          },
          {
            id: "dashboard.balance",
            to: "/dashboard/balance",
          },
          {
            id: "dashboard.traders",
            to: "/dashboard/connectedTraders",
          },
        ],
      };
  }
};

/**
 * Map path to section navigation object.
 *
 * @param {String} providerId Id of the opened copyTrader.
 * @param {DefaultProviderGetObject} provider Path to map section links for.
 * @returns {SectionNavigation} A section navigation object.
 */

export const createTraderRoutes = (providerId, provider) => {
  if (providerId) {
    let data = {
      id: "providerProfile",
      subtitleId: "",
      subtitle2Id: "",
      links: [
        {
          id: "srv.profile",
          to: `/copyTraders/${provider.id}/profile`,
        },
        {
          id: "srv.analytics",
          to: `/copyTraders/${provider.id}/analytics`,
        },
        {
          id: "srv.positions",
          to: `/copyTraders/${provider.id}/positions`,
        },
      ],
    };
    if (provider.isAdmin) {
      if (!provider.isClone) {
        data.links.push({
          id: "srv.edit",
          to: `/copyTraders/${provider.id}/edit`,
        });
        data.links.push({
          id: "srv.users",
          to: `/copyTraders/${provider.id}/users`,
        });
        data.links.push({
          id: "srv.management",
          to: `/copyTraders/${provider.id}/management`,
        });
      }
    }
    return data;
  }
  return {
    id: "providerProfile",
    subtitleId: "",
    subtitle2Id: "",
    links: [
      {
        id: "srv.profile",
        to: `/copyTraders/${provider.id}/profile`,
      },
      {
        id: "srv.analytics",
        to: `/copyTraders/${provider.id}/analytics`,
      },
      {
        id: "srv.positions",
        to: `/copyTraders/${provider.id}/positions`,
      },
    ],
  };
};

/**
 * Map path to section navigation object.
 *
 * @param {String} providerId ID of the opened signalProvider.
 * @param {DefaultProviderGetObject} provider Path to map section links for.
 * @returns {SectionNavigation} A section navigation object.
 */
export const createProviderRoutes = (providerId, provider) => {
  if (providerId) {
    let data = {
      id: "providerProfile",
      subtitleId: "",
      subtitle2Id: "",
      links: [
        {
          id: "srv.profile",
          to: `/signalProviders/${provider.id}/profile`,
        },
        {
          id: "srv.analytics",
          to: `/signalProviders/${provider.id}/analytics`,
        },
        {
          id: "srv.settings",
          to: `/signalProviders/${provider.id}/settings`,
        },
      ],
    };
    if (provider.isAdmin) {
      if (!provider.isClone) {
        data.links.push({
          id: "srv.edit",
          to: `/signalProviders/${provider.id}/edit`,
        });
        data.links.push({
          id: "srv.users",
          to: `/signalProviders/${provider.id}/users`,
        });
      }
    }
    return data;
  }

  return {
    id: "providerProfile",
    subtitleId: "",
    subtitle2Id: "",
    links: [
      {
        id: "srv.profile",
        to: `/signalProviders/${provider.id}/profile`,
      },
      {
        id: "srv.analytics",
        to: `/signalProviders/${provider.id}/analytics`,
      },
      {
        id: "srv.settings",
        to: `/signalProviders/${provider.id}/settings`,
      },
    ],
  };
};
