import React from "react";
import "./DashboardLayout.scss";
import { getDisplayName } from "../../utils";
import { Box, CircularProgress } from "@material-ui/core";
import FAQ from "../../components/FAQ";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import { useStoreUserSelector } from "../../hooks/useStoreUserSelector";
import NoExchanges from "../../components/Dashboard/NoExchanges";

/**
 * HOC wrap component with dashboard layout.
 *
 * App layout is defined here, the placement of header, sidebar, mobile appbar.
 *
 * @param {React.ComponentType<any>} Component The component to wrap.
 *
 * @returns {Function} Wrap component function.
 */
const withDashboardLayout = (Component) => {
  /**
   *
   * @typedef {Object} DefaultProps
   * @property {String} path
   */

  /**
   * @param {DefaultProps} props Default params.
   * @returns {JSX.Element} Component JSX.
   */
  const WrapperComponent = (props) => {
    const user = useStoreUserSelector();

    return (
      <Box
        alignItems="flex-start"
        className="dashboardLayout"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        {!user.loaded ? (
          <Box
            alignItems="center"
            className="loadingBox"
            display="flex"
            flexDirection="row"
            justifyContent="center"
          >
            <CircularProgress color="primary" size={50} />
          </Box>
        ) : user.exchangeConnections.length > 0 ? (
          <>
            <DashboardHeader path={props.path} />
            <Box className="pageContent">
              <Component {...props} />
            </Box>
            <Box className="faq">
              <FAQ />
            </Box>
          </>
        ) : (
          <NoExchanges />
        )}
      </Box>
    );
  };

  WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;

  return WrapperComponent;
};

export default withDashboardLayout;
