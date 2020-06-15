import React from "react";
import "./providerAnalytics.scss";
import { Box } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";

const CopyTradersAnalytics = () => {
  return <Box>dynamic route for analytics </Box>;
};

export default compose(withProviderLayout)(CopyTradersAnalytics);
