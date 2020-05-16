import React, { useState } from "react";
import "./LoginForm.scss";
import common from "../../../styles/common.module.scss";
import { Box, TextField, FormControl, InputAdornment, OutlinedInput } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import Modal from "../../Modal";
import ForgotPasswordForm from "../ForgotPasswordForm";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useForm } from "react-hook-form";

const LoginForm = (props) => {
  const [modal, showModal] = useState(false);
  const [loading, showLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, errors, register } = useForm();

  const onSubmit = (data) => {
    showLoading(true);
    console.log(data);
  };

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
          className="input-box"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="custom-label">Email address</label>
          <TextField
            className={common.customInput}
            error={!!errors.email}
            fullWidth
            inputRef={register({
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
            })}
            name="email"
            type="email"
            variant="outlined"
          />
          {errors.email && <span className="error-text">Email should be valid</span>}
        </Box>

        <Box
          alignItems="start"
          className="input-box"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="custom-label">Password</label>
          <FormControl className={common.customInput} variant="outlined">
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  <span className={common.pointer} onClick={() => setShowPassword(!showPassword)}>
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
          {errors.password && <span className="error-text">Password cannot be empty</span>}
        </Box>

        <Box className="input-box">
          <CustomButton
            className={"full submit-btn"}
            loading={loading}
            onClick={handleSubmit}
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
