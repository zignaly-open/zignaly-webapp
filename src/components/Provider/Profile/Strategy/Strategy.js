import React from "react";
import "./Strategy.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ReactMarkdown from "react-markdown";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Strategy compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Strategy = ({ provider }) => {
  return (
    <Box
      alignItems="flex-start"
      className="strategy"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Box
        alignItems="center"
        className="strategyHead"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
      >
        <Typography variant="h3">
          <FormattedMessage id="srv.strategy" />
        </Typography>
        <Typography variant="h4">
          <FormattedMessage id="srv.strategy.subtitle" />
        </Typography>
      </Box>
      <ReactMarkdown linkTarget="_blank" source={provider.strategy} />
    </Box>
  );
};

export default Strategy;
