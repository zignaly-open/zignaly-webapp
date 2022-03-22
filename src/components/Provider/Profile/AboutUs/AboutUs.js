import React from "react";
import "./AboutUs.scss";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import ReactMarkdown from "react-markdown";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useProfileBoxShow from "../../../../hooks/useProfileBoxShow";
import breaks from "remark-breaks";

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
      className="aboutUs"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      {!isMobile && (
        <Typography variant="h3">
          <FormattedMessage id="srv.about" />
        </Typography>
      )}

      {isMobile && (
        <Typography onClick={() => setShow(!show)} variant="h3">
          <FormattedMessage id="srv.about" />
          {show && <ExpandLessIcon className="expandIcon" />}
          {!show && <ExpandMoreIcon className="expandIcon" />}
        </Typography>
      )}

      {show && (
        <Box className="aboutBody markdownContent">
          <ReactMarkdown linkTarget="_blank" plugins={[breaks]} source={provider.about} />
        </Box>
      )}
    </Box>
  );
};

export default AboutUs;
