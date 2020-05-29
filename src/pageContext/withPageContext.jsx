import React from "react";
import { IntlProvider } from "react-intl";
import PageContext from "./PageContext";
import translations from "../i18n/translations";
import { getDisplayName } from "../utils";
import useStoreSettingsSelector from "../hooks/useStoreSettingsSelector";

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
   */

  /**
   * @typedef {Object} DefaultProps
   * @property {DefaultContext} pageContext
   */

  /**
   * Perform component wrapping.
   *
   * @param {DefaultProps} props Component props.
   *
   * @returns {JSX.Element} Componet JSX.
   */
  const WrapperComponent = (props) => {
    const storeSettings = useStoreSettingsSelector();

    return (
      <IntlProvider
        locale={storeSettings.languageCode}
        messages={translations[storeSettings.languageCode]}
      >
        <PageContext.Provider value={{ locale: storeSettings.languageCode }}>
          <Component {...props} />
        </PageContext.Provider>
      </IntlProvider>
    );
  };

  WrapperComponent.displayName = `PageContext(${getDisplayName(Component)})`;

  return WrapperComponent;
};

export default withPageContext;
