import React from "react";
import "./Strategy.scss";
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
 * Strategy compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Strategy = ({ provider }) => {
  const { show, setShow, isMobile } = useProfileBoxShow();

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
        {!isMobile && (
          <Typography variant="h3">
            <FormattedMessage id="srv.strategy" />
          </Typography>
        )}

        {isMobile && (
          <Typography onClick={() => setShow(!show)} variant="h3">
            <FormattedMessage id="srv.strategy" />
            {show && <ExpandLessIcon className="expandIcon" />}
            {!show && <ExpandMoreIcon className="expandIcon" />}
          </Typography>
        )}

        {show && (
          <Typography variant="h4">
            <FormattedMessage id="srv.strategy.subtitle" />
          </Typography>
        )}
      </Box>
      {show && (
        <Box className="strategyBody markdownContent">
          <ReactMarkdown linkTarget="_blank" plugins={[breaks]} source={provider.strategy} />
        </Box>
      )}
    </Box>
  );
};

export default Strategy;
