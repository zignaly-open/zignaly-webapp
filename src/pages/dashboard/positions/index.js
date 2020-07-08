import React from "react";
import "./positions.scss";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import { Helmet } from "react-helmet";
import { PositionsTabs } from "../../../components/Dashboard/PositionsTabs";
import { useIntl } from "react-intl";

const Positions = () => {
  const intl = useIntl();
  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({ id: "product" })} | ${intl.formatMessage({
            id: "dashboard",
          })} | ${intl.formatMessage({
            id: "dashboard.positions",
          })}`}
        </title>
      </Helmet>
      <Box className="positionsPage" display="flex" flexDirection="row" justifyContent="center">
        <PositionsTabs />
      </Box>
    </>
  );
};

export default compose(withDashboardLayout)(Positions);
