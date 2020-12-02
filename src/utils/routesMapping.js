/**
 *
 * @typedef {import('../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import('../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */
/**
 * @typedef {Object} NavigationLink Navigation link object.
 * @property {string} id Link ID.
 * @property {string} to Link path.
 * @property {string|JSX.Element} [tooltip] Notification flag for user about something.
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
            to: "/dashboard",
          },
          {
            id: "dashboard.balance",
            to: "/dashboard/balance",
          },
          {
            id: "srv.analytics",
            to: "/dashboard/analytics",
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
            to: "/copyTraders",
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
            to: "/signalProviders",
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
            to: "/copyTrader",
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
            to: "/dashboard",
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
          to: `/copyTraders/${provider.id}`,
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

    data.links.push({
      id: "srv.newsfeed",
      to: `/copyTraders/${provider.id}/feed`,
    });

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
        to: `/copyTraders/${provider.id}`,
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
 * @param {DefaultProviderGetObject} provider Provider entity.
 * @param {ExchangeConnectionEntity} selectedExchange Selected exchange account.
 * @returns {SectionNavigation} A section navigation object.
 */
export const createProviderRoutes = (providerId, provider, selectedExchange) => {
  if (providerId) {
    let data = {
      id: "providerProfile",
      subtitleId: "",
      subtitle2Id: "",
      links: [
        {
          id: "srv.profile",
          to: `/signalProviders/${provider.id}`,
        },
        {
          id: "srv.analytics",
          to: `/signalProviders/${provider.id}/analytics`,
        },
      ],
    };

    if (!provider.isClone) {
      data.links.push({
        id: "srv.newsfeed",
        to: `/signalProviders/${provider.id}/feed`,
      });
    }

    if (!provider.disable && provider.exchangeInternalId === selectedExchange.internalId) {
      data.links.push({
        id: "srv.settings",
        to: `/signalProviders/${provider.id}/settings`,
      });
    }

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
        to: `/signalProviders/${provider.id}`,
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
