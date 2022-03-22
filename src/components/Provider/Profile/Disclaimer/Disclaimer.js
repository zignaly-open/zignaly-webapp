import React from "react";
import "./Disclaimer.scss";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import PaymentForm from "../../../Forms/PaymentForm";
import CustomButton from "../../../CustomButton";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 * @property {Function} onClose
 */

/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const Disclaimer = ({ provider, onClose }) => {
  const handleClick = () => {
    onClose();
  };

  return (
    <Box
      alignItems="center"
      className="disclaimer"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Typography variant="h3">
        <FormattedMessage id="srv.disclaimer.title" />
      </Typography>

      <Typography variant="body1">
        <FormattedMessage id="srv.disclaimer.text" />
      </Typography>

      <Box
        alignItems="center"
        className="actions"
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
      >
        <PaymentForm provider={provider} />
        <CustomButton className="textButton" onClick={handleClick}>
          <FormattedMessage id="action.cancel" />
        </CustomButton>
      </Box>
    </Box>
  );
};

export default Disclaimer;
