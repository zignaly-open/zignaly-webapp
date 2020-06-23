import React from "react";
import "./Options.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ProviderOptionsForm from "../../../Forms/ProviderOptionsForm";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * About us compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const AboutUs = ({ provider }) => {
  return (
    <Box
      alignItems="flex-start"
      className="options"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Typography variant="h3">
        <FormattedMessage id="srv.options" />
      </Typography>
      <ProviderOptionsForm provider={provider} />
    </Box>
  );
};

export default AboutUs;
