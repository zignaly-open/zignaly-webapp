import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import "./connectedTraders.scss";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import { Helmet } from "react-helmet";
import ProvidersBrowse from "../../../components/Providers/ProvidersBrowse";

const ConnectedTraders = () => {
  const intl = useIntl();

  return (
    <Box className="connectedTradersPage">
      <Helmet>
        <title>{intl.formatMessage({ id: "dashboard.traders" })}</title>
      </Helmet>
      <ProvidersBrowse type="copyt" connectedOnly={true} />
    </Box>
  );
};

export default compose(withDashboardLayout)(ConnectedTraders);
