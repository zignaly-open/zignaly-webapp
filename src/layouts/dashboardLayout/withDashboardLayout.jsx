import React, { useState } from "react";
import "./dashboardLayout.scss";
import { getDisplayName } from "../../utils";
import { Box } from "@material-ui/core";
import FAQ from "../../components/FAQ";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import { FormattedHTMLMessage } from "react-intl";

const withDashboardLayout = (Component) => {
  const WrapperComponent = (props) => {
    const [exchange, ] = useState(true);

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
            <DashboardHeader path={props.path} />
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
