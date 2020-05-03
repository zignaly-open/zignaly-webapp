<p align="center">
  <a href="https://www.gatsbyjs.org">
    <img alt="Gatsby" src="https://www.gatsbyjs.org/monogram.svg" width="60" />
  </a>
</p>

# Gatsby Starter Internationalized

Gatsby v2 starter based on [gatsby-starter-intl](https://github.com/tomekskuta/gatsby-starter-intl).

[Checkout the demo!](https://gatsby-starter-internationalized.ack.ee)

## Features

-   **internationalized page content** - via `react-intl`
-   **internationalized routes** - via language configuration
-   **lightweight** - includes only internationalization code

-   `LocalizedLink` - built-in link component handling route generation
-   `LanguageSwitcher` - built-in language switcher component

**The starter includes only code important for internationalization, the rest is up to you**

## How to start

To use **Gatsby** you have to install Gatsby CLI

```sh
npm install global gatsby-cli
```

Then use it to start new project based on **gatsby-starter-internationalized**

```sh
gatsby new your-project-name https://github.com/AckeeCZ/gatsby-starter-internationalized
cd your-project-name/
gatsby develop
```

Your site is running at `localhost:8000`.

If you want to compile production build just run `gatsby build`.

## How it works

Gatsby creates **static pages** for every language sets in the configuration in [src/i18n/config/languages.js](src/i18n/config/languages.js).

Say you have two languages:

-   `cs` ,
-   `en` and is a default language,

Gatsby then creates:

-   `/cs/stranka1`,
-   `/page1`, 

names depend on your configuration.

### Translations

Translations are set in [src/i18n/translations](src/i18n/translations). We use flat structure set in yaml files. There should be a yaml file for every language (`cs.yaml`, `en.yaml` etc.)

```jsx
<FormattedMessage id="home.title" />
```

Translation is in `src/i18n/translations/en.yaml` and looks like:

```yaml
home.title: "Homepage"
```

### Languages

Language list is in [src/i18n/config/languages.js](src/i18n/config/languages.js). Elements of array have following attributes:

-   locale - a key to identify your locale,
-   label - a locale name,
-   default - a flag if the language is default (routes won't be prepend with locale),
-   routes - an object with translations for app routes,

Example:

```js
{
        locale: "cs",
        label: "Čeština",
        routes: {
            "/": "/",
            "/page1": "/stranka1",
            "/subpage/page1": "/podstranka/stranka1",
        }
    },
    {
        locale: "en",
        label: "English",
        default: true,
        routes: {
            "/": "/",
            "/page1": "/page1",
            "/subpage/page1": "/subpage/page1",
        }
    },
```

### React Intl locales
Don't forget to add `react-intl` locales for your languages in [src/i18n/config/reactIntl.js](src/i18n/config/reactIntl.js).

### PageContext
`PageContext` includes `locale` and `originalPath` you can use in your pages. It is used by `LocalizedLink` to create correct link and by `LanguageSwitcher` to switch to correct language version of a page.

`withPageContext` wraps your page with `react-intl` provider and our own `PageContext` provider.

```jsx
// src/pages/my-page.jsx

import withPageContext from "../pageContext";

const IndexPage = ({ intl }) => (
    <React.Fragment>
        <h1>
            <FormattedMessage id="home.title" />
        </h1>
    </React.Fragment>
);

export default withPageContext(IndexPage);
```

## Contributing

If you have any question, see bugs or you think some feature can be written better - just open pull request or issue. I will be happy to help and learn from you.

## License

[MIT](https://opensource.org/licenses/MIT)
