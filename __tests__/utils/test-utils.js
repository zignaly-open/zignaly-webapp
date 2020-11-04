import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { store } from "../../src/store/store";
import translations from "../../src/i18n/translations";

function render(ui, { locale = "en", ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return (
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
