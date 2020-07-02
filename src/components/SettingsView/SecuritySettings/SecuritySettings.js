import React, { useState } from "react";
import UpdatePassword from "./UpdatePassword";
import { Box } from "@material-ui/core";
import "./SecuritySettings.scss";

const SecuritySettings = () => {
  return (
    <Box alignItems="flex-start" className="securitySettings" display="flex" flexDirection="column">
      <UpdatePassword />
    </Box>
  );
};

export default SecuritySettings;
