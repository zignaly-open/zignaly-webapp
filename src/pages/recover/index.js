import React from "react";
import "./recover.scss";
import { Box } from "@material-ui/core";
import ResetPasswordForm from "../../components/Forms/ResetPasswordForm";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} code The position ID dynamic route path parameter.
 */

/**
 * Position detail page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */
const RecoverPassword = ({ code }) => {
  return (
    <Box
      className="recoverPasswordPage"
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      <ResetPasswordForm />
    </Box>
  );
};

export default RecoverPassword;
