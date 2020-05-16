import React from "react";
import "./connectedTraders.scss";
import { Box, Typography } from "@material-ui/core";
import { compose } from "recompose";
import withAppLayout from "../../../layouts/appLayout";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import withPageContext from "../../../pageContext";
import Helmet from "react-helmet";
import TraderCard from "../../../components/TraderCard";

const ConnectedTraders = () => {
  const list = [1, 2, 3];

  return (
    <React.Fragment>
      <Helmet>
        <title>Connected Traders</title>
      </Helmet>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        className="connectedTradersPage"
      >
        <Box className="headlineBox">
          <Typography variant="h4">Traders I am copying:</Typography>
        </Box>
        <Box
          className="tradersBox"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          flexWrap="wrap"
        >
          {list && list.map((item) => <TraderCard key={item} data={item} showSummary={true} />)}
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default compose(withPageContext, withAppLayout, withDashboardLayout)(ConnectedTraders);
