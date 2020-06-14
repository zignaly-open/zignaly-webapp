import React, { useState, useEffect } from "react";
import "./WhoWeAre.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FacebookIcon from "../../../../images/ct/facebook.svg";
import TwitterIcon from "../../../../images/ct/twitter.svg";
import DiscordIcon from "../../../../images/ct/discord.svg";
import LinkedinIcon from "../../../../images/ct/linkedin.svg";
import TelegramIcon from "../../../../images/ct/telegram.svg";
import { countries } from "countries-list";

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
    if (provider.team && provider.team.length) {
      let data = [];
      for (let a = 0; a < provider.team.length; a++) {
        let found = list.find(
          (item) => item.countryCode.toLowerCase() === provider.team[a].countryCode.toLowerCase(),
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

  console.log(provider.team);

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
              display="flex"
              flexDirection="row"
              alignItems="center"
              key={index}
              className="teamItem"
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
