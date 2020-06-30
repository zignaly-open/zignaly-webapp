import React from "react";
import "./ManagementSummaryCard.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import PeopleIcon from "@material-ui/icons/People";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import LocalMallIcon from "@material-ui/icons/LocalMall";

/**
 * @typedef {Object} DefaultProps
 * @property {String} icon icon.
 * @property {JSX.Element} title icon.
 * @property {String} [quote] icon.
 * @property {String} [percentage] icon.
 * @property {String|Number} foot icon.
 * @property {String|Number} value
 *
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ManagementSummary = ({ icon, title, quote, percentage, foot, value }) => {
  return (
    <Box
      alignItems="center"
      bgcolor="grid.main"
      className="managementSummaryCard"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box
        alignItems="center"
        className="head"
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        {icon === "followers" && <PeopleIcon className="icon" />}
        {icon === "allocated" && <AssignmentTurnedInIcon className="icon" />}
        {icon === "balance" && <AccountBalanceWalletIcon className="icon" />}
        {icon === "profit" && <MonetizationOnIcon className="icon" />}
        {icon === "float" && <LocalMallIcon className="icon" />}
        <Typography className="headTitle" variant="caption">
          {title}
        </Typography>
        {percentage && <Typography variant="h4">{percentage}</Typography>}
      </Box>
      <Box
        alignItems="flex-end"
        className="body"
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        <Typography variant="h1">{value}</Typography>
        {quote && <Typography variant="caption">{quote}</Typography>}
      </Box>
      <Box
        alignItems="center"
        className="foot"
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        {icon === "followers" && (
          <Typography variant="caption">
            <FormattedMessage id="copyt.management.trialing" />
          </Typography>
        )}
        <Typography variant="caption">{foot}</Typography>
      </Box>
    </Box>
  );
};

export default ManagementSummary;
