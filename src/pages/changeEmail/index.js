import React from "react";
import "./changeEmail.scss";
import tradeApi from "../../services/tradeApiClient";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
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
        code={token}
        form={ChangeEmailForm}
        verifyCode={(code) => tradeApi.changeEmailVisit({ token: code })}
      />
    </>
  );
};

export default ChangeEmail;
