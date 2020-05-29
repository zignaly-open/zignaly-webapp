import React from "react";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import { FormattedMessage, useIntl } from "react-intl";
import withAppLayout from "../../../layouts/appLayout";
import withProvidersAnalyticsLayout from "../../../layouts/providersAnalyticsLayout/withProvidersAnalyticsLayout";
import withPageContext from "../../../pageContext";
import { Helmet } from "react-helmet";
import "./copyTradersAnalytics.scss";
import ProvidersProfitsTable from "../../../components/Providers/ProvidersProfitsTable";

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
      <ProvidersProfitsTable
        persistKey="ctAnalytics"
        title={<FormattedMessage id="copyt.performance" />}
      />
    </Box>
  );
};

export default compose(
  withPageContext,
  withAppLayout,
  withProvidersAnalyticsLayout,
)(CopyTradersAnalytics);
