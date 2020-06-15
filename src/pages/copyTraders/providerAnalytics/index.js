import React from "react";
import "./providerAnalytics.scss";
import { Box, Typography } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import { FormattedMessage } from "react-intl";

const CopyTradersAnalytics = () => {
  return (
    <Box className="profileAnalyticsPage">
      <Box bgcolor="grid.main" className="tradingPerformanceBox">
        <Typography variant="h3">
          <FormattedMessage id="copyt.tradingperformance" />
        </Typography>
      </Box>

      <Box bgcolor="grid.main" className="tradingPerformanceBox">
        <Typography variant="h3">
          <FormattedMessage id="copyt.tradingperformance" />
        </Typography>
      </Box>
    </Box>
  );
};

export default compose(withProviderLayout)(CopyTradersAnalytics);
