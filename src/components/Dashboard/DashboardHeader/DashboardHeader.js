import React from "react";
import "./DashboardHeader.scss";
import { Box, Typography, Tooltip } from "@material-ui/core";
import SubNavHeader from "../../SubNavHeader";
import { routesMapping } from "../../../utils/routesMapping";
import { FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useConnectedProviders from "../../../hooks/useConnectedProviders";
import LinkIcon from "@material-ui/icons/Link";
import LinkOffIcon from "@material-ui/icons/LinkOff";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {String} path
 */

/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const DashboardHeader = ({ path }) => {
  const storeSettings = useStoreSettingsSelector();
  const links = routesMapping(path).links;
  const providers = useConnectedProviders(1, storeSettings.selectedExchange.internalId, false);

  if (providers.length > 0) {
    links.push({
      id: "dashboard.providers",
      to: "/dashboard/connectedProviders",
    });
  }

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
          {storeSettings.selectedExchange.areKeysValid ? (
            <Tooltip placement="top" title={<FormattedMessage id="accounts.exchangeconnected" />}>
              <LinkIcon className="linkOn" />
            </Tooltip>
          ) : (
            <Tooltip
              placement="top"
              title={<FormattedMessage id="accounts.exchangedisconnected" />}
            >
              <LinkOffIcon className="linkOff" />
            </Tooltip>
          )}
        </span>
      </Box>
      <SubNavHeader links={links} />
    </Box>
  );
};

export default DashboardHeader;
