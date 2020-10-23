import React from "react";
import "./management.scss";
import { Box } from "@material-ui/core";
import ManagementSummary from "../../../components/Provider/ProviderManagement/ManagementSummary";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import ManagementTabs from "../../../components/Provider/ProviderManagement/ManagementTabs";

const CopyTradersManagement = () => {
  const { provider } = useStoreViewsSelector();
  const intl = useIntl();

  return (
    <Box className="profileManagementPage">
      <Helmet>
        <title>
          {`${provider.name} - ${intl.formatMessage({
            id: "srv.management",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Box className="summaryBox">
        <ManagementSummary provider={provider} />
      </Box>

      <Box className="tableBoxBox">
        <ManagementTabs provider={provider} />
      </Box>
    </Box>
  );
};

export default CopyTradersManagement;
