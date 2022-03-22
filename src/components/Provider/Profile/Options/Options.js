import React from "react";
import "./Options.scss";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import ProviderOptionsForm from "../../../Forms/ProviderOptionsForm";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useProfileBoxShow from "../../../../hooks/useProfileBoxShow";

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
  const { show, setShow, isMobile } = useProfileBoxShow();

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
        <Typography onClick={() => setShow(!show)} variant="h3">
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
