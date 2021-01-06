import React, { useState, useEffect } from "react";
import "./disable2FA.scss";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import ConfirmTwoFADisableForm from "../../components/Forms/ConfirmTwoFADisableForm";
import Logo from "../../images/logo/logoWhite.png";
import tradeApi from "../../services/tradeApiClient";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
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
const Disable2FA = ({ token }) => {
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({ id: "security.2fa.disable" })} | ${intl.formatMessage({
            id: "product",
          })}`}
        </title>
      </Helmet>
      <ResetForm
        form={ConfirmTwoFADisableForm}
        code={token}
        verifyCode={(code) => tradeApi.disable2FAVisit({ token: code })}
      />
    </>
  );
};

export default Disable2FA;
