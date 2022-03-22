import React from "react";
import "./SettingsView.scss";
import { Box, Typography } from "@mui/material";
import CustomButton from "../CustomButton";
import { FormattedMessage } from "react-intl";
import Preferences from "./Preferences";
import SecuritySettings from "./SecuritySettings";
import NotificationsSettings from "./NotificationsSettings";
import ProfileSettings from "./ProfileSettings";
import { SubNavModalHeader } from "../SubNavHeader";
import { navigate } from "@reach/router";
import GlobalModalHead from "../ConnectExchangeView/GlobalModalHead";

/**
 * @typedef {Object} DefaultProps
 * @property {Function} onClose
 */

/**
 * Connect exchange component.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Connect exchange element.
 */
const SettingsView = ({ onClose }) => {
  const currentHash =
    typeof window !== "undefined" && window.location.hash ? window.location.hash.substr(1) : "";
  const path = currentHash.split("-")[1] || "settings";

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleClose = () => {
    onClose();
  };

  const tabs = [
    {
      id: "settings",
      title: "settings.preferences",
    },
    {
      id: "settings-security",
      title: "security",
    },
    {
      id: "settings-notifications",
      title: "settings.notifications",
    },
    {
      id: "settings-profile",
      title: "settings.profile",
    },
  ];

  const renderContent = () => {
    switch (path) {
      default:
        return <Preferences />;
      case "security":
        return <SecuritySettings />;
      case "notifications":
        return <NotificationsSettings />;
      case "profile":
        return <ProfileSettings />;
    }
  };

  return (
    <Box className="settingsView">
      <GlobalModalHead
        actionBar={
          <>
            <CustomButton className="submitButton" onClick={handleClose}>
              <FormattedMessage id="accounts.done" />
            </CustomButton>
            {/* <Typography className="tempMessage" variant="body1">
          {tempMessage}
        </Typography> */}
          </>
        }
        titleBar={
          <Typography variant="h1">
            <FormattedMessage id="accounts.settings" />
          </Typography>
        }
      />
      <SubNavModalHeader
        currentPath={currentHash}
        links={tabs}
        onClick={(selectedPath) => navigate("#" + selectedPath)}
      />
      <Box className="settingsContent">{renderContent()}</Box>
    </Box>
  );
};

export default SettingsView;
