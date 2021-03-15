import React, { Fragment } from "react";
import "./WhoWeAre.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FacebookIcon from "../../../../images/ct/facebook.svg";
import TwitterIcon from "../../../../images/ct/twitter.svg";
import DiscordIcon from "../../../../images/ct/discord.svg";
import LinkedinIcon from "../../../../images/ct/linkedin.svg";
import TelegramIcon from "../../../../images/ct/telegram.svg";
import EmailIcon from "@material-ui/icons/Email";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useProfileBoxShow from "../../../../hooks/useProfileBoxShow";
import FlagIcon from "components/FlagIcon";
import { prefixLinkForXSS } from "utils/formatters";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Who we are compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const WhoWeAre = ({ provider }) => {
  const { show, setShow, isMobile } = useProfileBoxShow();

  /**
   * Function to redirect to social links.
   *
   * @param {String} link Link of the social accound.
   * @returns {void} None.
   */
  const redirectToSocial = (link) => {
    if (typeof window !== "undefined") {
      window.open(prefixLinkForXSS(link), "_blank");
    }
  };

  return (
    <Box
      alignItems="flex-start"
      className="whoWeAre"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      {!isMobile && (
        <Typography variant="h3">
          <FormattedMessage id="srv.who" />
        </Typography>
      )}

      {isMobile && (
        <Typography onClick={() => setShow(!show)} variant="h3">
          <FormattedMessage id="srv.who" />
          {show && <ExpandLessIcon className="expandIcon" />}
          {!show && <ExpandMoreIcon className="expandIcon" />}
        </Typography>
      )}
      {show && (
        <>
          <Box
            alignItems="flex-start"
            className="topBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Box className="teamBox" display="flex" flexDirection="row" flexWrap="wrap">
              {provider.team &&
                provider.team.length > 0 &&
                provider.team.map((item, index) => (
                  <Box
                    alignItems="center"
                    className="teamItem"
                    display="flex"
                    flexDirection="row"
                    key={index}
                  >
                    <span className="name">{item.name}</span>
                    <FlagIcon className="flag" code={item.countryCode.toUpperCase()} />
                  </Box>
                ))}
            </Box>
          </Box>
          <Box
            alignItems="flex-start"
            className="bottomBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Typography variant="h3">
              <FormattedMessage id="srv.social" />
            </Typography>

            <Box
              alignItems="center"
              className="socialBox"
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
            >
              {provider.social &&
                provider.social.length > 0 &&
                provider.social.map((item, index) => (
                  <Fragment key={index}>
                    {item.network && item.network.toLowerCase() === "facebook" && (
                      <img
                        alt="faceook-icon"
                        className="icon"
                        onClick={() => redirectToSocial(item.link)}
                        src={FacebookIcon}
                      />
                    )}
                    {item.network && item.network.toLowerCase() === "twitter" && (
                      <img
                        alt="twitter-icon"
                        className="icon"
                        onClick={() => redirectToSocial(item.link)}
                        src={TwitterIcon}
                      />
                    )}
                    {item.network && item.network.toLowerCase() === "linkedin" && (
                      <img
                        alt="linkedin-icon"
                        className="icon"
                        onClick={() => redirectToSocial(item.link)}
                        src={LinkedinIcon}
                      />
                    )}
                    {item.network && item.network.toLowerCase() === "telegram" && (
                      <img
                        alt="tttt-icon"
                        className="icon"
                        onClick={() => redirectToSocial(item.link)}
                        src={TelegramIcon}
                      />
                    )}
                    {item.network && item.network.toLowerCase() === "discord" && (
                      <img
                        alt="discord-icon"
                        className="icon"
                        onClick={() => redirectToSocial(item.link)}
                        src={DiscordIcon}
                      />
                    )}
                    {item.network && item.network.toLowerCase() === "email" && (
                      <a href={"mailto:" + item.link} rel="noreferrer" target="_blank">
                        <EmailIcon className="icon" />
                      </a>
                    )}
                  </Fragment>
                ))}
            </Box>
          </Box>
          <Typography
            className="website"
            onClick={() => redirectToSocial(provider.website)}
            variant="body1"
          >
            {provider.website}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default WhoWeAre;
