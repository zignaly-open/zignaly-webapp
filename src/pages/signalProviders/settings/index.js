import React from "react";
import { Box } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";

const SignalProvidersSettings = () => {
  return <Box>dynamic route for settings </Box>;
};

export default compose(withProviderLayout)(SignalProvidersSettings);
