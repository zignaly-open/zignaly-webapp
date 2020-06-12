import React from "react";
import "./Strategy.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Strategy = ({ provider }) => {
  return (
    <Box
      alignItems="flex-start"
      bgcolor="grid.main"
      className="strategy"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        mb={2}
        width="100%"
      >
        <Typography variant="h3">
          <FormattedMessage id="srv.strategy" />
        </Typography>
        <Typography variant="h4">
          <FormattedMessage id="srv.strategy.subtitle" />
        </Typography>
      </Box>
      <Typography variant="body1">{provider.longDesc}</Typography>
    </Box>
  );
};

export default Strategy;
