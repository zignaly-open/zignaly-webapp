import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import "./connectedTraders.scss";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import { Helmet } from "react-helmet";
import useProvidersList from "../../../hooks/useProvidersList";

const ConnectedTraders = () => {
  const intl = useIntl();

  const providersOptions = { copyTradersOnly: true, connectedOnly: true, showSummary: true };
  const [, provComponents] = useProvidersList(providersOptions, {});
  const { ProvidersList, TimeFrameSelectRow } = provComponents;

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: "dashboard.traders" })}</title>
      </Helmet>
      <Box
        className="connectedTradersPage"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <TimeFrameSelectRow title={<FormattedMessage id="dashboard.traders.copying" />} />
        <ProvidersList />
      </Box>
    </>
  );
};

export default compose(withDashboardLayout)(ConnectedTraders);
