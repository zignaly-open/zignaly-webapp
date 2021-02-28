import React from "react";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";
import "./ConnectExchange.scss";
import { navigate as navigateReach } from "@reach/router";
import useExchangeList from "../../../hooks/useExchangeList";
import { getExchangeNamesCombined } from "../../../utils/helpers";

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
  const { exchanges } = useExchangeList();
  const navigate = () => {
    if (onClose) onClose();
    navigateReach("#exchangeAccounts");
  };

  return (
    <Box alignItems="center" className="connectExchangeModal" display="flex" flexDirection="column">
      <Typography variant="h3">
        <FormattedMessage id="accounts.connect" />
      </Typography>
      <Typography variant="body1">
        <FormattedMessage
          id="accounts.connect.first"
          values={{ exchanges: getExchangeNamesCombined(exchanges, "or") }}
        />
      </Typography>
      <Box className="real" display="flex" flexDirection="column">
        <Typography variant="h4">
          <FormattedMessage id="accounts.create.or" />
        </Typography>
        <CustomButton className="body2 bgPurple exchangeButton" onClick={navigate}>
          <FormattedMessage id="accounts.connect.go" />
        </CustomButton>
      </Box>
      {/* <Box className="demo" display="flex" flexDirection="column">
        <Typography variant="h4">
          <FormattedMessage id="accounts.connect.experiment" />
        </Typography>
        <CustomButton className="body2 textPurple exchangeButton" onClick={navigate}>
          <FormattedMessage id="accounts.create.demo" />
        </CustomButton>
      </Box> */}
    </Box>
  );
};
export default ConnectExchange;
