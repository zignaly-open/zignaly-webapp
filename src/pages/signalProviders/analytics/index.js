import React from "react";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import { useIntl, FormattedMessage } from "react-intl";
import withAppLayout from "../../../layouts/appLayout";
import withProvidersAnalyticsLayout from "../../../layouts/providersAnalyticsLayout/withProvidersAnalyticsLayout";
import withPageContext from "../../../pageContext";
import { Helmet } from "react-helmet";
import "./signalProvidersAnalytics.scss";
import ProvidersProfitsTable from "../../../components/Providers/ProvidersProfitsTable";

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
          {intl.formatMessage({
            id: "srv.analytics",
          })}
        </title>
      </Helmet>
      <ProvidersProfitsTable
        persistKey="spAnalytics"
        title={<FormattedMessage id="signalp.performance" />}
      />
    </Box>
  );
};

export default compose(
  withPageContext,
  withAppLayout,
  withProvidersAnalyticsLayout,
)(SignalProvidersAnalytics);
