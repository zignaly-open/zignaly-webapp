import React from "react";
import "./TitleBar.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

const TitleBar = ({ balance }) => {
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
          <Typography variant="h4">BTC {balance.totalBTC}</Typography>
          <Typography className="smallText" variant="subtitle2">
            = USDT {balance.totalUSDT}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TitleBar;
