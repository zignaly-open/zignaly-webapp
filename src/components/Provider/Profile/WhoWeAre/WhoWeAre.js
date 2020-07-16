import React, { useState, useEffect, Fragment } from "react";
import "./WhoWeAre.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FacebookIcon from "../../../../images/ct/facebook.svg";
import TwitterIcon from "../../../../images/ct/twitter.svg";
import DiscordIcon from "../../../../images/ct/discord.svg";
import LinkedinIcon from "../../../../images/ct/linkedin.svg";
import TelegramIcon from "../../../../images/ct/telegram.svg";
import { countries } from "countries-list";
import EmailIcon from "@material-ui/icons/Email";

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
  const [team, setTeam] = useState([]);
  const createList = () => {
    let obj = {
      name: "",
      native: "",
      phone: "",
      continent: "",
      capital: "",
      currency: "",
      languages: [""],
      emoji: "",
      emojiU: "",
      countryCode: "",
    };
    return Object.entries(countries).map((item) => {
      let val = { ...obj, ...item[1] };
      val.countryCode = item[0];
      return val;
    });
  };

  const list = createList();

  const initializeCounties = () => {
    if (provider.team && provider.team.length > 0) {
      let data = [];
      for (let a = 0; a < provider.team.length; a++) {
        let obj = { name: "", country: {} };
        let found = list.find(
          (item) =>
            provider.team[a].countryCode &&
            item.countryCode.toLowerCase() === provider.team[a].countryCode.toLowerCase(),
        );
        if (found) {
          obj.name = provider.team[a].name;
          obj.country = found;
          data.push(obj);
        }
      }
      // console.log(data);
      setTeam(data);
    }
  };

  useEffect(initializeCounties, [provider.team]);

  /**
   * Function to redirect to social links.
   *
   * @param {String} link Link of the social accound.
   * @returns {void} None.
   */
  const redirectToSocial = (link) => {
    if (typeof window !== "undefined") {
      window.open(link, "_blank");
    }
  };

  /**
   * Function to redirect to social profile.
   *
   * @param {String} link Link to the social media.
   */

  return (
    <Box
      alignItems="flex-start"
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
        <Box className="teamBox" display="flex" flexDirection="row" flexWrap="wrap">
          {team.map((item, index) => (
            <Box
              alignItems="center"
              className="teamItem"
              display="flex"
              flexDirection="row"
              key={index}
            >
              <span className="name">{item.name}</span>
              <span className="flag">{item.country.emoji}</span>,
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
          <FormattedMessage id="srv.find" />
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
    </Box>
  );
};

export default WhoWeAre;
