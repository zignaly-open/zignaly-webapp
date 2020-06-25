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
      bgcolor="grid.main"
      display="flex"
      flexDirection="column"
      alignItems="center"
      className="managementSummaryCard"
      justifyContent="space-between"
    >
      <Box
        className="head"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        {icon === "followers" && <PeopleIcon className="icon" />}
        {icon === "allocated" && <AssignmentTurnedInIcon className="icon" />}
        {icon === "balance" && <AccountBalanceWalletIcon className="icon" />}
        {icon === "profit" && <MonetizationOnIcon className="icon" />}
        {icon === "float" && <LocalMallIcon className="icon" />}
        <Typography variant="caption" className="headTitle">
          {title}
        </Typography>
        {percentage && <Typography variant="h4">{percentage}</Typography>}
      </Box>
      <Box
        className="body"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="flex-end"
      >
        <Typography variant="h1">{value}</Typography>
        {quote && <Typography variant="caption">{quote}</Typography>}
      </Box>
      <Box
        className="foot"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
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
