import React, { useState } from "react";
import "./dashboardLayout.scss";
import { getDisplayName } from "../../utils";
import { Box } from "@material-ui/core";
import FAQ from "../../components/FAQ";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import { FormattedMessage } from "react-intl";

/**
 *  App layout is defined here, the placement of header, sidebar, mobile appbar.
 *
 * @param {import('../../utils/getDisplayName').WrappedComponentType} Component
 * @returns {Object} Component
 */

const withDashboardLayout = (Component) => {
  /**
   *
   * @param {Object} props Default params.
   */
  const WrapperComponent = (props) => {
    const [exchange] = useState(true);

    return (
      <Box
        alignItems="flex-start"
        className="dashboardLayout"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        {exchange && (
          <>
            <DashboardHeader />
            <Box className="pageContent">
              <Component {...props} />
            </Box>
            <Box className="faq">
              <FAQ />
            </Box>
          </>
        )}
        {!exchange && (
          <Box
            className="noExchangeBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <span className="title">
              <FormattedMessage id="dashboard.connectexchange.title" />
            </span>
            <span className="text">
              <FormattedMessage id="dashboard.connectexchange.subtitle" />
            </span>
          </Box>
        )}
      </Box>
    );
  };
  /**
   * @param {Object} Component
   */
  WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;
  return WrapperComponent;
};

export default withDashboardLayout;
