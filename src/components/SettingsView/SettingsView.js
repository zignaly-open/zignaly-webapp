import React from "react";
import "./SettingsView.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../CustomButton";
import { FormattedMessage } from "react-intl";
import Preferences from "./Preferences";
import { SubNavModalHeader } from "../SubNavHeader";
import { navigate } from "@reach/router";

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
const SettingsView = (props) => {
  const currentHash =
    typeof window !== "undefined" && window.location.hash ? window.location.hash.substr(1) : "";
  const path = currentHash.split("-")[1];

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleClick = () => {
    props.onClose();
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
      <SubNavModalHeader links={tabs} currentPath={path} onClick={(path) => navigate("#" + path)} />

      <Box className="actionBar">
        <CustomButton className="submitButton" onClick={handleClick}>
          Done
        </CustomButton>
      </Box>
      <Box className="titleBar">
        <Typography variant="h1">
          <FormattedMessage id="accounts.settings" />
        </Typography>
      </Box>
      <Box className="settingsContent">{renderContent()}</Box>
    </Box>
  );
};

export default SettingsView;
