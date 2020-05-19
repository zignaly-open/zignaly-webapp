import React, { useState } from "react";
import "./dashboardLayout.scss";
import { getDisplayName } from "../../utils";
import { Box } from "@material-ui/core";
import FAQ from "../../components/FAQ";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import { FormattedHTMLMessage } from "react-intl";

/**
 *  App layout is defined here, the placement of header, sidebar, mobile appbar.
 *
 * @param {Object} Component
 * @returns {Object} Component
 */

const withDashboardLayout = (Component) => {
  /**
   *
   * @typedef {Object} DefaultProps
   * @property {String} path
   */

  /**
   *
   * @param {DefaultProps} props
   */

  const WrapperComponent = (props) => {
    const { path } = props;
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
          <React.Fragment>
            <DashboardHeader path={props.path} />
            <Box className="pageContent">
              <Component {...props} />
            </Box>
            <Box className="faq">
              <FAQ />
            </Box>
          </React.Fragment>
        )}
        {!exchange && (
          <Box
            className="noExchangeBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <span className="title">
              <FormattedHTMLMessage id="dashboard.connectexchange.title" />
            </span>
            <span className="text">
              <FormattedHTMLMessage id="dashboard.connectexchange.subtitle" />
            </span>
          </Box>
        )}
      </Box>
    );
  };
  WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;
  return WrapperComponent;
};

export default withDashboardLayout;
