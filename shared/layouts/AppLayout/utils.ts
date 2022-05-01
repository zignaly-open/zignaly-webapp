// Assets
import {
  LogoTwitter,
  LogoDiscord,
  LogoMedium,
  PaperPlaneOutline,
  LogoYoutube,
  LogoLinkedin
} from "react-ionicons";

export const navigationRoutes = [
  {
    label: "Profit Sharing",
    path: "/dashboard"
  },
  {
    label: "Copy Trading",
    path: "/copy-trading"
  },
  {
    label: "Signals",
    path: "/signals"
  }
];

export const socialNetworksLinks = [
  {
    path: "https://twitter.com/zignaly",
    icon: LogoTwitter,
  },
  {
    path: "https://t.me/ZignalyHQ",
    icon: PaperPlaneOutline,
  },
  {
    path: "https://www.youtube.com/Zignaly",
    icon: LogoYoutube,
  },
  {
    path: "https://discord.gg/r5qRXDJ",
    icon: LogoDiscord,
  },
  {
    path: "https://medium.com/zignaly",
    icon: LogoMedium,
  },
  {
    path: "https://www.linkedin.com/company/zignaly/",
    icon: LogoLinkedin,
  }
];
