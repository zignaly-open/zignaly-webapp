import React from "react";
import "./WhoWeAre.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FacebookIcon from "../../../../images/ct/facebook.svg";
import TwitterIcon from "../../../../images/ct/twitter.svg";
import DiscordIcon from "../../../../images/ct/discord.svg";
import LinkedinIcon from "../../../../images/ct/linkedin.svg";
import TelegramIcon from "../../../../images/ct/telegram.svg";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Strategy = ({ provider }) => {
  return (
    <Box
      alignItems="flex-start"
      bgcolor="grid.main"
      className="whoWeAre"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
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
        className="bottomBox"
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
        >
          <img alt="faceook-icon" className="icon" src={FacebookIcon} />
          <img alt="twitter-icon" className="icon" src={TwitterIcon} />
          <img alt="linkedin-icon" className="icon" src={LinkedinIcon} />
          <img alt="tttt-icon" className="icon" src={TelegramIcon} />
          <img alt="discord-icon" className="icon" src={DiscordIcon} />
        </Box>
      </Box>
      <Typography variant="body1">{provider.website}</Typography>
    </Box>
  );
};

export default Strategy;
