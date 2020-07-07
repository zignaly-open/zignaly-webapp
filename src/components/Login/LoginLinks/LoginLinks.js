import React from "react";
import "./LoginLinks.scss";
import { Box } from "@material-ui/core";
import Link from "../../LocalizedLink";
import { FormattedMessage } from "react-intl";

const LoginLinks = () => {
  return (
    <Box
      className="loginLinks"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-evenly"
    >
      <Link activeClassName="activeLink" className="loginLinkItem" to="/login">
        <FormattedMessage id="login.title" />
      </Link>
      <Link activeClassName="activeLink" className="loginLinkItem" to="/signup">
        <FormattedMessage id="signup.title" />
      </Link>
    </Box>
  );
};

export default LoginLinks;
