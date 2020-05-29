import React from "react";
import { IntlProvider } from "react-intl";
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
   * @typedef {Object} DefaultProps
   * @property {Object} pageContext
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
        <Component {...props} />
      </IntlProvider>
    );
  };

  WrapperComponent.displayName = `PageContext(${getDisplayName(Component)})`;

  return WrapperComponent;
};

export default withPageContext;
