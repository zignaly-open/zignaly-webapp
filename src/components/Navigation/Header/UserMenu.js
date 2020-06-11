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
// import { navigate, History } from "@reach/router";
import { useNavigate } from "@reach/router";
import { Router, Link as LinkLocal } from "@reach/router";
import { discordURL, docsURL } from "../../../utils/affiliateURLs";
import { openExchangeConnectionView, openSettingsView } from "../../../store/actions/ui";
import { Link } from "gatsby";
// import { Link } from "gatsby-plugin-modal-routing";

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

  const showExchangeConnectionView = () => {
    // dispatch(openExchangeConnectionView(true));
    navigate("#exchangeAccounts");
    //   window.location.pathname = "exchangeAccounts";
    //   window.history.replaceState("exchangeAccounts");
    // window.history.pushState(null, "", "/exchangeAccounts");
  };

  const showSettingsView = () => {
    dispatch(openSettingsView(true));
  };

  return (
    <Box alignItems="flex-start" className="userMenu" display="flex" flexDirection="column">
      {/* <LinkLocal
        to="exchangeAccounts"
        hhref="/exchangeAccounts"
        honClick={(e) => e.preventDefault()}
      > */}
      <MenuItem className="userMenuItem" onClick={showExchangeConnectionView}>
        <img alt="zignaly" src={MyExchange} />
        <span className="item">
          <FormattedMessage id="menu.exchangeaccount" />
        </span>
      </MenuItem>
      {/* </LinkLocal> */}
      <MenuItem className="userMenuItem" onClick={showSettingsView}>
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
