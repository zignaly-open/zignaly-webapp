import React, { useState } from "react";
import "./ResetForm.scss";
import { Box, Typography } from "@material-ui/core";
import Logo from "images/logo/logoNW.svg";
import { FormattedMessage } from "react-intl";
import Link from "components/LocalizedLink";

/**
 * @param {Object} props Props.
 * @param {string} props.code Reset Code.
 * @param {function} props.form Form component to embed.
 * @returns {JSX.Element} JSx component.
 */
const ResetForm = ({ code, form: Form }) => {
  const [expired, setExpired] = useState(false);

  return (
    <Box
      alignItems="center"
      className="resetForm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {!expired ? (
        <>
          <img alt="Zignaly" className="logo" src={Logo} />
          <Form code={code} setExpired={setExpired} />
        </>
      ) : (
        <Box alignItems="center" className="errorBox" display="flex" flexDirection="column">
          <Typography variant="h3">
            <FormattedMessage id="recover.error" />
          </Typography>
          <Link className="loginLink" to="/login">
            <FormattedMessage id="backtologin.text" />
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default ResetForm;
