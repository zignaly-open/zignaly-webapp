import React from "react";
import { Box } from "@material-ui/core";
import { useIntl } from "react-intl";
import withProvidersAnalyticsLayout from "../../../layouts/providersAnalyticsLayout/withProvidersAnalyticsLayout";
import { Helmet } from "react-helmet";
import ProvidersAnalytics from "../../../components/Providers/ProvidersAnalytics";
import "./signalProvidersAnalytics.scss";

/**
 * Provides analytics of signal providers.
 *
 * @returns {JSX.Element} Component JSX.
 */
const SignalProvidersAnalytics = () => {
  const intl = useIntl();

  return (
    <Box className="spAnalyticsPage">
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "menu.signalproviders",
          })} - ${intl.formatMessage({
            id: "srv.analytics",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <ProvidersAnalytics provType={["signal"]} />
    </Box>
  );
};

export default withProvidersAnalyticsLayout(SignalProvidersAnalytics);
