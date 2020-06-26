import React, { useState, useEffect, useRef } from "react";
import "./LoginForm.scss";
import { Box, TextField, FormControl, InputAdornment, OutlinedInput } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import Modal from "../../Modal";
import ForgotPasswordForm from "../ForgotPasswordForm";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { startTradeApiSession } from "../../../store/actions/session";
import { isEmpty } from "lodash";
import { navigate } from "gatsby";
import { setUserExchanges, setUserData } from "../../../store/actions/user";
import Captcha from "../../Captcha";

/**
 * @typedef {import("../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../store/initialState").DefaultStateSession} StateSessionType
 */

const LoginForm = () => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSessionType} Store session data.
   */
  const selectStoreSession = (state) => state.session;
  const storeSession = useSelector(selectStoreSession);
  const dispatch = useDispatch();
  const [modal, showModal] = useState(false);
  const [loading, showLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [gRecaptchaResponse, setCaptchaResponse] = useState("");
  const recaptchaRef = useRef(null);

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
    if (!isEmpty(storeSession.tradeApi.accessToken)) {
      const authorizationPayload = {
        token: storeSession.tradeApi.accessToken,
      };

      dispatch(setUserExchanges(authorizationPayload));
      dispatch(setUserData(authorizationPayload));
      navigate("/dashboard/positions");
    }
  };

  useEffect(loadAppUserData, [storeSession.tradeApi.accessToken]);

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
          <label className="customLabel">Password</label>
          <FormControl className="customInput" variant="outlined">
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  <span className="pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </span>
                </InputAdornment>
              }
              error={!!errors.password}
              inputRef={register({ required: true })}
              name="password"
              type={showPassword ? "text" : "password"}
            />
          </FormControl>
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
