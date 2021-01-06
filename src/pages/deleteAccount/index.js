import React from "react";
import "./deleteAccount.scss";
import ConfirmDeleteAccountForm from "../../components/Forms/ConfirmDeleteAccountForm";
import { Helmet } from "react-helmet";
import ResetForm from "components/Forms/ResetForm";
import tradeApi from "services/tradeApiClient";
import { useIntl } from "react-intl";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} code Code required by the delete request.
 */

/**
 * Delete account page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} JSX
 */
const DeleteAccount = ({ code }) => {
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({ id: "deleteaccount.title" })} | ${intl.formatMessage({
            id: "product",
          })}`}
        </title>
      </Helmet>
      <ResetForm
        form={ConfirmDeleteAccountForm}
        code={code}
        verifyCode={(code) => tradeApi.deleteAccountVisit({ token: code })}
      />
    </>
  );
};

export default DeleteAccount;
