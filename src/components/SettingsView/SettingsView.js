import React from "react";
import "./SettingsView.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../CustomButton";
import { FormattedMessage } from "react-intl";
import Preferences from "./Preferences";
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
  const path = currentHash.split("-")[1] || "";

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
      id: "",
      title: "settings.preferences",
    },
    {
      id: "security",
      title: "security",
    },
    {
      id: "notifications",
      title: "settings.notifications",
    },
    {
      id: "profile",
      title: "settings.profile",
    },
  ];

  const renderContent = () => {
    switch (path) {
      default:
        return <Preferences />;
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
      <SubNavModalHeader links={tabs} currentPath={path} onClick={(path) => navigate("#" + path)} />
      <Box className="settingsContent">{renderContent()}</Box>
    </Box>
  );
};

export default SettingsView;
