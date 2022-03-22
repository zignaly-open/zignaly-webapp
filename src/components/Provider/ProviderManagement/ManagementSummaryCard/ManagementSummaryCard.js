import React from "react";
import "./ManagementSummaryCard.scss";
import { Box, Tooltip, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalMallIcon from "@mui/icons-material/LocalMall";

/**
 * @typedef {Object} DefaultProps
 * @property {String} icon icon.
 * @property {JSX.Element} title icon.
 * @property {String} [quote] icon.
 * @property {String} [percentage] icon.
 * @property {String|Number} [foot] icon.
 * @property {String|Number} value
 * @property {String|JSX.Element} [tooltip]
 * @property {String} [valueColor]
 *
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ManagementSummaryCard = ({
  icon,
  title,
  quote,
  percentage,
  foot,
  value,
  tooltip,
  valueColor,
}) => {
  return (
    <Box
      alignItems="center"
      bgcolor="grid.content"
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
        {tooltip ? (
          <Tooltip placement="top" title={tooltip}>
            <Typography className="headTitle" variant="caption">
              {title}
            </Typography>
          </Tooltip>
        ) : (
          <Typography className="headTitle" variant="caption">
            {title}
          </Typography>
        )}
        {percentage && <Typography variant="h4">{percentage}</Typography>}
      </Box>
      <Box
        alignItems="flex-end"
        className="body"
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        <Typography className={valueColor ? valueColor : ""} variant="h1">
          {value}
        </Typography>
        {quote && <Typography variant="caption">{quote}</Typography>}
      </Box>
      {foot && (
        <Box
          alignItems="center"
          className="foot"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <Typography variant="caption">{foot}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ManagementSummaryCard;
