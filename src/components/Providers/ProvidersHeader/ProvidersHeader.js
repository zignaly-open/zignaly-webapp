import React from "react";
import "./ProvidersHeader.scss";
import { Box, Typography } from "@mui/material";
import { routesMapping } from "../../../utils/routesMapping";
import SubNavHeader from "../../SubNavHeader";
import { FormattedMessage } from "react-intl";
import { useStoreUserData } from "hooks/useStoreUserSelector";

/**
 * @typedef {Object} SubNavHeaderPropTypes
 * @property {Object} [rightComponent] Optional component to display at the right of the menu.
 * @property {string} path Current route path.
 */

/**
 * Provides the navigation bar for the providers with filter buttons.
 *
 * @param {SubNavHeaderPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersHeader = ({ path, rightComponent }) => {
  const isCopyTrading = path.startsWith("/copyTraders");
  const isProfitSharing = path.startsWith("/profitSharing");
  const isSignalProvider = path.startsWith("/signalProviders");
  const sectionNavitation = routesMapping(path);
  const userData = useStoreUserData();
  const links = sectionNavitation.links.filter((item) => {
    if (item.id === "srv.myservices") {
      // Only show My Services tab if the user has created a service
      return (
        (isProfitSharing && userData.isTrader.profit_sharing) ||
        (isCopyTrading && userData.isTrader.copy_trading) ||
        (isSignalProvider && userData.isTrader.signal_providers)
      );
    }
    return true;
  });

  return (
    <Box className="providersHeader">
      <Box className="titleBox" display="flex" flexDirection="column">
        <Typography variant="h1">
          {sectionNavitation.id && <FormattedMessage id={sectionNavitation.id} />}
        </Typography>
        <h4 className="subHeader">
          {sectionNavitation.subtitleId && <FormattedMessage id={sectionNavitation.subtitleId} />}
          {sectionNavitation.subtitle2Id && (
            <>
              <br />
              <FormattedMessage id={sectionNavitation.subtitle2Id} />
            </>
          )}
        </h4>
      </Box>
      <SubNavHeader links={links} rightComponent={rightComponent} />
    </Box>
  );
};

export default ProvidersHeader;
