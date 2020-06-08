import React from "react";
import "./Loader.scss";
import { Box } from "@material-ui/core";
import LogoWhite from "../../images/logo/logoWhite.svg";
import LogoBlack from "../../images/logo/logoBlack.svg";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";

const Loader = () => {
  const storeSettings = useStoreSettingsSelector();

  return (
    <Box
      className="wrapper"
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.paper"
    >
      <Box>
        <Box className={"loader " + (storeSettings.darkStyle ? "dark" : "light")}></Box>
        <img src={storeSettings.darkStyle ? LogoWhite : LogoBlack} alt="logo" className="logo" />
      </Box>
    </Box>
  );
};

export default Loader;
