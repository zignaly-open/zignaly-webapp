import React from "react";
import "./Loader.scss";
import { Box } from "@mui/material";
import LogoWhite from "../../images/logo/logoNW.svg";
import LogoBlack from "../../images/logo/logoNB.svg";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";

const Loader = () => {
  const storeSettings = useStoreSettingsSelector();

  return (
    <Box
      alignItems="center"
      bgcolor="background.paper"
      className="wrapper"
      display="flex"
      flexDirection="row"
      justifyContent="center"
    >
      <Box>
        <Box className={"loader " + (storeSettings.darkStyle ? "dark" : "light")} />
        <img alt="logo" className="logo" src={storeSettings.darkStyle ? LogoWhite : LogoBlack} />
      </Box>
    </Box>
  );
};

export default Loader;
