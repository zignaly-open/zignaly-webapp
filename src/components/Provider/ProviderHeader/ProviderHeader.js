import React, { useEffect, useState } from "react";
import "./ProviderHeader.scss";
import { Box } from "@material-ui/core";
import SubNavHeader from "../../SubNavHeader";
import { createProviderRoutes } from "../../../utils/routesMapping";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import ProviderHeaderActions from "./ProviderHeaderActions";
import ProviderHeaderInfo from "./ProviderHeaderInfo";

/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeader = () => {
  const storeViews = useStoreViewsSelector();
  const providerId = location.pathname.split("/")[2];
  const [links, setLinks] = useState(createProviderRoutes(providerId, storeViews.provider).links);

  useEffect(() => {
    const data = createProviderRoutes(providerId, storeViews.provider).links;
    setLinks(data);
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
