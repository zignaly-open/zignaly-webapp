// @ts-nocheck (wip)
/* eslint-disable */
import React, { useState } from "react";
import { Box, Typography, Checkbox, FormControlLabel, OutlinedInput } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FillWhite from "../../../images/sidebar/fillWhite.svg";
import { useDispatch } from "react-redux";
import { selectDarkTheme, setShowBalance } from "../../../store/actions/settings";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import "./SecuritySettings.scss";
import { useForm } from "react-hook-form";
import Passwords from "../../Passwords";
import CustomButton from "../../CustomButton";
import EditIcon from "../../../images/ct/edit.svg";
import PasswordInput from "../../Passwords/PasswordInput";
import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";

const SecuritySettings = () => {
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const formMethods = useForm({ mode: "onBlur" });
  const { errors, handleSubmit, register, setError, clearError } = formMethods;
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * @typedef {Object} FormData
   * @property {string} currentPassword
   * @property {string} password
   * @property {string} repeatPassword
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const submitPassword = (data) => {
    const { currentPassword: password, password: newPassword, repeatPassword } = data;
    const payload = {
      token: storeSession.tradeApi.accessToken,
      password,
      newPassword,
      repeatPassword,
    };

    setLoading(true);

    tradeApi
      .updatePassword(payload)
      .then(() => {
        dispatch(showSuccessAlert("Success", "Changed Password Successfully"));
        setEditing(false);
      })
      .catch((e) => {
        if (e.code === 7) {
          setError("currentPassword", "notMatch", "Wrong credentials.");
        } else {
          dispatch(showErrorAlert(e));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box alignItems="flex-start" className="securitySettings" display="flex" flexDirection="column">
      <form onSubmit={handleSubmit(submitPassword)}>
        <Box display="flex" width={1} flexDirection="column" className="inputBox">
          <Box display="flex" width={1} className="passwordBox">
            <PasswordInput
              label={<FormattedMessage id={"security.password.current"} />}
              name="currentPassword"
              inputRef={register({ required: true })}
              error={!!errors.currentPassword}
              disabled={!editing}
              placeholder={!editing ? "•••••••••" : ""}
            />

            {!editing && (
              <img
                onClick={() => setEditing(true)}
                src={EditIcon}
                title="Edit"
                aria-describedby="Edit password"
              />
            )}
          </Box>
          {errors && errors.currentPassword && (
            <span className="errorText">{errors.currentPassword.message}</span>
          )}
        </Box>
        {editing && (
          <>
            <Passwords formMethods={formMethods} edit={true} />
            <CustomButton className="bgPurple bold" type="submit" loading={loading}>
              <FormattedMessage id="security.submit" />
            </CustomButton>
          </>
        )}
      </form>
    </Box>
  );
};

export default SecuritySettings;
