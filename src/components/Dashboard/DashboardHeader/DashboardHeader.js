import React, { useEffect, useState } from "react";
import "./DashboardHeader.scss";
import { Box, Typography } from "@material-ui/core";
import SubNavHeader from "../../SubNavHeader";
import { routesMapping } from "../../../utils/routesMapping";
import { FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../services/tradeApiClient";

/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {JSX.Element} Component JSX.
 */
const DashboardHeader = () => {
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const [links, setLinks] = useState(routesMapping("dashboard").links);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const payload = {
          token: storeSession.tradeApi.accessToken,
          copyTradersOnly: false,
          type: "connected",
          timeFrame: 1,
        };
        const response = await tradeApi.providersGet(payload);
        if (response.length > 0) {
          let data = [...links];
          data.push({
            id: "dashboard.providers",
            to: "/dashboard/connectedProviders",
          });
          setLinks(data);
        }
      } catch (e) {
        alert(e.message);
      }
    };

    loadProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className="dashboardHeader">
      <Box
        alignItems="center"
        className="titleBox"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <Typography variant="h1">
          <FormattedMessage id="dashboard" />
        </Typography>
        <span className="exchangeTitle">
          <span className="name"> {storeSettings.selectedExchange.internalName} </span>
          {storeSettings.selectedExchange.paperTrading && (
            <span className="name">
              (<FormattedMessage id="menu.demo" />){" "}
            </span>
          )}
          {storeSettings.selectedExchange.isTestnet && (
            <span className="name">
              (<FormattedMessage id="menu.testnet" />){" "}
            </span>
          )}
        </span>
      </Box>
      <SubNavHeader links={links} />
    </Box>
  );
};

export default DashboardHeader;
