import React, { useState, useEffect } from "react";
import "./Options.scss";
import { Box, Typography, useMediaQuery } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ProviderOptionsForm from "../../../Forms/ProviderOptionsForm";
import { useTheme } from "@material-ui/core/styles";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [show, setShow] = useState(true);

  const initShow = () => {
    if (!isMobile) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(initShow, [isMobile]);

  return (
    <Box
      alignItems="flex-start"
      className="options"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      {!isMobile && (
        <Typography variant="h3">
          <FormattedMessage id="srv.options" />
        </Typography>
      )}

      {isMobile && (
        <Typography variant="h3" onClick={() => setShow(!show)}>
          <FormattedMessage id="srv.options" />
          {show && <ExpandLessIcon className="expandIcon" />}
          {!show && <ExpandMoreIcon className="expandIcon" />}
        </Typography>
      )}
      {show && (
        <Box className="optionsBody">
          <ProviderOptionsForm provider={provider} />
        </Box>
      )}
    </Box>
  );
};

export default AboutUs;
