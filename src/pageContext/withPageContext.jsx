import React from "react";
import { IntlProvider } from "react-intl";
import PageContext from "./PageContext";
import translations from "../i18n/translations";
import { getDisplayName } from "../utils";

/**
 * HOC wrap component with page conext.
 *
 * @param {React.ComponentType<any>} Component The component to wrap.
 *
 * @returns {Function} Wrap component function.
 */
const withPageContext = (Component) => {
  /**
   * @typedef {Object} DefaultContext
   * @property {String} locale
   * @property {String} originalPath
   */

  /**
   * @typedef {Object} DefaultProps
   * @property {DefaultContext} pageContext
   * @property {String} locale
   */

  /**
   * Perform component wrapping.
   *
   * @param {DefaultProps} props Component props.
   *
   * @returns {JSX.Element} Componet JSX.
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

  WrapperComponent.displayName = `PageContext(${getDisplayName(Component)})`;

  return WrapperComponent;
};

export default withPageContext;
