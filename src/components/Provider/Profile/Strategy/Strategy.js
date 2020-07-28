import React, { useState, useEffect } from "react";
import "./Strategy.scss";
import { Box, Typography, useMediaQuery } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ReactMarkdown from "react-markdown";
import { useTheme } from "@material-ui/core/styles";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [show, setShow] = useState(false);

  const initShow = () => {
    if (!isMobile) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(initShow, [isMobile]);

  console.log(show);

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
          <Typography variant="h3" onClick={() => setShow(!show)}>
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
        <Box className="strategyBody">
          <ReactMarkdown linkTarget="_blank" source={provider.strategy} />
        </Box>
      )}
    </Box>
  );
};

export default Strategy;
