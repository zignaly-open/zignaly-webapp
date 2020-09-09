import React, { useEffect, useState } from "react";
import "./ProviderHeader.scss";
import { Box } from "@material-ui/core";
import SubNavHeader from "../../SubNavHeader";
import { createProviderRoutes, createTraderRoutes } from "../../../utils/routesMapping";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import TraderHeaderActions from "./TraderHeaderActions";
import TraderHeaderInfo from "./TraderHeaderInfo";
import ProviderHeaderActions from "./ProviderHeaderActions";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

/**
 * Provides the navigation bar for the opened provider.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeader = () => {
  const storeViews = useStoreViewsSelector();
  const storeSettings = useStoreSettingsSelector();
  const providerId = typeof window !== "undefined" ? location.pathname.split("/")[2] : "";
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const data = storeViews.provider.isCopyTrading
      ? createTraderRoutes(providerId, storeViews.provider)
      : createProviderRoutes(providerId, storeViews.provider, storeSettings.selectedExchange);
    setLinks(data ? data.links : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeViews.provider.id, storeSettings.selectedExchange.internalId]);

  const checkAccess = () => {
    // Reset focus: https://github.com/ReactTraining/react-router/issues/5210
    window.scrollTo(0, 0);
  };
  useEffect(checkAccess, []);

  return (
    <Box
      className="providerHeader"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <TraderHeaderActions />
      <TraderHeaderInfo />
      <SubNavHeader links={links} />
    </Box>
  );
};

export default ProviderHeader;
