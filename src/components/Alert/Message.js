import React from "react";
import "./Alert.scss";
import { Box } from "@material-ui/core";

// /**
//  * @typedef {Object} AlertMessageProps
//  * @property {Object} message Object which will contain message data to display to the user.
//  */

// /**
//  * Message data which will be according to the type of alert
//  *
//  * @param {AlertMessageProps} props Component properties.
//  */

const PopupMessage = () => {
  return (
    <Box bgcolor="grid.main" className="alertMessage">
      <Box className="head">
        <span>I will be alert the title</span>
      </Box>
      <Box className="body">
        <span>I will be body</span>
        <span>I will be body</span>
        <span>I will be body</span>
      </Box>
    </Box>
  );
};

export default PopupMessage;
