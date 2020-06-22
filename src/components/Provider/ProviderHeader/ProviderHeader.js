import React, { useEffect, useState } from "react";
import "./ProviderHeader.scss";
import { Box } from "@material-ui/core";
import SubNavHeader from "../../SubNavHeader";
import { createProviderRoutes, createTraderRoutes } from "../../../utils/routesMapping";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import ProviderHeaderActions from "./ProviderHeaderActions";
import ProviderHeaderInfo from "./ProviderHeaderInfo";

/**
 * Provides the navigation bar for the opened provider.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeader = () => {
  const storeViews = useStoreViewsSelector();
  const providerId = typeof window !== "undefined" ? location.pathname.split("/")[2] : "";
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const data = storeViews.provider.isCopyTrading
      ? createTraderRoutes(providerId, storeViews.provider)
      : createProviderRoutes(providerId, storeViews.provider);
    setLinks(data ? data.links : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeViews.provider.id]);

  return (
    <Box
      className="providerHeader"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <ProviderHeaderActions />
      <ProviderHeaderInfo />
      <SubNavHeader links={links} />
    </Box>
  );
};

export default ProviderHeader;
