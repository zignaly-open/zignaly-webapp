import React, { useState } from "react";
import "./TwoFAForm.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
// import {verify2FA} from 'actions';
import ReactCodeInput from "react-verification-code-input";
import { useForm, Controller } from "react-hook-form";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 */

const TwoFAForm = () => {
  const [, setCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const {
    register,
    errors,
    handleSubmit,
    control,
    watch,
    setError,
    clearError,
    formState,
  } = useForm({
    mode: "onChange",
  });

  const { isValid } = formState;

  const submitCode = (data) => {
    setLoading(true);
    console.log(data);
    // this.props.dispatch(verify2FA(this.props.user.token, this.state.code));
  };

  return (
    <form onSubmit={handleSubmit(submitCode)}>
      <Box
        alignItems="center"
        className="twoFAForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography variant="h3">2 Factor Authentication</Typography>
        <Box
          alignItems="center"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">
            <Typography>Input Your Authentication Code</Typography>
          </label>
          <Controller
            control={control}
            as={ReactCodeInput}
            className="codeInput"
            fields={6}
            name="code"
            onChange={(val) => val[0]}
            rules={{
              required: true,
              minLength: 6,
            }}
            error={!!errors.code}
          />
          <CustomButton
            className="bgPurple"
            loading={loading}
            fullWidth={true}
            disabled={!isValid}
            type="submit"
          >
            Sign in
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default TwoFAForm;
