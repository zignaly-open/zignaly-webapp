import React, { useContext } from "react";
import "./DashboardHeader.scss";
import { Box, Typography, Tooltip } from "@material-ui/core";
import SubNavHeader from "../../SubNavHeader";
import { routesMapping } from "../../../utils/routesMapping";
import { FormattedMessage } from "react-intl";
import useSelectedExchange from "hooks/useSelectedExchange";
import LinkIcon from "@material-ui/icons/Link";
import LinkOffIcon from "@material-ui/icons/LinkOff";
import PrivateAreaContext from "context/PrivateAreaContext";

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
  const selectedExchange = useSelectedExchange();
  let links = routesMapping(path).links;
  const { connectedProviders } = useContext(PrivateAreaContext);
  const providerCount = connectedProviders?.filter(
    (p) => p.exchangeInternalId === selectedExchange.internalId && p.type === "signalProvider",
  ).length;

  if (providerCount > 0) {
    links.push({
      id: "dashboard.providers",
      to: "/dashboard/connectedProviders",
    });
  } else {
    links = links.filter((item) => item.id !== "dashboard.providers");
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
          <span className="name"> {selectedExchange.internalName} </span>
          {selectedExchange.paperTrading && (
            <span className="tag">
              (<FormattedMessage id="menu.demo" />){" "}
            </span>
          )}
          {selectedExchange.isTestnet && (
            <span className="tag">
              (<FormattedMessage id="menu.testnet" />){" "}
            </span>
          )}
          {selectedExchange.areKeysValid ? (
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
