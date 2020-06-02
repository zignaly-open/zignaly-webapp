import React from "react";
import "./providersAnalyticsLayout.scss";
import { getDisplayName } from "../../utils";
import { Box } from "@material-ui/core";
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
   * Perform component wrapping.
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
