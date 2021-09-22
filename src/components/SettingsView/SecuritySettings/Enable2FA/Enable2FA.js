import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, OutlinedInput } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import "./Enable2FA.scss";
import { useForm } from "react-hook-form";
import CustomButton from "../../../CustomButton";
import tradeApi from "../../../../services/tradeApiClient";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { useStoreUserData } from "../../../../hooks/useStoreUserSelector";
import { enable2FA, getUserData } from "../../../../store/actions/user";

/**
 * Provides a component to enable 2FA.
 *
 * @returns {JSX.Element} Component JSX.
 */
const Enable2FA = () => {
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const storeUserData = useStoreUserData();
  const { handleSubmit, setError, register, errors } = useForm();
  const [editing, setEditing] = useState(false);
  const twoFAEnabled = storeUserData.twoFAEnable;
  const [code, setCode] = useState(null);
  const [qrCodeImg, setQRCodeImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const getCode = () => {
    if (editing) {
      // Get 2FA code.
      tradeApi
        .enable2FA1Step()
        .then((response) => {
          setCode(response[0]);
          setQRCodeImg(response[1]);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  useEffect(getCode, [editing]);

  /**
   * @typedef {Object} FormData
   * @property {string} code
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const submitCode = (data) => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      code: data.code,
    };

    setLoading(true);

    const apiMethod = twoFAEnabled ? tradeApi.disable2FA : tradeApi.enable2FA2Step;

    apiMethod
      .call(tradeApi, payload)
      .then(() => {
        dispatch(enable2FA(!twoFAEnabled));
        const msg = twoFAEnabled ? "security.2fa.disable.success" : "security.2fa.enable.success";
        dispatch(showSuccessAlert("Success", intl.formatMessage({ id: msg })));
        dispatch(getUserData());
        // if (!twoFAEnabled) {
        //   navigate("/login");
        // }
      })
      .catch((/** @type {*} **/ e) => {
        if (e.code === 37) {
          setError("code", {
            type: "manual",
            message: intl.formatMessage({ id: "security.2fa.wrongcode" }),
          });
        } else {
          dispatch(showErrorAlert(e));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box className="enable2FA" display="flex" flexDirection="column">
      <Typography>
        <FormattedMessage id="security.2fa" />
      </Typography>
      {!editing && !twoFAEnabled ? (
        <CustomButton className="textPurple borderPurple bold" onClick={() => setEditing(true)}>
          <FormattedMessage id="security.setup" />
        </CustomButton>
      ) : !twoFAEnabled && !code ? (
        <Box display="flex" flexDirection="row" justifyContent="center" pt="24px">
          <CircularProgress disableShrink />
        </Box>
      ) : (
        <form method="post" onSubmit={handleSubmit(submitCode)}>
          {!twoFAEnabled && (
            <>
              <Typography className="bold" variant="body1">
                <FormattedMessage id="security.2fa.scan" />
              </Typography>
              <img aria-labelledby="QR Code" className="qrCode" src={qrCodeImg} />
              <Typography>
                <FormattedMessage id="security.2fa.manually" />
              </Typography>
              <Typography className="code" variant="body1">
                {code}
              </Typography>
            </>
          )}
          <Box display="flex" flexDirection="column">
            <label htmlFor="code">
              <Typography className="code" variant="body1">
                <FormattedMessage id="security.2fa.mobile" />
              </Typography>
            </label>
            <OutlinedInput
              className="customInput"
              error={!!errors.code}
              id="code"
              inputProps={{
                min: 0,
              }}
              inputRef={register({ required: true, min: 0, minLength: 6, maxLength: 6 })}
              name="code"
              placeholder="6 digits"
              type="number"
            />
            {errors.code && <span className="errorText">{errors.code.message}</span>}
          </Box>
          <CustomButton className="bgPurple bold" loading={loading} type="submit">
            <FormattedMessage id={`security.2fa.${twoFAEnabled ? "disable" : "enable"}`} />
          </CustomButton>
        </form>
      )}
    </Box>
  );
};

export default Enable2FA;
