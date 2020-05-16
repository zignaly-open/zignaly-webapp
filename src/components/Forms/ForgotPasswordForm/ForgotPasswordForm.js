import React, { useState } from "react";
import "./ForgotPasswordForm.scss";
import common from "../../../styles/common.module.scss";
import { Box, TextField } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { errors, handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    const params = {
      email: data.email,
      array: true,
    };
    // dispatch(recover1(params, this.hideLoader));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="forgotPasswordForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <h3>Password Recovery Form</h3>
        <Box
          alignItems="start"
          className="input-box"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="custom-label">Enter your email address</label>
          <TextField
            className={common.customInput}
            error={errors.email}
            fullWidth
            inputRef={register({
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
            })}
            name="email"
            type="email"
            variant="outlined"
          />
          {errors.email && <span className="error-text">email should be valid</span>}
        </Box>

        <Box className="input-box">
          <CustomButton
            className={"full submitButton"}
            loading={loading}
            onClick={handleSubmit}
            type="submit"
          >
            Recover Account
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default ForgotPasswordForm;
