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
