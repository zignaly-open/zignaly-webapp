import React from "react";
import UpdatePassword from "./UpdatePassword";
import Enable2FA from "./Enable2FA";
import { Box } from "@mui/material";
import "./SecuritySettings.scss";
import FAQ from "../../FAQ";

const SecuritySettings = () => {
  return (
    <Box alignItems="flex-start" className="securitySettings" display="flex" flexDirection="column">
      <UpdatePassword />
      <Enable2FA />
      <FAQ />
    </Box>
  );
};

export default SecuritySettings;
