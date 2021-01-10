import React from "react";
import { Box } from "@material-ui/core";
import { useIntl } from "react-intl";
import withProvidersAnalyticsLayout from "../../../layouts/providersAnalyticsLayout/withProvidersAnalyticsLayout";
import { Helmet } from "react-helmet";
import "./copyTradersAnalytics.scss";
import ProvidersAnalytics from "../../../components/Providers/ProvidersAnalytics";

/**
 * Provides analytics of signal providers.
 *
 * @returns {JSX.Element} Component JSX.
 */
const CopyTradersAnalytics = () => {
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
      <ProvidersAnalytics provType={["copytraders"]} />
    </Box>
  );
};

export default withProvidersAnalyticsLayout(CopyTradersAnalytics);
