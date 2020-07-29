import React from "react";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";
import "./ConnectExchange.scss";
import { navigate as navigateReach } from "@reach/router";

/**
 * @typedef {Object} ConnectExchangePropTypes
 * @property {function} [onClose] Close function.
 */

/**
 * Ask to connect an exchange account.
 *
 * @param {ConnectExchangePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ConnectExchange = ({ onClose }) => {
  const navigate = () => {
    if (onClose) onClose();
    navigateReach("#exchangeAccounts");
  };

  return (
    <Box alignItems="center" display="flex" flexDirection="column" className="connectExchangeModal">
      <Typography variant="h3">
        <FormattedMessage id="accounts.connect" />
      </Typography>
      <Typography variant="body1">
        <FormattedMessage id="accounts.connect.first" />
      </Typography>
      <Box display="flex" flexDirection="column" className="real">
        <Typography variant="h4">
          <FormattedMessage id="accounts.create.or" />
        </Typography>
        <CustomButton className="body2 bgPurple exchangeButton" onClick={navigate}>
          <FormattedMessage id="accounts.connect.go" />
        </CustomButton>
      </Box>
      <Box display="flex" flexDirection="column" className="demo">
        <Typography variant="h4">
          <FormattedMessage id="accounts.connect.experiment" />
        </Typography>
        <CustomButton className="body2 textPurple exchangeButton" onClick={navigate}>
          <FormattedMessage id="accounts.create.demo" />
        </CustomButton>
      </Box>
    </Box>
  );
};
export default ConnectExchange;
