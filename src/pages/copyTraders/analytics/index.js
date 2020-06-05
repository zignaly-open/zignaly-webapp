import React from "react";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
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
          {intl.formatMessage({
            id: "srv.analytics",
          })}
        </title>
      </Helmet>
      <ProvidersAnalytics type="signalp" />
    </Box>
  );
};

export default compose(withProvidersAnalyticsLayout)(CopyTradersAnalytics);
