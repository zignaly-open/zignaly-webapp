import React from "react";
import "./connectedProviders.scss";
import { Box } from "@material-ui/core";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import { Helmet } from "react-helmet";
import ProvidersBrowse from "../../../components/Providers/ProvidersBrowse";
import { useIntl } from "react-intl";

const ConnectedProviders = () => {
  const intl = useIntl();

  return (
    <Box className="connectedProviders">
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "dashboard",
          })} - ${intl.formatMessage({
            id: "dashboard.providers",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <ProvidersBrowse connectedOnly={true} provType={["signal"]} />
    </Box>
  );
};

export default withDashboardLayout(ConnectedProviders);
