import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import "./SecuritySettings.scss";
import { useForm } from "react-hook-form";
import CustomButton from "../../../CustomButton";
import tradeApi from "../../../../services/tradeApiClient";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import FAQ from "../../../FAQ";
import QRCode from "qrcode.react";

/**
 * Provides a component to enable 2FA.
 *
 * @returns {JSX.Element} Component JSX.
 */
const Enable2FA = () => {
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const { handleSubmit, setError } = useForm({ mode: "onBlur" });
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
    <Box>
      {!editing ? (
        <CustomButton className="textPurple borderPurple bold">
          <FormattedMessage id="security.2fa.enable" />
        </CustomButton>
      ) : (
        <form onSubmit={handleSubmit(submitPassword)}>
          <FormattedMessage id="security.2fa" />
          <Typography variant="body2">
            <FormattedMessage id="security.2fa.scan" />
          </Typography>
          <FormattedMessage id="security.2fa.manually" />

          <QRCode value="" />
          <label>
            <FormattedMessage id="security.2fa.mobile" />
          </label>
          <CustomButton className="bgPurple bold" loading={loading} type="submit">
            <FormattedMessage id="security.2fa.enable" />
          </CustomButton>
        </form>
      )}
      <FAQ />
    </Box>
  );
};

export default Enable2FA;
