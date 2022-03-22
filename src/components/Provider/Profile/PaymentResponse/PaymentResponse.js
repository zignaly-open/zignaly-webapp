import React from "react";
import "./PaymentResponse.scss";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} DefaultProps
 * @property {String} status
 */

/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const PaymentResponse = ({ status }) => {
  return (
    <Box
      alignItems="center"
      className="paymentResponse"
      display="flex"
      flexDirection="column"
      justifyContent="space-evenly"
    >
      {status === "success" && (
        <>
          <Typography className="green" variant="h3">
            <FormattedMessage id="srv.payment.success.title" />
          </Typography>

          <Typography variant="body1">
            <FormattedMessage id="srv.payment.success.message" />
          </Typography>
        </>
      )}
      {status === "error" && (
        <>
          <Typography className="red" variant="h3">
            <FormattedMessage id="srv.payment.error.title" />
          </Typography>

          <Typography variant="body1">
            <FormattedMessage id="srv.payment.error.message" />
          </Typography>
        </>
      )}
    </Box>
  );
};

export default PaymentResponse;
