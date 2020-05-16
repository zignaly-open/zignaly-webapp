import React from "react";
import "./DashboardHeader.scss";
import { Box, Typography } from "@material-ui/core";
import SubNavHeader from "../../SubNavHeader";
import { routesMapping } from "../../../utils/routesMapping";
import { FormattedMessage } from "react-intl";

const DashboardHeader = props => {
  const { path } = props;

  return (
    <Box className="dashboardHeader">
      <Box
        className="titleBox"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Typography variant="h1">
          <FormattedMessage id={routesMapping(path).id} />
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
