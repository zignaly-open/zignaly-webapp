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
        className="forgotPasswordForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <h3>Password Recovery Form</h3>
        <Box
          className="input-box"
          display="flex"
          flexDirection="column"
          justifyContent="start"
          alignItems="start"
        >
          <label className="custom-label">Enter your email address</label>
          <TextField
            className={common.customInput}
            type="email"
            fullWidth
            variant="outlined"
            error={errors.email}
            name="email"
            inputRef={register({
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
            })}
          />
          {errors.email && <span className="error-text">email should be valid</span>}
        </Box>

        <Box className="input-box">
          <CustomButton
            type="submit"
            className={"full submitButton"}
            loading={loading}
            onClick={handleSubmit}
          >
            Recover Account
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default ForgotPasswordForm;
