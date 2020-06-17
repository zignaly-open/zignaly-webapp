import React from "react";
import "./Disclaimer.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

const Disclaimer = () => {
  return (
    <Box
      alignItems="center"
      className="disclaimer"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Typography variant="h3">
        <FormattedMessage id="srv.disclaimer.title" />
      </Typography>

      <Typography variant="body1">
        <FormattedMessage id="srv.disclaimer.text" />
      </Typography>
    </Box>
  );
};

export default Disclaimer;
