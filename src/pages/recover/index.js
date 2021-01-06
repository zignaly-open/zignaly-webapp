import React, { useState, useEffect } from "react";
import "./recover.scss";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import ResetPasswordForm from "../../components/Forms/ResetPasswordForm";
import Logo from "../../images/logo/logoNW.svg";
import tradeApi from "../../services/tradeApiClient";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "../../components/LocalizedLink";
import ResetForm from "components/Forms/ResetForm";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} token Token aquired by the recover request.
 */

/**
 * Recover Password page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Recover Password element.
 */
const RecoverPassword = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({ id: "recover.title" })} | ${intl.formatMessage({
            id: "product",
          })}`}
        </title>
      </Helmet>
      <ResetForm
        form={ResetPasswordForm}
        code={token}
        verifyCode={(code) => tradeApi.forgotPasswordStep2({ token: code })}
      />
    </>
  );
};

export default RecoverPassword;
