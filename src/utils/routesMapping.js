/**
 * @typedef {Object} NavigationLink Navigation link object.
 * @property {string} id Link ID.
 * @property {string} to Link path.
 */

/**
 * @typedef {Object} SectionNavigation Section navigation object.
 * @property {string} [subtitleId] Section subtitle.
 * @property {string} [subtitle2Id] Section subtitle 2.
 * @property {string} id Section ID.
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
        subtitleId: "copyTraders.subtitle",
        subtitle2Id: "copyTraders.subtitle2",
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
        title: "copy trader",
        id: id,
        links: [
          {
            name: "Profile",
            to: "/copyTrader/profile",
          },
          {
            name: "Analytics",
            to: "/copyTrader/analytics",
          },
          {
            name: "Positions",
            to: "/copyTrader/positions",
          },
        ],
      };
    case "signalProvider":
      return {
        title: "signal Provider",
        id: id,
        links: [
          {
            name: "Profile",
            to: "/signalProvider/positions",
          },
          {
            name: "Analytics",
            to: "/signalProvider/positions",
          },
          {
            name: "Positions",
            to: "/signalProvider/positions",
          },
        ],
      };
    default:
      return {
        id: id,
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
