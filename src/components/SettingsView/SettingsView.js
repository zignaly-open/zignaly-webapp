import React from "react";
import "./SettingsView.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../CustomButton";
import { FormattedMessage } from "react-intl";

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
  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleClick = () => {
    props.onClose();
  };

  return (
    <Box
      alignItems="center"
      className="connectExchangeView"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
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
    </Box>
  );
};

export default SettingsView;
