import React, { useState, useEffect } from "react";
import "./changeEmail.scss";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import Logo from "../../images/logo/logoNW.svg";
import tradeApi from "../../services/tradeApiClient";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "../../components/LocalizedLink";
import ChangeEmailForm from "components/Forms/ChangeEmailForm";
import ResetForm from "components/Forms/ResetForm";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} token Token aquired by the change email request.
 */

/**
 * Change Email page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Change email element.
 */
const ChangeEmail = ({ token }) => {
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({ id: "changeemail.title" })} | ${intl.formatMessage({
            id: "product",
          })}`}
        </title>
      </Helmet>
      <ResetForm
        form={ChangeEmailForm}
        code={token}
        verifyCode={(code) => tradeApi.changeEmailVisit({ token: code })}
      />
    </>
  );
};

export default ChangeEmail;
