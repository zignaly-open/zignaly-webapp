import React from "react";
import "./SuccessBox.scss";
import { Box, Typography } from "@material-ui/core";
import Link from "../../../../LocalizedLink";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */

/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const SuccessBox = ({ provider }) => {
  return (
    <Box
      alignItems="flex-start"
      className="successBox"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      p={4}
    >
      <Typography variant="h3">
        <FormattedMessage id="copyt.transfermade" />
      </Typography>

      <Typography variant="body1">
        <FormattedMessage id="copyt.transfermade.message" />
      </Typography>
      <Link className="link" partiallyActive={true} to={`/dashboard/analytics#${provider.id}`}>
        <Typography variant="h4">
          <FormattedMessage id="copyt.transfermade.link" />
        </Typography>
      </Link>
    </Box>
  );
};

export default SuccessBox;
