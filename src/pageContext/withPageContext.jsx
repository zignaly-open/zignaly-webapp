import React from "react";
import { IntlProvider } from "react-intl";
import PageContext from "./PageContext";
import translations from "../i18n/translations";
import { getDisplayName } from "../utils";

/**
 *
 * @param {import("../utils/getDisplayName").WrappedComponentType} Component
 * @returns {Object} Component.
 */

const withPageContext = (Component) => {
  /**
   *
   * @typedef {Object} DefaultContext
   * @property {String} locale
   */

  /**
   *
   * @typedef {Object} DefaultProps
   * @property {DefaultContext} pageContext
   * @property {String} locale
   */

  /**
   *
   * @param {DefaultProps} props Component props.
   */
  const WrapperComponent = (props) => {
    const { pageContext } = props;
    const { locale } = pageContext;

    return (
      <IntlProvider locale={locale} messages={translations[locale]}>
        <PageContext.Provider value={props.pageContext}>
          <Component {...props} />
        </PageContext.Provider>
      </IntlProvider>
    );
  };
  /** */
  WrapperComponent.displayName = `PageContext(${getDisplayName(Component)})`;
  return WrapperComponent;
};

export default withPageContext;
