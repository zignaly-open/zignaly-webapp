import React, { useState } from "react";
import "./ForgotPasswordForm.scss";
import { Box, TextField } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const { errors, handleSubmit, register } = useForm();

  /**
   * Persists submitted data into Redux store.
   *
   * @returns {void}
   */
  const onSubmit = () => {
    setLoading(true);
    // const params = {
    //   email: data.email,
    //   array: true,
    // };
    // dispatch(recover1(params, this.hideLoader));
  };

//   const handleKeyPress = (event) => {
//     if (event.key === "Enter") {
//       handleSubmit();
//     }
//   };

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
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">Enter your email address</label>
          <TextField
            className="customInput"
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
          {errors.email && <span className="errorText">email should be valid</span>}
        </Box>

        <Box className="inputBox">
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
