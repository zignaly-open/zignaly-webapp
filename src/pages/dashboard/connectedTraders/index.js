import React from "react";
import "./connectedTraders.scss";
import { Box } from "@material-ui/core";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import { Helmet } from "react-helmet";
import ProvidersBrowse from "../../../components/Providers/ProvidersBrowse";
import { useIntl } from "react-intl";

const ConnectedTraders = () => {
  const intl = useIntl();

  return (
    <Box className="connectedTradersPage">
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "dashboard",
          })} - ${intl.formatMessage({
            id: "dashboard.traders",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <ProvidersBrowse connectedOnly={true} provType="copytraders" />
    </Box>
  );
};

export default withDashboardLayout(ConnectedTraders);
