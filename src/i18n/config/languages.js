module.exports = [
    {
        locale: "cs",
        label: "Čeština",
        routes: {
            "/": "/",
            "/login": "prihlasit-se",
            "/dashboard": "/dashboard",
            "/copyTraders": "/copyTraders",
            "/signalProviders": "/signalProviders",
            "/tradingTerminal": "/tradingTerminal",
            "/page1": "/stranka1",
            "/subpage/page1": "/podstranka/stranka1",
            "/subpage/subsubpage/page1": "/podstranka/podpodstranka/stranka1"
        }
    },
    {
        default: true,
        locale: "en",
        label: "English",
        routes: {
            "/": "/",
            "/login": "/login",
            "/dashboard": "/dashboard",
            "/copyTraders": "/copyTraders",
            "/signalProviders": "/signalProviders",
            "/tradingTerminal": "/tradingTerminal",
            "/page1": "/page1",
            "/subpage/page1": "/subpage/page1",
            "/subpage/subsubpage/page1": "/subpage/subsubpage/page1"
        }
    }
];
