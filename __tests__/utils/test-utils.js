import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { store } from "../../src/store/store";
import translations from "../../src/i18n/translations";

/**
 * Wrap ui with react-intl and react-redux providers
 * @param {React.ReactElement} ui Element to render
 * @param {*} Options Render params
 * @returns {React.ReactNode} New element
 */
function render(ui, { locale = "en", ...renderOptions } = {}) {
  /**
   * Wrap ui with react-intl and react-redux providers
   * @param {{children: React.ReactNode}} props Props
   * @returns {React.ReactNode} New element
   */
  function Wrapper({ children }) {
    return (
      // react-intl with english translations.
      // It's possible to drop the translations and display the ids only, by using onError={myCustomErrorFunction}
      <IntlProvider locale={locale} messages={translations.en}>
        <Provider store={store}>{children}</Provider>
      </IntlProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { render };
