import React, { useContext, useState } from "react";
import Documents from "../../../images/header/documents.svg";
import MyExchange from "../../../images/header/myExchange.svg";
import Message from "../../../images/header/message.svg";
import SignOut from "../../../images/header/signOut.svg";
import Settings from "../../../images/dashboard/settings.svg";
import { Box, MenuItem, Grow, Modal } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { discordURL, docsURL } from "../../../utils/affiliateURLs";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import LanguageIcon from "@material-ui/icons/Language";
import LanguageSwitcher from "../../LanguageSwitcher";
import { navigate as navigateReach } from "@reach/router";
import { navigateLogin } from "../../../services/navigation";
import { useStoreUserExchangeConnections } from "hooks/useStoreUserSelector";
import InviteModal from "./InviteModal";
import { RecordVoiceOver } from "@material-ui/icons";
import PrivateAreaContext from "context/PrivateAreaContext";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Function} onClose
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSX component.
 */
const UserMenu = ({ onClose }) => {
  const [languageSelector, showLanguageSelector] = useState(false);
  const exchangeConnections = useStoreUserExchangeConnections();
  const { showInviteModal } = useContext(PrivateAreaContext);

  const logout = () => {
    navigateLogin();
    onClose();
  };

  const showDiscord = () => {
    window.open(discordURL, "_blank");
    onClose();
  };

  const showDocs = () => {
    window.open(docsURL, "_blank");
    onClose();
  };

  const showInvite = () => {
    showInviteModal(true);
    onClose();
  };

  return (
    <Box alignItems="flex-start" className="userMenu" display="flex" flexDirection="column">
      <MenuItem
        className="userMenuItem"
        onClick={() => {
          navigateReach("#exchangeAccounts");
          onClose();
        }}
      >
        <img alt="zignaly" className="iconPurple" src={MyExchange} />
        <span className="item">
          <FormattedMessage
            id={exchangeConnections.length > 1 ? "menu.exchangeaccount" : "menu.myaccount"}
          />
        </span>
      </MenuItem>
      {/* </Link> */}
      <MenuItem
        className="userMenuItem"
        onClick={() => {
          navigateReach("#settings");
          onClose();
        }}
      >
        <img alt="zignaly" className="iconPurple" src={Settings} />
        <span className="item">
          <FormattedMessage id="menu.settings" />
        </span>
      </MenuItem>
      <MenuItem className="userMenuItem" onClick={showInvite}>
        <RecordVoiceOver className="iconPurple" />
        <span className="item">
          <FormattedMessage id="accounts.invite" />
        </span>
      </MenuItem>
      <MenuItem className="userMenuItem" onClick={showDiscord}>
        <img alt="zignaly" className="iconPurple" src={Message} />
        <span className="item">
          <FormattedMessage id="menu.discord" />
        </span>
      </MenuItem>
      <MenuItem className="userMenuItem" onClick={showDocs}>
        <img alt="zignaly" className="iconPurple" src={Documents} />
        <span className="item">
          <FormattedMessage id="menu.help" />
        </span>
      </MenuItem>
      <MenuItem className="userMenuItem" onClick={() => showLanguageSelector(!languageSelector)}>
        <LanguageIcon className="icon iconPurple" color="primary" />
        <span className="item">
          <FormattedMessage id="menu.language" />
        </span>
        {languageSelector ? (
          <ExpandLessIcon className="expandIcon" color="primary" />
        ) : (
          <ExpandMoreIcon className="expandIcon" color="primary" />
        )}
      </MenuItem>
      {languageSelector && (
        <Grow in={languageSelector}>
          <Box className="languageBox">
            <LanguageSwitcher />
          </Box>
        </Grow>
      )}
      <MenuItem className="userMenuItem" onClick={logout}>
        <img alt="zignaly" className="iconPurple" src={SignOut} />
        <span className="item">
          <FormattedMessage id="menu.signout" />
        </span>
      </MenuItem>
    </Box>
  );
};

export default UserMenu;
