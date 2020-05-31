import React from "react";
import "./ConnectExchangeView.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../CustomButton";
import { FormattedMessage } from "react-intl";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Function} onClose
 */

/**
 *
 * @param {DefaultProps} props
 */
const ConnectExchangeView = (props) => {
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
          <FormattedMessage id="dashboard.connectexchange.bold.title" />
        </Typography>
      </Box>
    </Box>
  );
};

export default ConnectExchangeView;
