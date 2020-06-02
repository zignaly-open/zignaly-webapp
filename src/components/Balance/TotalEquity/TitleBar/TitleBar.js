import React from "react";
import "./TitleBar.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

const TitleBar = () => {
  return (
    <Box
      alignItems="center"
      className="titleBar"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box
        alignItems="flex-start"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Typography className="boxTitle" variant="h3">
          <FormattedMessage id="dashboard.balance.totalequity" />
        </Typography>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          mt={1}
        >
          <Typography variant="h4">BTC 0.5346 </Typography>
          <Typography className="smallText" variant="subtitle2">
            {" "}
            = USD 3450.6
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TitleBar;
