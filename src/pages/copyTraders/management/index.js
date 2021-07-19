import React from "react";
import "./management.scss";
import { Box } from "@material-ui/core";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import useSelectedExchange from "hooks/useSelectedExchange";
import {
  FuturesProfitSharingManagement,
  SpotProfitSharingManagement,
  TraderManagement,
} from "components/Provider/ProviderManagement";

const CopyTradersManagement = () => {
  const { provider } = useStoreViewsSelector();
  const selectedExchange = useSelectedExchange();
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
      {provider.profitSharing && provider.exchangeType.toLowerCase() === "futures" && (
        <FuturesProfitSharingManagement provider={provider} selectedExchange={selectedExchange} />
      )}
      {provider.profitSharing && provider.exchangeType.toLowerCase() === "spot" && (
        <SpotProfitSharingManagement provider={provider} selectedExchange={selectedExchange} />
      )}
      {!provider.profitSharing && (
        <TraderManagement provider={provider} selectedExchange={selectedExchange} />
      )}
    </Box>
  );
};

export default CopyTradersManagement;
