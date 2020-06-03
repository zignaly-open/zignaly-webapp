import React from "react";
import "./positions.scss";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import { Helmet } from "react-helmet";
import { PositionsTabs } from "../../../components/Dashboard/PositionsTabs";

const Positions = () => {
  return (
    <>
      <Helmet>
        <title>Positions</title>
      </Helmet>
      <Box className="positionsPage" display="flex" flexDirection="row" justifyContent="center">
        <PositionsTabs />
      </Box>
    </>
  );
};

export default compose(withDashboardLayout)(Positions);
