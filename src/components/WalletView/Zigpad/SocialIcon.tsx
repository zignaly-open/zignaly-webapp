import React from "react";
import FacebookIcon from "images/launchpad/facebook.inline.svg";
import TwitterIcon from "images/launchpad/twitter.inline.svg";
import DiscordIcon from "images/launchpad/discord.inline.svg";
import TelegramIcon from "images/launchpad/telegram.inline.svg";

const getIcon = (type: string) => {
  switch (type) {
    case "facebook":
      return FacebookIcon;
    case "twitter":
      return TwitterIcon;
    case "telegram":
      return TelegramIcon;
    case "discord":
      return DiscordIcon;
    default:
      return null;
  }
};
const SocialIcon = ({ type }: { type: string }) => {
  const Icon = getIcon(type);
  return <Icon width={24} height={24} />;
};

export default SocialIcon;
