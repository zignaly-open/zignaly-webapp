import React from "react";
import "./LoginLinks.scss";
import { Box } from "@material-ui/core";
import Link from "../../LocalizedLink";
import { FormattedMessage } from "react-intl";

const LoginLinks = () => {
  /**
   *
   * @param {string} link
   * @returns {*}
   */
  const active = (link) => {
    let url = "";
    if (typeof window !== undefined) {
      url = window.location.href;
    }
    if (url.includes(link)) {
      return true;
    }
    return false;
  };

  return (
    <Box
      alignItems="center"
      className="loginLinks"
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
    >
      <Link className={"loginLinkItem " + (active("login") ? "activeLink" : "")} to="/login">
        <FormattedMessage id="login.title" />
      </Link>
      <Link className={"loginLinkItem " + (active("signup") ? "activeLink" : "")} to="/signup">
        <FormattedMessage id="signup.title" />
      </Link>
    </Box>
  );
};

export default LoginLinks;
