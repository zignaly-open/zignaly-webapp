import React from "react";
import "./AboutUs.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ReactMarkdown from "react-markdown";

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
const AboutUs = ({ provider }) => {
  return (
    <Box
      alignItems="flex-start"
      className="aboutUs"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Typography variant="h3">
        <FormattedMessage id="srv.about" />
      </Typography>
      <ReactMarkdown source={provider.shortDesc} />
      {/* <Typography variant="body1">{provider.shortDesc}</Typography> */}
    </Box>
  );
};

export default AboutUs;
