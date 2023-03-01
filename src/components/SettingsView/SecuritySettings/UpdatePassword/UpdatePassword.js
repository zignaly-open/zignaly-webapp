import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Passwords from "../../../Passwords";
import CustomButton from "../../../CustomButton";
import EditIcon from "../../../../images/ct/edit.svg";
import PasswordInput from "../../../Passwords/PasswordInput";
import tradeApi from "../../../../services/tradeApiClient";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { navigateLogin } from "services/navigation";
import { endTradeApiSession } from "store/actions/session";
import "./UpdatePassword.scss";
import { useStoreUserData } from "hooks/useStoreUserSelector";
import TwoFAForm from "components/Forms/TwoFAForm";
import CustomModal from "components/Modal";

/**
 * Provides a component to update password.
 *
 * @returns {JSX.Element} Component JSX.
 */
const UpdatePassword = () => {
  const dispatch = useDispatch();
  const formMethods = useForm({ mode: "onBlur" });
  const { errors, handleSubmit, register, setError } = formMethods;
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const userData = useStoreUserData();
  const [twoFAModal, showTwoFAModal] = useState(false);
  const [formData, setFormData] = useState(null);

  /**
   * @typedef {Object} FormData
   * @property {string} currentPassword
   * @property {string} password
   * @property {string} [code]
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const submitPassword = (data) => {
    const { currentPassword: password, password: newPassword, code } = data;
    const payload = {
      password,
      newPassword,
      code,
    };

    setLoading(true);

    tradeApi
      .updatePassword(payload)
      .then(() => {
        dispatch(
          showSuccessAlert("Success", intl.formatMessage({ id: "security.password.success" })),
        );
        dispatch(endTradeApiSession());
        navigateLogin();
      })
      .catch((e) => {
        if (e.code === 7) {
          setError("currentPassword", {
            type: "notMatch",
            message: intl.formatMessage({ id: "form.error.password.invalid" }),
          });
        } else {
          dispatch(showErrorAlert(e));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const submit = (data) => {
    if (userData.ask2FA) {
      setFormData(data);
      showTwoFAModal(true);
    } else {
      submitPassword(data);
    }
  };

  return (
    <>
      <CustomModal
        onClose={() => showTwoFAModal(false)}
        persist={false}
        size="small"
        state={twoFAModal}
      >
        <TwoFAForm onComplete={(code) => submitPassword({ ...formData, code })} />
      </CustomModal>
      <form className="updatePassword" method="post" onSubmit={handleSubmit(submit)}>
        <Box className="inputBox" display="flex" flexDirection="column" width={1}>
          <Box className="passwordBox" display="flex" width={1}>
            <PasswordInput
              disabled={!editing}
              error={!!errors.currentPassword}
              inputRef={register({ required: true })}
              label={<FormattedMessage id={"security.password.current"} />}
              name="currentPassword"
              placeholder={!editing ? "•••••••••" : ""}
            />

            {!editing && (
              <img
                aria-labelledby="Edit password"
                className="iconPurple"
                onClick={() => setEditing(true)}
                src={EditIcon}
                title="Edit"
              />
            )}
          </Box>
          {errors && errors.currentPassword && (
            <span className="errorText">{errors.currentPassword.message}</span>
          )}
          {!editing && (
            <Box pt="17px">
              <Typography className="bold" variant="subtitle2">
                <FormattedMessage id="security.note" />
              </Typography>
              <Typography className="callout1">
                <FormattedMessage id="security.passwordnote" />
              </Typography>
            </Box>
          )}
        </Box>
        {editing && (
          <>
            <Passwords edit={true} formMethods={formMethods} />
            <CustomButton className="bgPurple bold" loading={loading} type="submit">
              <FormattedMessage id="security.submit" />
            </CustomButton>
          </>
        )}
      </form>
    </>
  );
};

export default UpdatePassword;
