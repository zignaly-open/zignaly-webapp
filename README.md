# Zignaly Crypto Trading Webapp

This is the official webapp of the crypto copy trading Zignaly platform.

## Features

- Copy trading from expert traders.
- Advanced analytics from copy trader providers to support smart providers selection based on historical results.
- Signal providers that allow you to rely on entry/exit signals from experts but cutomizing your risk management strategy.
- Dashboard to monitor your positions and balance.
- Profit/Losses analytics to evaluate the performance of your investments.
- Connect multiples exchanges accounts from Binance and KuCoin.
- Create Zignaly exchange account to centralize management of all your assets at Zignaly.
- Become a copy trader or trading signals provider in Zignaly traders community.
- Manage your copy trader service followers and evaluate your trading performance.
- Trade with manually through our powerful trading terminal that support long/short positions, stop loss, trailing stop, take profit targets, rebuy/DCA targets and time expiration / close.
- Customize notifications, profile and security preferences.

## Webapp foundations

We crafted this app using Gatsby https://github.com/gatsbyjs/gatsby, a modern web framework based in React that provides out of the box performance optimization to bring blazing fast experience to our traders community.

We use standard and modern webapp toolset:

- Jest for automated testing.
- Material UI components for UI.
- SASS and Material UI theme for styling.
- ESLint and Stylelint to encourage code standards.
- JSDoc for classes, functions and component documentation.
- JSDoc types for Typescript data types definition and static analysis checks.
- Redux for state management.
- Lodash as our general JS utilities to simplify code simplicity and readability.
- React Intl for UI internationalization https://formatjs.io/docs/react-intl/#the-react-intl-module
- Material UI icons and React Feather for our icons UI.
- Moment JS https://github.com/moment/moment for dates parsing / formatting.
- ChartJS https://github.com/chartjs/Chart.js for our analytics / performance charts.
- Trade API Client, is a JS implementation of Zignaly Trade API client that allow you to control copy trader / signal provider subscriptions, statistics, positions management, balance, withdraw, settings among other stuff at your Zignaly account. You can find the implementation at `src/services/tradeApiClient.js`

Code organization:

- All the custom source code is located at `src` directory.
  - `components` - Our React UI custom components.
  - `hooks` - React hooks for data fetch, access to data store, modals, validations, effects and other reusable logic.
  - `i18n` - UI internationalization configuration: languages and UI literals.
  - `images` - UI images assets.
  - `layouts` - Pages layouts.
  - `pageContext` - React context providers.
  - `pages` - Gatsby pages that are render at build process in server side, few of them contains dynamic routing those ones are render only on client side.
  - `reducers` - Redux reducers, we organize the state in 5 groups: session, settings, UI, user and views.
  - `services` - Services clients/functions to integrate with other APIs like Zignaly Trade API, Timezone service or custom MUI theme.
  - `store` - Redux store provider, initial state data and schema definition and action creators.
  - `styles` - SASS global styles and mixins.
  - `utils` - All our JS utility functions that are reusable in many components, mostly formatters, validations, data mapping, lookup and calculations.
- The automated tests are located at `__tests__` directory.

## How to setup a local environment

We assume you have NodeJS v10 or v12 installed in your local environment. Checkout this repository and once you are at develop branch install dependencies:

```sh
npm i
```

Then start gatsby develop server:

```sh
STAGE=test npm run develop
```

The webapp is now running at `localhost:3000`. In order to login to the private area pages you will need to create a Zignaly account at https://zignaly.com/app/signup

Once you have a username and password you will be able to login and start browsing copy traders and signal providers pages. To create and manage positions you will need to connect a Binance or KuCoin exchange or preferably for development purposes we recommend you to connect a paper trading exchange that you can use to experiment with trading without risk real money.

## Contributing

If you find any bug or would like to suggest a feature you can open a new issue at Github https://github.com/zignaly-open/zignaly-webapp/issues Once you receive our feedback you can start working in the implementation and provide a pull request that will be reviewed by our development core team.

The PR should pass our quality checks and automated tests in order to be approved. You can validate that your code is passing by looking at the Github pull request automatic checks section. Take into account that tests are executed automatically by our Github Actiosn check workflow and that cannot be validated locally due to the fact that requires many complex state conditions that are hard to replicate in new trading accounts. However you can validate code standard checks:

```sh
npm run checkall
```

This command execute the ESLint, StyleLint and Typescript checks and inform you if there is any violation in your local branch.

## License

[MIT](https://opensource.org/licenses/MIT)
