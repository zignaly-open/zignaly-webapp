import React from "react";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import withAppLayout from "../../layouts/appLayout";
import withDashboardLayout from "../../layouts/dashboardLayout";
import withPageContext from "../../pageContext";
import { Helmet } from "react-helmet";

const Position = (props) => {
  console.log(props);
  return (
    <>
      <Helmet>
        <title>Position Detail</title>
      </Helmet>
      <Box className="positionsPage" display="flex" flexDirection="row" justifyContent="center">
        <h1>I will be the position detail page.</h1>
      </Box>
    </>
  );
};

export default compose(withPageContext, withAppLayout, withDashboardLayout)(Position);
