import React from "react";
import "./ProvidersAnalyticsLayout.scss";
import getDisplayName from "../../utils/getDisplayName";
import { Box } from "@mui/material";
import FAQ from "../../components/FAQ";
import ProvidersHeader from "../../components/Providers/ProvidersHeader";

/**
 * HOC wrap component with copy traders layout.
 *
 * @param {React.ComponentType<any>} Component The component to wrap.
 *
 * @returns {Function} Wrap component function.
 */
const withProvidersAnalyticsLayout = (Component) => {
  /**
   * @typedef {Object} WithSignalProvidersAnalyticsPropsType
   * @property {string} path Providers page path.
   */

  /**
   * Perform component wrapping.
   *
   * @param {WithSignalProvidersAnalyticsPropsType} props Default params.
   *
   * @returns {JSX.Element} Component JSX.
   */
  const WrapperComponent = (props) => {
    return (
      <Box
        alignItems="flex-start"
        className="providersAnalyticsLayout"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <ProvidersHeader path={props.path} />
        <Box className="pageContent">
          <Component {...props} />
        </Box>
        <Box className="faq">
          <FAQ />
        </Box>
      </Box>
    );
  };
  WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;
  return WrapperComponent;
};

export default withProvidersAnalyticsLayout;
