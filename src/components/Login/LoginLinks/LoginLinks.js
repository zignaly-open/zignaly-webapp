import React from "react";
import "./LoginLinks.scss";
import { Box } from "@material-ui/core";
import Link from "../../LocalizedLink";
import { FormattedMessage } from "react-intl";

const LoginLinks = () => {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const ret = params.get("ret");

  /**
   *
   * @param {string} link String to test in the url.
   * @returns {Boolean} Flag if the link is active or not.
   */
  const active = (link) => {
    let url = "";
    if (typeof window !== "undefined") {
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
      <Link
        className={"loginLinkItem " + (active("login") ? "activeLink" : "")}
        to={ret ? `/login?ret=${ret}` : "/login"}
      >
        <FormattedMessage id="login.title" />
      </Link>
      <Link
        className={"loginLinkItem " + (active("signup") ? "activeLink" : "")}
        to={ret ? `/signup?ret=${ret}` : "/signup"}
      >
        <FormattedMessage id="signup.title" />
      </Link>
    </Box>
  );
};

export default LoginLinks;
