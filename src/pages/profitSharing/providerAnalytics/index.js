import React from "react";
import { Box } from "@material-ui/core";
import { useIntl } from "react-intl";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import { Helmet } from "react-helmet";
import Analytics from "../../../components/Provider/Analytics";

const CopyTradersAnalytics = () => {
  const storeViews = useStoreViewsSelector();
  const intl = useIntl();

  return (
    <Box className="profileAnalyticsPage">
      <Helmet>
        <title>
          {`${storeViews.provider.name} - ${intl.formatMessage({
            id: "srv.analytics",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Analytics provider={storeViews.provider} />
    </Box>
  );
};

export default CopyTradersAnalytics;
