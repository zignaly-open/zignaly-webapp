import React from "react";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import "./analytics.scss";
import Analytics from "../../../components/DashboardAnalytics/Analytics";
import withDashboardLayout from "../../../layouts/dashboardLayout";

/**
 * Provides analytics of signal providers.
 *
 * @returns {JSX.Element} Component JSX.
 */
const DashboardAnalytics = () => {
  const intl = useIntl();

  return (
    <Box className="ctAnalyticsPage">
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "menu.copytraders",
          })} - ${intl.formatMessage({
            id: "srv.analytics",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Analytics />
    </Box>
  );
};

export default compose(withDashboardLayout)(DashboardAnalytics);
