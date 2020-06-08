import React from "react";
import "./Loader.scss";
import { Box } from "@material-ui/core";
import Logo from "../../images/logo/LogoWhite.svg";

const Loader = () => {
  return (
    <Box
      className="wrapper"
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <Box className="loader"></Box>
        <img src={Logo} alt="logo" className="logo" />
      </Box>
    </Box>
  );
};

export default Loader;
