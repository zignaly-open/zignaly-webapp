import React from "react";
import "./WhoWeAre.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props
 * @returns {JSX.Element} Component JSX.
 */
const Strategy = ({ provider }) => {
  return (
    <Box
      alignItems="flex-start"
      className="whoWeAre"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      bgcolor="grid.main"
    >
      <Box
        alignItems="flex-start"
        className="topBox"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Typography variant="h3">
          <FormattedMessage id="srv.who" />
        </Typography>
      </Box>
      <Box
        alignItems="flex-start"
        className="topBox"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Typography variant="h3">
          <FormattedMessage id="srv.find" />
        </Typography>
        <Box
          alignItems="center"
          className="socialBox"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
        ></Box>
      </Box>
      <Typography variant="body1">{provider.website}</Typography>
    </Box>
  );
};

export default Strategy;
