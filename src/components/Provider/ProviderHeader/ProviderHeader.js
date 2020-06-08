import React, { useEffect, useState } from "react";
import "./ProviderHeader.scss";
import { Box, Typography } from "@material-ui/core";
import SubNavHeader from "../../SubNavHeader";
import { createProviderRoutes } from "../../../utils/routesMapping";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";

/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {JSX.Element} Component JSX.
 */
const DashboardHeader = () => {
  const storeViews = useStoreViewsSelector();
  const providerId = location.pathname.split("/")[2];
  const [links, setLinks] = useState(createProviderRoutes(providerId, storeViews.provider).links);

  useEffect(() => {
    const data = createProviderRoutes(providerId, storeViews.provider).links;
    setLinks(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeViews.provider.id]);

  return (
    <Box className="providerHeader">
      <Box
        alignItems="center"
        className="titleBox"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <Typography variant="h1">{storeViews.provider.name}</Typography>
      </Box>
      <SubNavHeader links={links} />
    </Box>
  );
};

export default DashboardHeader;
