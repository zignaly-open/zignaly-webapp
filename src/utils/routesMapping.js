export const routesMapping = (path) => {
  let name = path.split("/")[1]
  let identifier = "!"

    switch(name){
        case "dashboard":
          return {
            title: "dashboard",
            name: name,
            links: [
              {
                name: "Positions",
                to: "/dashboard/positions",
              },
              {
                name: "Balance",
                to: "/dashboard/balance",
              },
              {
                name: "Connected traders",
                to: "/dashboard/connectedTraders",
              },
            ]
          }
        case "copyTrders":
          return {
            title: "copy traders",
            name: name,
            links: [
              {
                name: "Browse",
                to: "/copyTraders/browse",
              },
              {
                name: "Analytics",
                to: "/copyTraders/analytics",
              }
            ]
          }
        case "signalProviders":
          return {
            title: "signal Providers",
            name : name,
            links: [
              {
                name: "Browse",
                to: "/signalProviders/browse",
              },
              {
                name: "Analytics",
                to: "/signalProviders/analytics",
              }
            ]
          }
        case "copyTrader":
          return {
            title: "copy trader",
            name: name,
            links: [
              {
                name: "Profile",
                to: `/copyTrader/${identifier}/positions`,
              },
              {
                name: "Analytics",
                to: `/copyTrader/${identifier}/positions`,
              },
              {
                name: "Positions",
                to: `/copyTrader/${identifier}/positions`,
              },
            ]
          }
        case "signalProvider":
          return {
            title: "signal Provider",
            name: name,
            links: [
              {
                name: "Profile",
                to: `/copyTrader/${identifier}/positions`,
              },
              {
                name: "Analytics",
                to: `/copyTrader/${identifier}/positions`,
              },
              {
                name: "Positions",
                to: `/copyTrader/${identifier}/positions`,
              },
            ]
          }
        default:
          return {
            title: "Dashboard",
            name: name,
            links: [
              {
                name: "Positions",
                to: "/dashboard/positions",
              },
              {
                name: "Balance",
                to: "/dashboard/balance",
              },
              {
                name: "Connected traders",
                to: "/dashboard/connectedTraders",
              },
            ]
          }

    }
}