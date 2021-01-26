import React, { useContext, useEffect, useState } from "react";
import "./ProviderHeader.scss";
import { Box } from "@material-ui/core";
import SubNavHeader from "../../SubNavHeader";
import {
  createProviderRoutes,
  createTraderRoutes,
  createProfitSharingRoutes,
} from "../../../utils/routesMapping";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import TraderHeaderActions from "./TraderHeaderActions";
import TraderHeaderInfo from "./TraderHeaderInfo";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import ProviderContext from "../../../context/ProviderContext";
import { FormattedMessage } from "react-intl";

/**
 * Provides the navigation bar for the opened provider.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeader = () => {
  const { provider } = useStoreViewsSelector();
  const storeSettings = useStoreSettingsSelector();
  const providerId = typeof window !== "undefined" ? location.pathname.split("/")[2] : "";
  const [links, setLinks] = useState([]);
  const { hasAllocated } = useContext(ProviderContext);

  useEffect(() => {
    const data = provider.isCopyTrading
      ? !provider.profitSharing
        ? createTraderRoutes(providerId, provider)
        : createProfitSharingRoutes(providerId, provider)
      : createProviderRoutes(providerId, provider, storeSettings.selectedExchange);
    if (!provider.isCopyTrading) {
      data.links.some((item) => {
        if (item.to.includes("settings")) {
          item.tooltip = !hasAllocated ? <FormattedMessage id="srv.settings.tooltip" /> : "";
          return true;
        }
        return false;
      });
    }
    setLinks(data ? data.links : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, storeSettings.selectedExchange.internalId, hasAllocated]);

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
      <TraderHeaderActions provider={provider} />
      <TraderHeaderInfo provider={provider} />
      <SubNavHeader links={links} />
    </Box>
  );
};

export default ProviderHeader;
