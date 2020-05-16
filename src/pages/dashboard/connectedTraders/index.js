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
    <>
      <Helmet>
        <title>Connected Traders</title>
      </Helmet>
      <Box
        className="connectedTradersPage"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Box className="headlineBox">
          <Typography variant="h4">Traders I am copying:</Typography>
        </Box>
        <Box
          alignItems="center"
          className="tradersBox"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="flex-start"
        >
          {list && list.map((item) => <TraderCard data={item} key={item} showSummary={true} />)}
        </Box>
      </Box>
    </>
  );
};

export default compose(withPageContext, withAppLayout, withDashboardLayout)(ConnectedTraders);
