import React from "react";
import "./connectedProviders.scss";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import { Helmet } from "react-helmet";
import ProvidersBrowse from "../../../components/Providers/ProvidersBrowse";
import { useIntl } from "react-intl";

const ConnectedProviders = () => {
  const intl = useIntl();

  return (
    <Box className="connectedProviders">
      <Helmet>
        <title>{intl.formatMessage({ id: "dashboard.providers" })}</title>
      </Helmet>
      <ProvidersBrowse connectedOnly={true} type="signalp" />
    </Box>
  );
};

export default compose(withDashboardLayout)(ConnectedProviders);
