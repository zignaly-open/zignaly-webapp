import React from "react";
import "./management.scss";
import { Box } from "@material-ui/core";
import {
  CopyTraderSummary,
  ProfitSharingSummary,
} from "../../../components/Provider/ProviderManagement/ManagementSummary";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import ManagementTabs from "../../../components/Provider/ProviderManagement/ManagementTabs";
import useStoreSettingsSelector from "hooks/useStoreSettingsSelector";

const CopyTradersManagement = () => {
  const { provider } = useStoreViewsSelector();
  const { selectedExchange } = useStoreSettingsSelector();
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
        {provider.profitSharing ? (
          <ProfitSharingSummary provider={provider} />
        ) : (
          <CopyTraderSummary provider={provider} />
        )}
      </Box>

      <Box className="tableBoxBox">
        <ManagementTabs provider={provider} selectedExchange={selectedExchange} />
      </Box>
    </Box>
  );
};

export default CopyTradersManagement;
