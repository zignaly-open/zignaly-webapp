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
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Strategy = ({ provider }) => {
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
        let found = list.find(
          (item) =>
            provider.team[a].countryCode &&
            item.countryCode.toLowerCase() === provider.team[a].countryCode.toLowerCase(),
        );
        if (found) {
          data.push(found);
        }
      }
      // console.log(data);
      setTeam(data);
    }
  };

  useEffect(initializeCounties, [provider.team]);

  /**
   * Function to redirect to social profile.
   *
   * @param {String} link Link to the social media.
   */

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
        <Box display="flex" flexDirection="row" flexWrap="wrap">
          {team.map((item, index) => (
            <Box
              alignItems="center"
              className="teamItem"
              display="flex"
              flexDirection="row"
              key={index}
            >
              <span className="name">{item.name}</span>
              <span className="flag">{item.emoji}</span>,
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
                  <a href={item.link} rel="noreferrer" target="_blank">
                    <img alt="faceook-icon" className="icon" src={FacebookIcon} />
                  </a>
                )}
                {item.network && item.network.toLowerCase() === "twitter" && (
                  <a href={item.link} rel="noreferrer" target="_blank">
                    <img alt="twitter-icon" className="icon" src={TwitterIcon} />
                  </a>
                )}
                {item.network && item.network.toLowerCase() === "linkedin" && (
                  <a href={item.link} rel="noreferrer" target="_blank">
                    <img alt="linkedin-icon" className="icon" src={LinkedinIcon} />
                  </a>
                )}
                {item.network && item.network.toLowerCase() === "telegram" && (
                  <a href={item.link} rel="noreferrer" target="_blank">
                    <img alt="tttt-icon" className="icon" src={TelegramIcon} />
                  </a>
                )}
                {item.network && item.network.toLowerCase() === "discord" && (
                  <a href={item.link} rel="noreferrer" target="_blank">
                    <img alt="discord-icon" className="icon" src={DiscordIcon} />
                  </a>
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
      <Typography variant="body1">{provider.website}</Typography>
    </Box>
  );
};

export default Strategy;
