import React from "react";
import "./DashboardHeader.scss";
import { Box, Typography } from "@material-ui/core";
import SubNavHeader from "../../SubNavHeader";
import { routesMapping } from "../../../utils/routesMapping";
import { FormattedMessage } from "react-intl";

/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {Object} Component JSX.
 */
const DashboardHeader = () => {
  return (
    <Box className="dashboardHeader">
      <Box
        alignItems="center"
        className="titleBox"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <Typography variant="h1">
          <FormattedMessage id="dashboard" />
        </Typography>
        {routesMapping(path).name === "dashboard" && (
          <span className="exchangeTitle">KuCion (Demo)</span>
        )}
      </Box>
      <SubNavHeader links={routesMapping(path).links} />
    </Box>
  );
};

export default DashboardHeader;
