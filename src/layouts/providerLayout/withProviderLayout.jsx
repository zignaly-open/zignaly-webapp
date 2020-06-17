import React from "react";
import "./providerLayout.scss";
import { getDisplayName } from "../../utils";
import { Box } from "@material-ui/core";
import ProviderHeader from "../../components/Provider/ProviderHeader";
import FAQ from "../../components/FAQ";

/**
 * HOC wrap component with provider layout.
 *
 * App layout is defined here, the placement of header, sidebar, mobile appbar.
 *
 * @param {React.ComponentType<any>} Component The component to wrap.
 *
 * @returns {Function} Wrap component function.
 */
const withProviderLayout = (Component) => {
  /**
   * @param {Object} props Default params.
   * @returns {JSX.Element} Component JSX.
   */
  const WrapperComponent = (props) => {
    return (
      <Box
        alignItems="flex-start"
        className="dashboardLayout"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <ProviderHeader />
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

export default withProviderLayout;
