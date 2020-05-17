import React from "react";
import "./Alert.scss";
import { Box } from "@material-ui/core";

const Popup = () => {
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

export default Popup;
