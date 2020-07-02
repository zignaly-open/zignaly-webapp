import React from "react";
import Documents from "../../../images/header/documents.svg";
import MyExchange from "../../../images/header/myExchange.svg";
import Message from "../../../images/header/message.svg";
import SignOut from "../../../images/header/signOut.svg";
import Support from "../../../images/header/support.svg";
import Settings from "../../../images/dashboard/settings.svg";
import { Box, MenuItem } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { endTradeApiSession } from "../../../store/actions/session";
import { navigate } from "gatsby";
import { discordURL, docsURL } from "../../../utils/affiliateURLs";
import { navigate as navigateReach } from "@reach/router";

const UserMenu = () => {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(endTradeApiSession());
    navigate("/login");
  };

  const showDiscord = () => {
    window.open(discordURL, "_blank");
  };

  const showDocs = () => {
    window.open(docsURL, "_blank");
  };

  return (
    <Box alignItems="flex-start" className="userMenu" display="flex" flexDirection="column">
      <MenuItem
        className="userMenuItem"
        onClick={() => {
          navigateReach("#exchangeAccounts");
        }}
      >
        <img alt="zignaly" src={MyExchange} />
        <span className="item">
          <FormattedMessage id="menu.exchangeaccount" />
        </span>
      </MenuItem>
      {/* </Link> */}
      <MenuItem
        className="userMenuItem"
        onClick={() => {
          navigateReach("#settings");
        }}
      >
        <img alt="zignaly" src={Settings} />
        <span className="item">
          <FormattedMessage id="menu.settings" />
        </span>
      </MenuItem>
      <MenuItem className="userMenuItem" onClick={showDiscord}>
        <img alt="zignaly" src={Message} />
        <span className="item">
          <FormattedMessage id="menu.discord" />
        </span>
      </MenuItem>
      <MenuItem className="userMenuItem" onClick={showDocs}>
        <img alt="zignaly" src={Documents} />
        <span className="item">
          <FormattedMessage id="menu.help" />
        </span>
      </MenuItem>
      <MenuItem className="userMenuItem">
        <img alt="zignaly" src={Support} />
        <span className="item">
          <FormattedMessage id="menu.support" />
        </span>
      </MenuItem>
      <MenuItem className="userMenuItem" onClick={logout}>
        <img alt="zignaly" src={SignOut} />
        <span className="item">
          <FormattedMessage id="menu.signout" />
        </span>
      </MenuItem>
    </Box>
  );
};

export default UserMenu;
