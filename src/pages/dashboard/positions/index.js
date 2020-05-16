import React from "react";
import "./positions.scss";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import withAppLayout from "../../../layouts/appLayout";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import withPageContext from "../../../pageContext";
import Helmet from "react-helmet";
import PositionsTabs from "../../../components/Dashboard/PositionsTabs";

const Positions = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Positions</title>
      </Helmet>
      <Box display="flex" flexDirection="row" justifyContent="center" className="positionsPage">
        <PositionsTabs />
      </Box>
    </React.Fragment>
  );
};

export default compose(withPageContext, withAppLayout, withDashboardLayout)(Positions);
