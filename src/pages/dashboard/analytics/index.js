import React from "react";
import { Box } from "@mui/material";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import "./analytics.scss";
import Analytics from "../../../components/DashboardAnalytics/Analytics";
import withDashboardLayout from "../../../layouts/dashboardLayout";

/**
 * Dashboard Analytics page component.
 *
 * @returns {JSX.Element} Position page element.
 */
const DashboardAnalytics = () => {
  const intl = useIntl();
  const providerId = typeof window !== "undefined" ? window.location.href.split("#")[1] : "";

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
      <Analytics providerId={providerId} />
    </Box>
  );
};

export default withDashboardLayout(DashboardAnalytics);
