import React from "react";
import "./SocialLink.scss";
import FacebookIcon from "../../../../images/ct/facebook.svg";
import TwitterIcon from "../../../../images/ct/twitter.svg";
import DiscordIcon from "../../../../images/ct/discord.svg";
import LinkedinIcon from "../../../../images/ct/linkedin.svg";
import TelegramIcon from "../../../../images/ct/telegram.svg";
import EmailIcon from "@material-ui/icons/Email";
import { prefixLinkForXSS } from "utils/formatters";
import { Link } from "gatsby";

/**
 * @param {Object} props Props
 * @param {string} props.type Link type
 * @param {string} props.url Url
 * @returns {JSX.Element} Component JSX.
 */
const SocialLink = ({ type, url }) => {
  let icon = "";
  switch (type) {
    case "facebook":
      icon = FacebookIcon;
      break;
    case "twitter":
      icon = TwitterIcon;
      break;
    case "linkedin":
      icon = LinkedinIcon;
      break;
    case "telegram":
      icon = TelegramIcon;
      break;
    case "discord":
      icon = DiscordIcon;
      break;
    default:
      break;
  }
  return (
    <>
      {type !== "email" ? (
        <Link target="_blank" to={prefixLinkForXSS(url)}>
          <img className="icon" src={icon} />
        </Link>
      ) : (
        <a href={"mailto:" + url} rel="noreferrer" target="_blank">
          <EmailIcon className="icon" />
        </a>
      )}
    </>
  );
};

export default SocialLink;
