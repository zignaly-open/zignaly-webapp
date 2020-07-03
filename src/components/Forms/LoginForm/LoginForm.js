import React, { useState, useEffect, useRef } from "react";
import "./LoginForm.scss";
import { Box, TextField } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import Modal from "../../Modal";
import ForgotPasswordForm from "../ForgotPasswordForm";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { startTradeApiSession } from "../../../store/actions/session";
import { isEmpty } from "lodash";
import { navigate } from "gatsby";
import { setUserExchanges, setUserData } from "../../../store/actions/user";
import Captcha from "../../Captcha";
import PasswordInput from "../../Passwords/PasswordInput";
import { FormattedMessage } from "react-intl";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import TwoFAForm from "../TwoFAForm";

/**
 * @typedef {import("../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../store/initialState").DefaultStateSession} StateSessionType
 */

const LoginForm = () => {
  const dispatch = useDispatch();
  const [modal, showModal] = useState(false);
  const [is2FAModalOpen, open2FAModal] = useState(false);
  const [loading, showLoading] = useState(false);
  const [gRecaptchaResponse, setCaptchaResponse] = useState("");
  const recaptchaRef = useRef(null);
  const storeSession = useStoreSessionSelector();

  const { handleSubmit, errors, register } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  /**
   * @typedef {Object} LoginFormSubmission
   * @property {string} email
   * @property {string} password
   */

  /**
   * Process data submitted in the login form.
   *
   * @param {LoginFormSubmission} payload Submission data.
   * @returns {Void} None.
   */
  const onSubmit = (payload) => {
    // setCaptchaResponse("");
    // recaptchaRef.current.reset();

    showLoading(true);
    dispatch(startTradeApiSession({ ...payload, gRecaptchaResponse }));
  };

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleSubmitClick = () => {
    handleSubmit(onSubmit);
  };

  const loadAppUserData = () => {
    if (!isEmpty(storeSession.tradeApi.accessToken) && !storeSession.tradeApi.ask2FA) {
      const authorizationPayload = {
        token: storeSession.tradeApi.accessToken,
      };

      dispatch(setUserExchanges(authorizationPayload));
      dispatch(setUserData(authorizationPayload));
      navigate("/dashboard/positions");
    }
  };

  useEffect(loadAppUserData, [storeSession.tradeApi.accessToken]);
  useEffect(() => {
    if (storeSession.tradeApi.ask2FA) {
      open2FAModal(true);
    }
  }, [storeSession.tradeApi.ask2FA]);

  console.log(storeSession);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="loginForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Modal onClose={() => showModal(false)} persist={false} size="small" state={modal}>
          <ForgotPasswordForm />
        </Modal>
        <Modal
          onClose={() => {
            open2FAModal(false);
          }}
          persist={true}
          size="small"
          state={is2FAModalOpen}
        >
          <TwoFAForm />
        </Modal>
        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">Email address</label>
          <TextField
            className="customInput"
            error={!!errors.email}
            fullWidth
            inputRef={register({
              required: true,
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
                message: "Email should be valid",
              },
            })}
            name="email"
            type="email"
            variant="outlined"
          />
          {errors.email && <span className="errorText">{errors.email.message}</span>}
        </Box>

        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <PasswordInput
            error={!!errors.password}
            inputRef={register({ required: true })}
            label={<FormattedMessage id={"security.password"} />}
            name="password"
          />
          {errors.password && <span className="errorText">Password cannot be empty</span>}
        </Box>

        <Box className="captchaBox">
          <Captcha onChange={setCaptchaResponse} recaptchaRef={recaptchaRef} />
        </Box>

        <Box className="inputBox">
          <CustomButton
            className={"full submitButton"}
            loading={loading}
            onClick={handleSubmitClick}
            type="submit"
          >
            Sign in
          </CustomButton>
        </Box>
        <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center">
          <span className="link" onClick={() => showModal(true)}>
            Forgot password
          </span>
        </Box>
      </Box>
    </form>
  );
};

export default LoginForm;
