export const routesMapping = (path) => {
  let id = path.split("/")[1]
  let identifier = "1"

    switch(id){
        case "dashboard":
          return {
            title: "dashboard",
            id: id,
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
            id: id,
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
            id : id,
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
            id: id,
            links: [
              {
                name: "Profile",
                to: `/copyTrader/profile`,
              },
              {
                name: "Analytics",
                to: `/copyTrader/analytics`,
              },
              {
                name: "Positions",
                to: `/copyTrader/positions`,
              },
            ]
          }
        case "signalProvider":
          return {
            title: "signal Provider",
            id: id,
            links: [
              {
                name: "Profile",
                to: `/signalProvider/positions`,
              },
              {
                name: "Analytics",
                to: `/signalProvider/positions`,
              },
              {
                name: "Positions",
                to: `/signalProvider/positions`,
              },
            ]
          }
        default:
          return {
            title: "Dashboard",
            id: id,
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