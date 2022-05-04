import React from "react";
import { Box } from "@mui/material";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";

const LoginLinks = () => {
  const router = useRouter();

  return (
    <Box
      alignItems="center"
      className="loginLinks"
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
    >
      <Link href={{ pathname: "/login", query: router.query }}>
        <a className={router.pathname == "/" || router.pathname == "/login" ? "active" : ""}>
          <FormattedMessage id="login.title" />
        </a>
      </Link>
      <Link href={{ pathname: "/signup", query: router.query }}>
        <a className={router.pathname == "/signup" ? "active" : ""}>
          <FormattedMessage id="action.signup" />
        </a>
      </Link>
    </Box>
  );
};

export default LoginLinks;
