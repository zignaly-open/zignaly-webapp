import React, { useState } from "react";
import "./LoginForm.scss";
import { Box, TextField, FormControl, InputAdornment, OutlinedInput } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import Modal from "../../Modal";
import ForgotPasswordForm from "../ForgotPasswordForm";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useForm } from "react-hook-form";

const LoginForm = () => {
  const [modal, showModal] = useState(false);
  const [loading, showLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, errors, register } = useForm();

  const onSubmit = () => {
    showLoading(true);
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
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
            })}
            name="email"
            type="email"
            variant="outlined"
          />
          {errors.email && <span className="errorText">Email should be valid</span>}
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

        <Box className="inputBox">
          <CustomButton
            className={"full submitButton"}
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
